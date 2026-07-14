'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { PressFeedback } from '@/app/components/motion/MicroInteractions';
import { WarningShake } from '@/app/components/motion/AttentionMotion';
import { CinematicTransition } from '@/app/components/motion/CinematicTransition';

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberDevice, setRememberDevice] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    if (searchParams.get('reason') === 'expired') {
      // eslint-disable-next-line
      setError('Session expired. Professional re-authentication required.');
    }
  }, [searchParams]);

  const supabase = createClient();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      setIsTransitioning(true);
    } catch (err: any) {
      setError(err.message || 'Invalid credentials');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <WarningShake trigger={error}>
        <div style={{ textAlign: 'center', marginBottom: 'var(--space-6)' }}>
          <h2
            style={{
              fontSize: 'var(--text-xl)',
              fontWeight: 'var(--font-weight-bold)',
              marginBottom: 'var(--space-2)',
            }}
          >
            Secure Command Center Access
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: 'var(--text-sm)' }}>
            Sign in using your authorized operator credentials.
          </p>
        </div>

        <form
          onSubmit={handleLogin}
          style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}
        >
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
              disabled={isLoading || isTransitioning}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="form-input"
              style={{
                width: '100%',
                padding: 'var(--space-3)',
                backgroundColor: 'rgba(255,255,255,0.05)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-md)',
                color: 'var(--text-primary)',
                outline: 'none',
                transition: 'border-color 0.2s',
              }}
              placeholder="e.g., ops.manager@arenamind.ai"
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <label
                htmlFor="password"
                style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)' }}
              >
                Security Clearance (Password)
              </label>
              <button
                type="button"
                disabled={isLoading || isTransitioning}
                onClick={() => router.push('/forgot-password')}
                style={{
                  fontSize: 'var(--text-xs)',
                  color: 'var(--status-info)',
                  cursor: 'pointer',
                  background: 'none',
                  border: 'none',
                }}
              >
                Reset Clearance
              </button>
            </div>
            <div style={{ position: 'relative' }}>
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                required
                disabled={isLoading || isTransitioning}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="form-input"
                style={{
                  width: '100%',
                  padding: 'var(--space-3)',
                  paddingRight: 'var(--space-10)',
                  backgroundColor: 'rgba(255,255,255,0.05)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-md)',
                  color: 'var(--text-primary)',
                  outline: 'none',
                }}
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: 'absolute',
                  right: 'var(--space-3)',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  color: 'var(--text-tertiary)',
                  cursor: 'pointer',
                }}
              >
                {showPassword ? 'Hide' : 'Show'}
              </button>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
            <input
              type="checkbox"
              id="remember"
              checked={rememberDevice}
              onChange={(e) => setRememberDevice(e.target.checked)}
              style={{ accentColor: 'var(--ai-accent)' }}
            />
            <label
              htmlFor="remember"
              style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)' }}
            >
              Remember this device for 30 days
            </label>
          </div>

          <PressFeedback scale={0.97}>
            <button
              type="submit"
              disabled={isLoading || isTransitioning}
              className="btn btn-primary"
              style={{
                width: '100%',
                padding: 'var(--space-3)',
                marginTop: 'var(--space-2)',
                display: 'flex',
                justifyContent: 'center',
                backgroundImage:
                  'linear-gradient(to right, rgba(10, 132, 255, 0.8), rgba(94, 92, 230, 0.8))',
                border: '1px solid rgba(255,255,255,0.2)',
              }}
            >
              {isLoading ? (
                <div className="animate-pulse" style={{ display: 'flex', gap: '4px' }}>
                  <div
                    style={{
                      width: 8,
                      height: 8,
                      borderRadius: '50%',
                      backgroundColor: 'currentColor',
                    }}
                  />
                  <div
                    style={{
                      width: 8,
                      height: 8,
                      borderRadius: '50%',
                      backgroundColor: 'currentColor',
                      animationDelay: '150ms',
                    }}
                  />
                  <div
                    style={{
                      width: 8,
                      height: 8,
                      borderRadius: '50%',
                      backgroundColor: 'currentColor',
                      animationDelay: '300ms',
                    }}
                  />
                </div>
              ) : (
                'Sign In'
              )}
            </button>
          </PressFeedback>

          <div
            style={{
              marginTop: 'var(--space-4)',
              textAlign: 'center',
              borderTop: '1px solid rgba(255,255,255,0.05)',
              paddingTop: 'var(--space-4)',
            }}
          >
            <p
              style={{
                color: 'var(--text-tertiary)',
                fontSize: 'var(--text-xs)',
                marginBottom: 'var(--space-2)',
              }}
            >
              Need to explore ArenaMind AI?
            </p>
            <button
              type="button"
              onClick={() => router.push('/demo-register')}
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--ai-accent)',
                fontSize: 'var(--text-sm)',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
              }}
            >
              Create Demo Operator Account <span aria-hidden="true">→</span>
            </button>
          </div>
        </form>
      </WarningShake>

      {isTransitioning && <CinematicTransition />}
    </>
  );
}
