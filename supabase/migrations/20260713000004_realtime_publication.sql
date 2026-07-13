-- ============================================================================
-- ARENAMIND AI - REALTIME PUBLICATION FIX
-- ============================================================================

-- Ensure the publication exists
BEGIN;
  DO $$ 
  BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_publication WHERE pubname = 'supabase_realtime') THEN
      CREATE PUBLICATION supabase_realtime;
    END IF;
  END
  $$;

  -- Add the missing tables to the publication for Realtime to broadcast them
  ALTER PUBLICATION supabase_realtime ADD TABLE incidents;
  ALTER PUBLICATION supabase_realtime ADD TABLE crowd_data;
  ALTER PUBLICATION supabase_realtime ADD TABLE resources;
  ALTER PUBLICATION supabase_realtime ADD TABLE matches;
  ALTER PUBLICATION supabase_realtime ADD TABLE accessibility_requests;
COMMIT;
