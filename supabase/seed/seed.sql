-- ============================================================================
-- ARENAMIND AI - SEED DATA (FIFA World Cup 2026 Demo)
-- ============================================================================

-- TRUNCATE existing data
TRUNCATE TABLE stadiums, zones, matches, users, incident_types, resource_types CASCADE;

-- 1. STADIUM
INSERT INTO stadiums (id, name, short_name, city, country, capacity, latitude, longitude, timezone, zone_count)
VALUES ('00000000-0000-0000-0000-000000000001', 'Lusail Stadium', 'LUS', 'Lusail', 'Qatar', 88966, 25.420833, 51.490278, 'Asia/Riyadh', 4);

-- 2. ZONES
INSERT INTO zones (id, stadium_id, name, short_code, capacity, safe_capacity, is_active)
VALUES
('00000000-0000-0000-0001-000000000001', '00000000-0000-0000-0000-000000000001', 'North Gate Entrance', 'N-GATE', 15000, 12000, true),
('00000000-0000-0000-0001-000000000002', '00000000-0000-0000-0000-000000000001', 'South Gate Entrance', 'S-GATE', 15000, 12000, true),
('00000000-0000-0000-0001-000000000003', '00000000-0000-0000-0000-000000000001', 'East Concourse', 'E-CONC', 20000, 18000, true),
('00000000-0000-0000-0001-000000000004', '00000000-0000-0000-0000-000000000001', 'West Concourse', 'W-CONC', 20000, 18000, true);

-- 3. MATCHES
INSERT INTO matches (id, stadium_id, match_number, home_team, away_team, scheduled_at, current_phase, match_status, expected_attendance)
VALUES
('00000000-0000-0000-0002-000000000001', '00000000-0000-0000-0000-000000000001', 64, 'Argentina', 'France', NOW() + INTERVAL '1 day', 'pre_event', 'scheduled', 88966),
('00000000-0000-0000-0002-000000000002', '00000000-0000-0000-0000-000000000001', 61, 'Brazil', 'Croatia', NOW() - INTERVAL '1 day', 'post_event', 'completed', 85000);

-- 4. USERS (Demo Admin: 00000000-0000-0000-0003-000000000001)
-- Note: id must match auth.users (which would be created in the application)
INSERT INTO users (id, stadium_id, full_name, role, department, employee_id)
VALUES
('00000000-0000-0000-0003-000000000001', '00000000-0000-0000-0000-000000000001', 'Admin User', 'operations_manager', 'Command Center', 'EMP-001'),
('00000000-0000-0000-0003-000000000002', '00000000-0000-0000-0000-000000000001', 'Field Coordinator', 'coordinator', 'Field Ops', 'EMP-002');

-- 5. INCIDENT TYPES
INSERT INTO incident_types (id, name, description, default_tier)
VALUES
('00000000-0000-0000-0004-000000000001', 'Medical Emergency', 'Urgent medical assistance required', 1),
('00000000-0000-0000-0004-000000000002', 'Crowd Congestion', 'High density crowd crush risk', 2),
('00000000-0000-0000-0004-000000000003', 'Facility Issue', 'Broken seat, plumbing, or lighting', 4),
('00000000-0000-0000-0004-000000000004', 'Security Breach', 'Unauthorized access or physical altercation', 1);

-- 6. RESOURCE TYPES
INSERT INTO resource_types (id, name, description)
VALUES
('00000000-0000-0000-0005-000000000001', 'Medical Team', 'Paramedics with AED'),
('00000000-0000-0000-0005-000000000002', 'Security Squad', 'Standard security personnel'),
('00000000-0000-0000-0005-000000000003', 'Maintenance Crew', 'Facilities repair team');

-- 7. RESOURCES
INSERT INTO resources (id, stadium_id, resource_type_id, name, status, zone_id)
VALUES
(gen_random_uuid(), '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0005-000000000001', 'Med Team Alpha', 'available', '00000000-0000-0000-0001-000000000001'),
(gen_random_uuid(), '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0005-000000000002', 'Sec Squad Bravo', 'available', '00000000-0000-0000-0001-000000000002');
