-- ============================================================================
-- ARENAMIND AI - ENTERPRISE SECURITY COMPLIANCE FIXES
-- ============================================================================

-- ============================================================================
-- 1. ROW LEVEL SECURITY (RLS) ON ALL MISSING TABLES
-- ============================================================================

ALTER TABLE incident_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE resource_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE kpi_snapshots ENABLE ROW LEVEL SECURITY;
ALTER TABLE health_scores ENABLE ROW LEVEL SECURITY;
ALTER TABLE phase_transitions ENABLE ROW LEVEL SECURITY;
ALTER TABLE accessibility_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE weather_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE job_queue ENABLE ROW LEVEL SECURITY;
ALTER TABLE system_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE feature_flags ENABLE ROW LEVEL SECURITY;
ALTER TABLE alert_thresholds ENABLE ROW LEVEL SECURITY;
ALTER TABLE queue_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_feedback ENABLE ROW LEVEL SECURITY;
ALTER TABLE incident_actions ENABLE ROW LEVEL SECURITY;
ALTER TABLE incident_attachments ENABLE ROW LEVEL SECURITY;
ALTER TABLE rate_limits ENABLE ROW LEVEL SECURITY;

-- Reference Tables (Global Read)
CREATE POLICY "incident_types_read" ON incident_types FOR SELECT USING (true);
CREATE POLICY "resource_types_read" ON resource_types FOR SELECT USING (true);

-- Stadium Scoped Tables
CREATE POLICY "kpi_snapshots_read" ON kpi_snapshots FOR SELECT USING (stadium_id = get_user_stadium_id());
CREATE POLICY "health_scores_read" ON health_scores FOR SELECT USING (stadium_id = get_user_stadium_id());
CREATE POLICY "system_settings_read" ON system_settings FOR SELECT USING (stadium_id = get_user_stadium_id());
CREATE POLICY "feature_flags_read" ON feature_flags FOR SELECT USING (stadium_id = get_user_stadium_id());
CREATE POLICY "alert_thresholds_read" ON alert_thresholds FOR SELECT USING (stadium_id = get_user_stadium_id());

-- Match Scoped Tables
CREATE POLICY "weather_data_read" ON weather_data FOR SELECT USING (match_id IN (SELECT id FROM matches WHERE stadium_id = get_user_stadium_id()));
CREATE POLICY "phase_transitions_read" ON phase_transitions FOR SELECT USING (match_id IN (SELECT id FROM matches WHERE stadium_id = get_user_stadium_id()));
CREATE POLICY "accessibility_requests_read" ON accessibility_requests FOR SELECT USING (match_id IN (SELECT id FROM matches WHERE stadium_id = get_user_stadium_id()));
CREATE POLICY "queue_data_read" ON queue_data FOR SELECT USING (match_id IN (SELECT id FROM matches WHERE stadium_id = get_user_stadium_id()));

-- User Scoped Tables
CREATE POLICY "notifications_read" ON notifications FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "activity_logs_read" ON activity_logs FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "ai_feedback_read" ON ai_feedback FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "incident_actions_read" ON incident_actions FOR SELECT USING (user_id = auth.uid());

-- Nested Scoped Tables
CREATE POLICY "incident_attachments_read" ON incident_attachments FOR SELECT USING (incident_id IN (SELECT id FROM incidents WHERE stadium_id = get_user_stadium_id()));

-- Service Role Only Tables
CREATE POLICY "job_queue_service_only" ON job_queue USING (auth.role() = 'service_role');
CREATE POLICY "rate_limits_service_only" ON rate_limits USING (auth.role() = 'service_role');

-- ============================================================================
-- 2. STORAGE BUCKET POLICIES
-- ============================================================================

-- avatars (Public read, users can insert their own)
CREATE POLICY "avatars_read" ON storage.objects FOR SELECT USING (bucket_id = 'avatars');
CREATE POLICY "avatars_insert" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);

-- incident-attachments (Add insert policy)
CREATE POLICY "attachments_insert_own_stadium" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'incident-attachments' AND (storage.foldername(name))[1] = get_user_stadium_id()::text);

-- ai-exports
CREATE POLICY "ai_exports_read_own" ON storage.objects FOR SELECT USING (bucket_id = 'ai-exports' AND auth.uid()::text = (storage.foldername(name))[1]);

-- system-assets
CREATE POLICY "system_assets_read" ON storage.objects FOR SELECT USING (bucket_id = 'system-assets');

-- ============================================================================
-- 3. RPC / TRIGGERS SECURITY DEFINER SEARCH PATH FIXES
-- ============================================================================

-- Enterprise security requires SET search_path = public for SECURITY DEFINER functions
ALTER FUNCTION get_user_stadium_id() SET search_path = public;
ALTER FUNCTION get_user_role() SET search_path = public;
ALTER FUNCTION calculate_health_score(UUID) SET search_path = public;
ALTER FUNCTION write_audit_log() SET search_path = public;
ALTER FUNCTION get_crowd_context(UUID, INTEGER) SET search_path = public;
ALTER FUNCTION get_match_summary(UUID) SET search_path = public;
ALTER FUNCTION notify_tier1_incident() SET search_path = public;

-- ============================================================================
-- 4. MATERIALIZED VIEW SECURITY
-- ============================================================================

-- Materialized views bypass RLS. Revoke all public access, restrict to service_role.
REVOKE ALL ON mv_match_analytics FROM PUBLIC, anon, authenticated;
GRANT SELECT ON mv_match_analytics TO service_role;

-- ============================================================================
-- 5. REALTIME PUBLICATION SUPPLEMENT
-- ============================================================================

BEGIN;
  -- Ensure notifications are broadcasted to users securely via RLS over websockets
  ALTER PUBLICATION supabase_realtime ADD TABLE notifications;
COMMIT;
