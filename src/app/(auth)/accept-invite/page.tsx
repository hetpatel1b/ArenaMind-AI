'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createBrowserClient } from '@supabase/ssr';
import { PressFeedback } from '@/app/components/motion/MicroInteractions';
import { WarningShake } from '@/app/components/motion/AttentionMotion';
import { CinematicTransition } from '@/app/components/motion/CinematicTransition';
import { useAccessibleId, buildErrorAttributes, buildLabelAttributes } from '@/lib/accessibility';

export default function AcceptInvitePage() {
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const passwordId = useAccessibleId('password');
  const errorId = useAccessibleId('error');

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const handleAccept = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      // For invitation acceptance, the user arrives via a magic link that establishes an active session.
      // We must immediately update their password to secure the account.
      const { error: updateError } = await supabase.auth.updateUser({
        password: password,
      });

      if (updateError) throw updateError;

      setIsTransitioning(true);
    } catch (err: SafeAny) {
      setError(err.message || 'Failed to establish clearance');
    } finally {
      setIsLoading(false);
    }
  };

  const strength = Math.min(password.length / 12, 1) * 100;
  const strengthColor =
    strength < 50
      ? 'var(--status-critical)'
      : strength < 80
        ? 'var(--status-warning)'
        : 'var(--status-success)';

  return (
    <>
      <WarningShake trigger={error}>
        <form
          onSubmit={handleAccept}
          style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}
        >
          <div
            style={{
              padding: 'var(--space-3)',
              backgroundColor: 'var(--status-info-bg)',
              color: 'var(--status-info)',
              borderRadius: 'var(--radius-md)',
              fontSize: 'var(--text-sm)',
              border: '1px solid rgba(10, 132, 255, 0.2)',
            }}
          >
            <strong>Welcome to ArenaMind AI.</strong> Your identity has been verified by the Command
            Center. Please establish your security clearance to proceed.
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

          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: 'var(--space-2)',
              marginTop: 'var(--space-2)',
            }}
          >
            <label
              {...buildLabelAttributes(passwordId).labelProps}
              style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)' }}
            >
              Security Clearance (Password)
            </label>
            <input
              {...buildLabelAttributes(passwordId).inputProps}
              {...buildErrorAttributes(!!error, errorId)}
              type="password"
              autoComplete="new-password"
              required
              disabled={isLoading || isTransitioning}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="form-input"
              style={{
                width: '100%',
                padding: 'var(--space-3)',
                backgroundColor: 'var(--bg-app)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-md)',
                color: 'var(--text-primary)',
                outline: 'none',
              }}
            />
            {/* Strength Bar */}
            <div
              style={{
                width: '100%',
                height: '4px',
                backgroundColor: 'var(--bg-surface-elevated)',
                borderRadius: '2px',
                overflow: 'hidden',
                marginTop: '4px',
              }}
            >
              <div
                style={{
                  height: '100%',
                  width: `${strength}%`,
                  backgroundColor: strengthColor,
                  transition: 'width 0.3s ease, background-color 0.3s ease',
                }}
              />
            </div>
          </div>

          <PressFeedback scale={0.97}>
            <button
              type="submit"
              disabled={isLoading || isTransitioning || password.length < 6}
              aria-busy={isLoading || isTransitioning}
              className="btn btn-primary"
              style={{
                width: '100%',
                padding: 'var(--space-3)',
                marginTop: 'var(--space-4)',
                display: 'flex',
                justifyContent: 'center',
              }}
            >
              {isLoading ? 'Processing...' : 'Establish Clearance & Enter'}
            </button>
          </PressFeedback>
        </form>
      </WarningShake>

      {isTransitioning && <CinematicTransition />}
    </>
  );
}
