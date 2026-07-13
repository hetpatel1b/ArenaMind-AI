-- ============================================================================
-- ARENAMIND AI - POSTGRESQL & SUPABASE FEATURES
-- ============================================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";
CREATE EXTENSION IF NOT EXISTS "pg_cron";

-- ============================================================================
-- 2. INDEX STRATEGY (Section 9)
-- ============================================================================

-- INCIDENTS
CREATE INDEX IF NOT EXISTS idx_incidents_active_match
  ON incidents (match_id, severity_tier ASC, created_at DESC)
  WHERE status NOT IN ('closed', 'resolved') AND deleted_at IS NULL;

CREATE INDEX IF NOT EXISTS idx_incidents_tier_count
  ON incidents (match_id, severity_tier, status)
  INCLUDE (id)
  WHERE deleted_at IS NULL;

CREATE INDEX IF NOT EXISTS idx_incidents_zone_status
  ON incidents (zone_id, status, severity_tier)
  WHERE deleted_at IS NULL;

CREATE INDEX IF NOT EXISTS idx_incidents_fts
  ON incidents USING GIN (to_tsvector('english', title || ' ' || COALESCE(description, '')))
  WHERE deleted_at IS NULL;

-- CROWD_DATA
CREATE INDEX IF NOT EXISTS idx_crowd_data_latest
  ON crowd_data (match_id, zone_id, recorded_at DESC)
  INCLUDE (fan_count, safe_capacity, density_pct);

CREATE INDEX IF NOT EXISTS idx_crowd_data_time_window
  ON crowd_data (match_id, zone_id, recorded_at)
  WHERE recorded_at > NOW() - INTERVAL '15 minutes';

CREATE INDEX IF NOT EXISTS idx_crowd_data_brin
  ON crowd_data USING BRIN (recorded_at)
  WITH (pages_per_range = 32);

-- RESOURCES
CREATE INDEX IF NOT EXISTS idx_resources_available
  ON resources (match_id, zone_id, resource_type_id)
  WHERE status = 'available' AND deleted_at IS NULL;

CREATE INDEX IF NOT EXISTS idx_resources_match_full
  ON resources (match_id, status, zone_id, resource_type_id)
  WHERE deleted_at IS NULL;

