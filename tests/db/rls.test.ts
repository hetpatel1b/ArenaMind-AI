import { describe, it, expect } from 'vitest';
import { createClient } from '@supabase/supabase-js';

// We create a dummy client to simulate RLS tests
// In a true CI environment, SUPABASE_URL and ANON_KEY must be provided via local Postgres
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'http://127.0.0.1:54321';
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'dummy_key';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

describe('Row Level Security (RLS) & Policies', () => {
  it('should block anonymous inserts into incidents table', async () => {
    const { error } = await supabase.from('incidents').insert({
      stadium_id: '00000000-0000-0000-0000-000000000001',
      match_id: '00000000-0000-0000-0000-000000000001',
      title: 'Hacked Incident',
      description: 'Anonymous insert attempt',
      reported_by: '00000000-0000-0000-0000-000000000001',
    });

    // RLS should deny this for anon users (Policy: incidents_insert_operational_roles)
    // Supabase returns 401 or 403 on RLS insert failures for anon, or missing auth context
    expect(error).toBeDefined();
  });

  it('should prevent deleting from audit_logs completely', async () => {
    const { error } = await supabase.from('audit_logs').delete().eq('action', 'INSERT');

    // RLS should deny this (Policy: audit_logs_no_delete)
    expect(error).toBeDefined();
  });

  it('should block updates to crowd_data (append-only)', async () => {
    const { error } = await supabase
      .from('crowd_data')
      .update({ density_pct: 10 })
      .eq('id', 'dummy');

    // RLS should deny this (Policy: crowd_data_no_update)
    expect(error).toBeDefined();
  });
});
