'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createBrowserClient } from '@supabase/ssr';
import { PressFeedback } from '@/app/components/motion/MicroInteractions';
import { WarningShake } from '@/app/components/motion/AttentionMotion';

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) throw error;
      setIsSuccess(true);
    } catch (err: any) {
      setError(err.message || 'Failed to send reset email');
    } finally {
      setIsLoading(false);
    }
  };

  if (isSuccess) {
    return (
      <div
        style={{
          textAlign: 'center',
          display: 'flex',
          flexDirection: 'column',
          gap: 'var(--space-4)',
        }}
      >
        <div
          style={{
            width: '48px',
            height: '48px',
            borderRadius: '50%',
            backgroundColor: 'var(--status-success-bg)',
            color: 'var(--status-success)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto',
          }}
        >
          ✓
        </div>
        <h2 style={{ fontSize: 'var(--text-xl)', fontWeight: 'bold' }}>
          Clearance Reset Initiated
        </h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: 'var(--text-sm)' }}>
          Instructions have been dispatched to <strong>{email}</strong>. Please check your secure
          inbox.
        </p>
        <button
          onClick={() => router.push('/login')}
          className="btn btn-outline"
          style={{ marginTop: 'var(--space-4)' }}
        >
          Return to Authentication
        </button>
      </div>
    );
  }

  return (
    <WarningShake trigger={error}>
      <form
        onSubmit={handleReset}
        style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}
      >
        <p
          style={{
            color: 'var(--text-secondary)',
            fontSize: 'var(--text-sm)',
            marginBottom: 'var(--space-2)',
          }}
        >
          Enter your Operator ID to request a security clearance reset link.
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
            htmlFor="email"
            style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)' }}
          >
            Operator ID (Email)
          </label>
          <input
            id="email"
            type="email"
            required
            disabled={isLoading}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
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
            placeholder="e.g., ops.manager@arenamind.ai"
          />
        </div>

        <div style={{ display: 'flex', gap: 'var(--space-2)', marginTop: 'var(--space-4)' }}>
          <button
            type="button"
            onClick={() => router.push('/login')}
            disabled={isLoading}
            className="btn btn-outline"
            style={{ flex: 1, padding: 'var(--space-3)' }}
          >
            Cancel
          </button>

          <PressFeedback scale={0.97}>
            <button
              type="submit"
              disabled={isLoading}
              className="btn btn-primary"
              style={{
                flex: 1,
                padding: 'var(--space-3)',
                display: 'flex',
                justifyContent: 'center',
              }}
            >
              {isLoading ? 'Dispatching...' : 'Request Reset'}
            </button>
          </PressFeedback>
        </div>
      </form>
    </WarningShake>
  );
}