-- AI_RECOMMENDATIONS
CREATE INDEX IF NOT EXISTS idx_ai_rec_analytics
  ON ai_recommendations (feature_name, prompt_version, action_taken, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_ai_rec_pending
  ON ai_recommendations (match_id, feature_name, expires_at DESC)
  WHERE action_taken IS NULL;

-- AI_CALL_LOGS
CREATE INDEX IF NOT EXISTS idx_ai_logs_perf
  ON ai_call_logs (feature_name, latency_ms DESC, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_ai_logs_tokens
  ON ai_call_logs (feature_name, total_tokens DESC, created_at DESC);

-- EXPRESSION INDEXES
CREATE INDEX IF NOT EXISTS idx_users_name_lower
  ON users (LOWER(full_name));

CREATE INDEX IF NOT EXISTS idx_incidents_title_trgm
  ON incidents USING GIN (title gin_trgm_ops)
  WHERE deleted_at IS NULL;

-- JOB_QUEUE
CREATE INDEX IF NOT EXISTS idx_job_queue_worker
  ON job_queue (priority DESC, run_at ASC)
  WHERE status = 'pending'
    AND (lock_expires_at IS NULL OR lock_expires_at < NOW());

-- HEALTH_SCORES and KPI_SNAPSHOTS
CREATE INDEX IF NOT EXISTS idx_health_scores_trend
  ON health_scores (match_id, captured_at DESC)
  INCLUDE (score, incident_score, crowd_score, resource_score);

CREATE INDEX IF NOT EXISTS idx_kpi_snapshots_trend
  ON kpi_snapshots (match_id, captured_at DESC)
  INCLUDE (open_incidents, avg_crowd_density_pct, health_score);

-- ============================================================================
-- 3. UTILITY FUNCTIONS (For RLS & Logic)
-- ============================================================================

CREATE OR REPLACE FUNCTION get_user_stadium_id()
RETURNS UUID
LANGUAGE sql SECURITY DEFINER STABLE
AS $$
  SELECT stadium_id FROM users WHERE id::uuid = auth.uid();
$$;

CREATE OR REPLACE FUNCTION get_user_role()
RETURNS TEXT
LANGUAGE sql SECURITY DEFINER STABLE
AS $$
  SELECT role FROM users WHERE id::uuid = auth.uid();
$$;

-- ============================================================================
-- 4. ROW LEVEL SECURITY (Section 10)
-- ============================================================================

ALTER TABLE stadiums ENABLE ROW LEVEL SECURITY;
ALTER TABLE matches ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE zones ENABLE ROW LEVEL SECURITY;
ALTER TABLE incidents ENABLE ROW LEVEL SECURITY;
ALTER TABLE resources ENABLE ROW LEVEL SECURITY;
ALTER TABLE crowd_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_recommendations ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_call_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE reports ENABLE ROW LEVEL SECURITY;

-- STADIUMS
CREATE POLICY "stadiums_select_own" ON stadiums FOR SELECT USING (id = get_user_stadium_id());

-- MATCHES
CREATE POLICY "matches_select_own_stadium" ON matches FOR SELECT USING (stadium_id = get_user_stadium_id());
CREATE POLICY "matches_update_phase_manager_only" ON matches FOR UPDATE 
  USING (stadium_id = get_user_stadium_id() AND get_user_role() = 'operations_manager')
  WITH CHECK (stadium_id = get_user_stadium_id() AND get_user_role() = 'operations_manager');

-- USERS
CREATE POLICY "users_select_own_stadium" ON users FOR SELECT USING (stadium_id = get_user_stadium_id());
CREATE POLICY "users_update_self" ON users FOR UPDATE 
  USING (id::uuid = auth.uid()) WITH CHECK (id::uuid = auth.uid() AND stadium_id = get_user_stadium_id());

-- INCIDENTS
CREATE POLICY "incidents_select_own_stadium" ON incidents FOR SELECT 
  USING (stadium_id = get_user_stadium_id() AND deleted_at IS NULL);
CREATE POLICY "incidents_insert_operational_roles" ON incidents FOR INSERT 
  WITH CHECK (stadium_id = get_user_stadium_id() AND get_user_role() IN ('operations_manager', 'deputy_manager', 'coordinator'));
CREATE POLICY "incidents_update_operational_roles" ON incidents FOR UPDATE 
  USING (stadium_id = get_user_stadium_id() AND deleted_at IS NULL AND get_user_role() IN ('operations_manager', 'deputy_manager', 'coordinator'));
CREATE POLICY "incidents_no_hard_delete" ON incidents FOR DELETE USING (false);

-- CROWD_DATA
CREATE POLICY "crowd_data_select_own_stadium" ON crowd_data FOR SELECT USING (stadium_id = get_user_stadium_id());
CREATE POLICY "crowd_data_insert_service_only" ON crowd_data FOR INSERT WITH CHECK (auth.role() = 'service_role');
CREATE POLICY "crowd_data_no_update" ON crowd_data FOR UPDATE USING (false);

-- AI_RECOMMENDATIONS
CREATE POLICY "ai_rec_select_own_stadium" ON ai_recommendations FOR SELECT USING (stadium_id = get_user_stadium_id());
CREATE POLICY "ai_rec_insert_service_only" ON ai_recommendations FOR INSERT WITH CHECK (auth.role() = 'service_role');
CREATE POLICY "ai_rec_update_decision" ON ai_recommendations FOR UPDATE 
  USING (stadium_id = get_user_stadium_id() AND get_user_role() IN ('operations_manager', 'deputy_manager') AND action_taken IS NULL)
  WITH CHECK (stadium_id = get_user_stadium_id());

-- AI_CALL_LOGS
CREATE POLICY "ai_call_logs_admin_only" ON ai_call_logs FOR SELECT USING (auth.role() = 'service_role' OR get_user_role() = 'operations_manager');
CREATE POLICY "ai_call_logs_insert_service_only" ON ai_call_logs FOR INSERT WITH CHECK (auth.role() = 'service_role');
CREATE POLICY "ai_call_logs_immutable" ON ai_call_logs FOR UPDATE USING (false);
CREATE POLICY "ai_call_logs_no_delete" ON ai_call_logs FOR DELETE USING (false);

-- AUDIT_LOGS
CREATE POLICY "audit_logs_select_admin" ON audit_logs FOR SELECT USING (auth.role() = 'service_role');
CREATE POLICY "audit_logs_insert_trigger_only" ON audit_logs FOR INSERT WITH CHECK (auth.role() = 'service_role');
CREATE POLICY "audit_logs_immutable" ON audit_logs FOR UPDATE USING (false);
CREATE POLICY "audit_logs_no_delete" ON audit_logs FOR DELETE USING (false);

-- RESOURCES
CREATE POLICY "resources_select_own_stadium" ON resources FOR SELECT USING (stadium_id = get_user_stadium_id() AND deleted_at IS NULL);
CREATE POLICY "resources_insert_operational" ON resources FOR INSERT WITH CHECK (stadium_id = get_user_stadium_id() AND get_user_role() IN ('operations_manager', 'deputy_manager', 'coordinator'));
CREATE POLICY "resources_update_operational" ON resources FOR UPDATE USING (stadium_id = get_user_stadium_id() AND deleted_at IS NULL AND get_user_role() IN ('operations_manager', 'deputy_manager', 'coordinator'));

-- ============================================================================
-- 5. RPC FUNCTIONS (Section 11.3)
-- ============================================================================

CREATE OR REPLACE FUNCTION calculate_health_score(p_match_id UUID)
RETURNS INTEGER
LANGUAGE plpgsql STABLE SECURITY DEFINER
AS $$
DECLARE
  v_tier1_count   INTEGER;
  v_open_count    INTEGER;
  v_critical_zones INTEGER;
  v_resource_score INTEGER;
  v_incident_score INTEGER;
  v_crowd_score    INTEGER;
  v_final_score    INTEGER;
BEGIN
  SELECT COUNT(*) INTO v_tier1_count FROM incidents WHERE match_id = p_match_id AND severity_tier = 1 AND status NOT IN ('resolved', 'closed') AND deleted_at IS NULL;
  SELECT COUNT(*) INTO v_open_count FROM incidents WHERE match_id = p_match_id AND status NOT IN ('resolved', 'closed') AND deleted_at IS NULL;
  SELECT COUNT(DISTINCT zone_id) INTO v_critical_zones FROM crowd_data WHERE match_id = p_match_id AND density_pct >= 90 AND recorded_at > NOW() - INTERVAL '5 minutes';

  v_incident_score := GREATEST(0, 100 - (v_tier1_count * 30) - (v_open_count * 2));
  v_incident_score := LEAST(100, v_incident_score);
  v_crowd_score := GREATEST(0, 100 - (v_critical_zones * 15));
  v_resource_score := 80;

  v_final_score := ((v_incident_score * 40) + (v_crowd_score * 30) + (v_resource_score * 20) + (80 * 10)) / 100;
  RETURN LEAST(100, GREATEST(0, v_final_score));
END;
$$;

-- ============================================================================
-- 6. TRIGGERS (Section 11.4)
-- ============================================================================

CREATE OR REPLACE FUNCTION write_audit_log() RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO audit_logs (record_id, action, timestamp) VALUES (COALESCE(NEW.id, OLD.id), TG_OP, NOW());
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER trg_incidents_audit AFTER UPDATE OR DELETE ON incidents FOR EACH ROW EXECUTE FUNCTION write_audit_log();
CREATE TRIGGER trg_resources_audit AFTER UPDATE OR DELETE ON resources FOR EACH ROW EXECUTE FUNCTION write_audit_log();
CREATE TRIGGER trg_matches_audit AFTER UPDATE ON matches FOR EACH ROW EXECUTE FUNCTION write_audit_log();

CREATE OR REPLACE FUNCTION sync_stadium_zone_count() RETURNS TRIGGER AS $$
BEGIN
  UPDATE stadiums SET zone_count = (SELECT COUNT(*) FROM zones WHERE stadium_id = COALESCE(NEW.stadium_id, OLD.stadium_id) AND is_active = true) WHERE id = COALESCE(NEW.stadium_id, OLD.stadium_id);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_zones_sync_count AFTER INSERT OR UPDATE OR DELETE ON zones FOR EACH ROW EXECUTE FUNCTION sync_stadium_zone_count();

-- ============================================================================
-- 7. MATERIALIZED VIEWS (Section 12.2)
-- ============================================================================

CREATE MATERIALIZED VIEW mv_match_analytics AS
SELECT
  m.id AS match_id,
  m.stadium_id,
  m.home_team,
  m.away_team,
  m.scheduled_at,
  m.current_phase,
  COUNT(DISTINCT i.id) AS total_incidents,
  COUNT(DISTINCT i.id) FILTER (WHERE i.severity_tier = 1) AS tier1_incidents,
  COUNT(DISTINCT i.id) FILTER (WHERE i.status = 'resolved') AS resolved_incidents,
  AVG(EXTRACT(EPOCH FROM (i.resolved_at - i.created_at)) / 60) FILTER (WHERE i.resolved_at IS NOT NULL) AS avg_resolution_min,
  MAX(cd.density_pct) AS peak_density_pct,
  AVG(cd.density_pct) AS avg_density_pct,
  COUNT(DISTINCT ar.id) FILTER (WHERE ar.feature_name = 'incident_recommend') AS ai_incident_recommendations,
  COUNT(DISTINCT ar.id) FILTER (WHERE ar.action_taken = 'accepted') AS ai_accepted_recommendations,
  hs.latest_health_score
FROM matches m
LEFT JOIN incidents i ON i.match_id = m.id AND i.deleted_at IS NULL
LEFT JOIN crowd_data cd ON cd.match_id = m.id
LEFT JOIN ai_recommendations ar ON ar.match_id = m.id
LEFT JOIN LATERAL (SELECT score AS latest_health_score FROM health_scores WHERE match_id = m.id ORDER BY captured_at DESC LIMIT 1) hs ON true
GROUP BY m.id, m.stadium_id, m.home_team, m.away_team, m.scheduled_at, m.current_phase, hs.latest_health_score;

CREATE UNIQUE INDEX ON mv_match_analytics (match_id);
CREATE INDEX ON mv_match_analytics (stadium_id);

-- ============================================================================
-- 8. REALTIME (Section 14)
-- ============================================================================

ALTER TABLE incidents REPLICA IDENTITY FULL;
ALTER TABLE crowd_data REPLICA IDENTITY FULL;
ALTER TABLE resources REPLICA IDENTITY FULL;
ALTER TABLE matches REPLICA IDENTITY FULL;
ALTER TABLE accessibility_requests REPLICA IDENTITY FULL;
