'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createBrowserClient } from '@supabase/ssr';
import { PressFeedback } from '@/app/components/motion/MicroInteractions';
import { WarningShake } from '@/app/components/motion/AttentionMotion';
import { CinematicTransition } from '@/app/components/motion/CinematicTransition';
import { useAccessibleId, buildErrorAttributes, buildLabelAttributes } from '@/lib/accessibility';

export default function RequestAccessPage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [organization, setOrganization] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('Incident Coordinator');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const nameId = useAccessibleId('name');
  const orgId = useAccessibleId('org');
  const emailId = useAccessibleId('email');
  const roleId = useAccessibleId('role');
  const passwordId = useAccessibleId('password');
  const errorId = useAccessibleId('error');

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const handleRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      // In a real enterprise environment, this would integrate with SSO.
      // For this implementation, we provision a local Supabase auth account.
      const { error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: name,
            organization: organization,
            role: role,
          },
        },
      });

      if (signUpError) throw signUpError;

      setIsTransitioning(true);
    } catch (err: SafeAny) {
      setError(err.message || 'Failed to provision demo access');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <WarningShake trigger={error}>
        <form
          onSubmit={handleRequest}
          style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}
        >
          <div style={{ textAlign: 'center', marginBottom: 'var(--space-2)' }}>
            <h2 style={{ fontSize: 'var(--text-lg)', fontWeight: 'bold' }}>
              Request Operator Access
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: 'var(--text-sm)' }}>
              Provision a demo environment for Hackathon evaluation.
            </p>
          </div>

          {error && (
            <div
              id={errorId}
              role="alert"
              style={{
                padding: 'var(--space-3)',
                backgroundColor: 'var(--status-critical-bg)',
                color: 'var(--status-critical)',
                borderRadius: 'var(--radius-md)',
                fontSize: 'var(--text-sm)',
                border: '1px solid rgba(255, 59, 48, 0.2)',
              }}
            >
              {error}
            </div>
          )}

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-3)' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-1)' }}>
              <label
                {...buildLabelAttributes(nameId).labelProps}
                style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)' }}
              >
                Full Name
              </label>
              <input
                {...buildLabelAttributes(nameId).inputProps}
                {...buildErrorAttributes(!!error, errorId)}
                type="text"
                autoComplete="name"
                required
                disabled={isLoading}
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="form-input"
                style={{
                  width: '100%',
                  padding: 'var(--space-2)',
                  backgroundColor: 'rgba(255,255,255,0.05)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-sm)',
                  color: 'var(--text-primary)',
                  outline: 'none',
                }}
              />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-1)' }}>
              <label
                {...buildLabelAttributes(orgId).labelProps}
                style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)' }}
              >
                Organization
              </label>
              <input
                {...buildLabelAttributes(orgId).inputProps}
                {...buildErrorAttributes(!!error, errorId)}
                type="text"
                autoComplete="organization"
                required
                disabled={isLoading}
                value={organization}
                onChange={(e) => setOrganization(e.target.value)}
                className="form-input"
                style={{
                  width: '100%',
                  padding: 'var(--space-2)',
                  backgroundColor: 'rgba(255,255,255,0.05)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-sm)',
                  color: 'var(--text-primary)',
                  outline: 'none',
                }}
              />
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-1)' }}>
            <label
              {...buildLabelAttributes(emailId).labelProps}
              style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)' }}
            >
              Work Email
            </label>
            <input
              {...buildLabelAttributes(emailId).inputProps}
              {...buildErrorAttributes(!!error, errorId)}
              type="email"
              inputMode="email"
              autoComplete="email"
              required
              disabled={isLoading}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="form-input"
              style={{
                width: '100%',
                padding: 'var(--space-2)',
                backgroundColor: 'rgba(255,255,255,0.05)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-sm)',
                color: 'var(--text-primary)',
                outline: 'none',
              }}
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-1)' }}>
            <label
              {...buildLabelAttributes(roleId).labelProps}
              style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)' }}
            >
              Demo Role
            </label>
            <select
              {...buildLabelAttributes(roleId).inputProps}
              disabled={isLoading}
              value={role}
              onChange={(e) => setRole(e.target.value)}
              style={{
                width: '100%',
                padding: 'var(--space-2)',
                backgroundColor: 'rgba(255,255,255,0.05)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-sm)',
                color: 'var(--text-primary)',
                outline: 'none',
              }}
            >
              <option value="FIFA Operations Manager">FIFA Operations Manager</option>
              <option value="Incident Coordinator">Incident Coordinator</option>
              <option value="Transport Lead">Transport Lead</option>
            </select>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-1)' }}>
            <label
              {...buildLabelAttributes(passwordId).labelProps}
              style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)' }}
            >
              Demo Password
            </label>
            <input
              {...buildLabelAttributes(passwordId).inputProps}
              {...buildErrorAttributes(!!error, errorId)}
              type="password"
              autoComplete="new-password"
              required
              disabled={isLoading}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="form-input"
              style={{
                width: '100%',
                padding: 'var(--space-2)',
                backgroundColor: 'rgba(255,255,255,0.05)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-sm)',
                color: 'var(--text-primary)',
                outline: 'none',
              }}
            />
          </div>

          <div style={{ display: 'flex', gap: 'var(--space-2)', marginTop: 'var(--space-2)' }}>
            <button
              type="button"
              onClick={() => router.push('/login')}
              disabled={isLoading}
              className="btn btn-outline"
              style={{ flex: 1, padding: 'var(--space-2)' }}
            >
              Cancel
            </button>
            <PressFeedback scale={0.97}>
              <button
                type="submit"
                disabled={isLoading}
                aria-busy={isLoading}
                className="btn btn-primary"
                style={{ flex: 2, padding: 'var(--space-2)' }}
              >
                {isLoading ? 'Provisioning...' : 'Activate Demo Access'}
              </button>
            </PressFeedback>
          </div>
        </form>
      </WarningShake>

      {isTransitioning && <CinematicTransition />}
    </>
  );
}
