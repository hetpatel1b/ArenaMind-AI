-- ============================================================================
-- ARENAMIND AI - MISSING FUNCTIONS, TRIGGERS, AND CRONS
-- ============================================================================

-- ============================================================================
-- 1. MISSING RPC FUNCTIONS
-- ============================================================================

CREATE OR REPLACE FUNCTION get_crowd_context(p_match_id UUID, p_window_minutes INTEGER DEFAULT 15)
RETURNS JSONB
LANGUAGE plpgsql STABLE SECURITY DEFINER
AS $$
DECLARE
  v_result JSONB;
BEGIN
  SELECT jsonb_agg(zone_stats) INTO v_result
  FROM (
    SELECT
      z.name AS zone_name,
      z.short_code AS zone_code,
      cd.latest_density,
      cd.avg_density,
      cd.fan_count,
      z.safe_capacity,
      CASE
        WHEN cd.latest_density >= 90 THEN 'critical'
        WHEN cd.latest_density >= 80 THEN 'high'
        WHEN cd.latest_density >= 60 THEN 'elevated'
        WHEN cd.latest_density >= 30 THEN 'normal'
        ELSE 'sparse'
      END AS density_level
    FROM zones z
    JOIN (
      SELECT
        zone_id,
        MAX(density_pct) FILTER (WHERE recorded_at = (SELECT MAX(recorded_at) FROM crowd_data cd2 WHERE cd2.zone_id = cd1.zone_id AND cd2.match_id = p_match_id)) AS latest_density,
        AVG(density_pct) AS avg_density,
        MAX(fan_count) AS fan_count
      FROM crowd_data cd1
      WHERE match_id = p_match_id
        AND recorded_at > NOW() - (p_window_minutes || ' minutes')::INTERVAL
      GROUP BY zone_id
    ) cd ON z.id = cd.zone_id
    WHERE z.stadium_id = (SELECT stadium_id FROM matches WHERE id = p_match_id)
    ORDER BY cd.latest_density DESC
  ) zone_stats;

  RETURN COALESCE(v_result, '[]'::jsonb);
END;
$$;


CREATE OR REPLACE FUNCTION get_match_summary(p_match_id UUID)
RETURNS JSONB
LANGUAGE plpgsql STABLE SECURITY DEFINER
AS $$
DECLARE
  v_result JSONB;
BEGIN
  SELECT jsonb_build_object(
    'match_id', m.id,
    'home_team', m.home_team,
    'away_team', m.away_team,
    'stadium', s.name,
    'phase', m.current_phase,
    'scheduled_at', m.scheduled_at,
    'incident_summary', (
      SELECT jsonb_build_object(
        'total', COUNT(*),
        'tier1', COUNT(*) FILTER (WHERE severity_tier = 1),
        'tier2', COUNT(*) FILTER (WHERE severity_tier = 2),
        'resolved', COUNT(*) FILTER (WHERE status = 'resolved'),
        'open', COUNT(*) FILTER (WHERE status NOT IN ('resolved', 'closed'))
      )
      FROM incidents
      WHERE match_id = p_match_id AND deleted_at IS NULL
    ),
    'peak_crowd_density', (
      SELECT MAX(density_pct)
      FROM crowd_data
      WHERE match_id = p_match_id
    ),
    'ai_acceptance_rate', (
      SELECT ROUND(
        COUNT(*) FILTER (WHERE action_taken = 'accepted')::NUMERIC /
        NULLIF(COUNT(*) FILTER (WHERE action_taken IS NOT NULL), 0) * 100, 1
      )
      FROM ai_recommendations
      WHERE match_id = p_match_id
    )
  ) INTO v_result
  FROM matches m
  JOIN stadiums s ON m.stadium_id = s.id
  WHERE m.id = p_match_id;

  RETURN v_result;
END;
$$;

-- ============================================================================
-- 2. MISSING TRIGGERS
-- ============================================================================

