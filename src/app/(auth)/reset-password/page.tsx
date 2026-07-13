'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createBrowserClient } from '@supabase/ssr';
import { PressFeedback } from '@/app/components/motion/MicroInteractions';
import { WarningShake } from '@/app/components/motion/AttentionMotion';

export default function ResetPasswordPage() {
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError('Security clearances do not match');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const { error } = await supabase.auth.updateUser({
        password: password,
      });

      if (error) throw error;

      router.push('/login');
    } catch (err: any) {
      setError(err.message || 'Failed to update clearance');
    } finally {
      setIsLoading(false);
    }
  };

  // Password strength visual indicator
  const strength = Math.min(password.length / 12, 1) * 100;
  const strengthColor =
    strength < 50
      ? 'var(--status-critical)'
      : strength < 80
        ? 'var(--status-warning)'
        : 'var(--status-success)';

  return (
    <WarningShake trigger={error}>
      <form
        onSubmit={handleUpdate}
        style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}
      >
        <p
          style={{
            color: 'var(--text-secondary)',
            fontSize: 'var(--text-sm)',
            marginBottom: 'var(--space-2)',
          }}
        >
          Establish a new security clearance for your ArenaMind AI profile.
        </p>

        {error && (
          <div
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

        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
          <label
            htmlFor="password"
            style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)' }}
          >
            New Clearance (Password)
          </label>
          <input
            id="password"
            type="password"
            required
            disabled={isLoading}
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

        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
          <label
            htmlFor="confirmPassword"
            style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)' }}
          >
            Confirm Clearance
          </label>
          <input
            id="confirmPassword"
            type="password"
            required
            disabled={isLoading}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
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
        </div>

        <PressFeedback scale={0.97}>
          <button
            type="submit"
            disabled={isLoading || password.length < 6}
            className="btn btn-primary"
            style={{
              width: '100%',
              padding: 'var(--space-3)',
              marginTop: 'var(--space-4)',
              display: 'flex',
              justifyContent: 'center',
            }}
          >
            {isLoading ? 'Updating...' : 'Update Clearance & Authenticate'}
          </button>
        </PressFeedback>
      </form>
    </WarningShake>
  );
}