CREATE OR REPLACE FUNCTION notify_tier1_incident()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.severity_tier = 1 AND (OLD.severity_tier IS NULL OR OLD.severity_tier != 1) THEN
    INSERT INTO notifications (user_id, match_id, type, title, body, data)
    SELECT
      u.id,
      NEW.match_id,
      'alert',
      '🔴 TIER 1 INCIDENT: ' || NEW.title,
      'Zone ' || COALESCE(z.name, 'Unknown') || ' — ' || LEFT(NEW.description, 100),
      jsonb_build_object('incident_id', NEW.id, 'zone_id', NEW.zone_id)
    FROM users u
    LEFT JOIN zones z ON z.id = NEW.zone_id
    WHERE u.stadium_id = NEW.stadium_id
      AND u.is_active = true
      AND u.role IN ('operations_manager', 'deputy_manager');
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER trg_incidents_tier1_notify
  AFTER INSERT OR UPDATE OF severity_tier ON incidents
  FOR EACH ROW EXECUTE FUNCTION notify_tier1_incident();

-- ============================================================================
-- 3. CRON JOBS
-- ============================================================================

SELECT cron.schedule(
  'kpi-snapshot-aggregation',
  '*/5 * * * *',
  $$
  INSERT INTO kpi_snapshots (
    match_id, stadium_id, phase,
    open_incidents, tier1_incidents, resolved_incidents,
    avg_crowd_density_pct, zones_above_alert,
    resources_deployed, resources_available,
    health_score
  )
  SELECT
    m.id AS match_id,
    m.stadium_id,
    m.current_phase AS phase,
    COUNT(i.id) FILTER (WHERE i.status NOT IN ('resolved', 'closed')) AS open_incidents,
    COUNT(i.id) FILTER (WHERE i.severity_tier = 1 AND i.status NOT IN ('resolved', 'closed')) AS tier1_incidents,
    COUNT(i.id) FILTER (WHERE i.status = 'resolved') AS resolved_incidents,
    AVG(cd_latest.density_pct)::NUMERIC(5,2) AS avg_crowd_density_pct,
    COUNT(DISTINCT cd_latest.zone_id) FILTER (WHERE cd_latest.density_pct >= 85) AS zones_above_alert,
    COUNT(r.id) FILTER (WHERE r.status = 'deployed') AS resources_deployed,
    COUNT(r.id) FILTER (WHERE r.status = 'available') AS resources_available,
    calculate_health_score(m.id) AS health_score
  FROM matches m
  LEFT JOIN incidents i ON i.match_id = m.id AND i.deleted_at IS NULL
  LEFT JOIN resources r ON r.match_id = m.id AND r.deleted_at IS NULL
  LEFT JOIN LATERAL (
    SELECT zone_id, density_pct
    FROM crowd_data
    WHERE match_id = m.id
    ORDER BY recorded_at DESC
    LIMIT 1
  ) cd_latest ON true
  WHERE m.match_status = 'active'
  GROUP BY m.id, m.stadium_id, m.current_phase;
  $$
);

SELECT cron.schedule(
  'expire-ai-recommendations',
  '*/15 * * * *',
  $$
  UPDATE ai_recommendations
  SET action_taken = 'expired', updated_at = NOW()
  WHERE action_taken IS NULL
    AND expires_at < NOW()
    AND created_at < NOW() - INTERVAL '15 minutes';
  $$
);

SELECT cron.schedule(
  'cleanup-rate-limits',
  '0 * * * *',
  $$
  DELETE FROM rate_limits WHERE window_end < NOW() - INTERVAL '1 hour';
  $$
);

SELECT cron.schedule(
  'archive-old-partitions',
  '0 2 1 * *',
  $$
  INSERT INTO audit_logs (record_id, action, timestamp)
  VALUES (gen_random_uuid(), 'Partition maintenance required for crowd_data', NOW());
  $$
);
