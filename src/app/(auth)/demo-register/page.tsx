'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { PressFeedback } from '@/app/components/motion/MicroInteractions';
import { WarningShake } from '@/app/components/motion/AttentionMotion';
import { CinematicTransition } from '@/app/components/motion/CinematicTransition';

export default function DemoRegisterPage() {
  const router = useRouter();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [organization, setOrganization] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Caps lock detection
  const [capsLockActive, setCapsLockActive] = useState(false);

  const supabase = createClient();

  const checkPasswordStrength = (pass: string) => {
    let strength = 0;
    if (pass.length >= 8) strength++;
    if (/[A-Z]/.test(pass)) strength++;
    if (/[0-9]/.test(pass)) strength++;
    if (/[^A-Za-z0-9]/.test(pass)) strength++;
    return strength; // 0 to 4
  };

  const strength = checkPasswordStrength(password);
  const strengthColors = ['#ff3b30', '#ff9500', '#ffd60a', '#34c759', '#34c759'];
  const strengthLabels = ['Weak', 'Weak', 'Fair', 'Good', 'Strong'];

  const handleKeyUp = (e: React.KeyboardEvent) => {
    if (e.getModifierState('CapsLock')) {
      setCapsLockActive(true);
    } else {
      setCapsLockActive(false);
    }
  };

  const handleRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      setIsLoading(false);
      return;
    }

    try {
      // 1. Create the Auth User in Supabase
      const { error: signUpError, data: authData } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: name,
            organization: organization,
            role: 'operations_manager_demo',
          },
        },
      });

      if (signUpError) throw signUpError;
      if (!authData.session) throw new Error('Failed to retrieve session');

      // 2. Provision the Demo Workspace
      const response = await fetch('/api/workspaces/provision', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.error || 'Failed to provision demo workspace');
      }

      // 3. Initiate Cinematic Boot Sequence
      setIsTransitioning(true);
    } catch (err: any) {
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
          onKeyUp={handleKeyUp}
          style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}
        >
          <div style={{ textAlign: 'center', marginBottom: 'var(--space-2)' }}>
            <h2 style={{ fontSize: 'var(--text-lg)', fontWeight: 'bold' }}>
              Create Demo Operator Account
            </h2>
            <p
              style={{
                color: 'var(--text-secondary)',
                fontSize: 'var(--text-sm)',
                marginTop: 'var(--space-1)',
              }}
            >
              Access the ArenaMind AI FIFA World Cup 2026 Operations Command Center using a secure
              demonstration workspace.
            </p>
          </div>

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

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-3)' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-1)' }}>
              <label
                htmlFor="name"
                style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)' }}
              >
                Full Name
              </label>
              <input
                id="name"
                type="text"
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
                  transition: 'border-color 0.2s',
                }}
              />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-1)' }}>
              <label
                htmlFor="org"
                style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)' }}
              >
                Organization (optional)
              </label>
              <input
                id="org"
                type="text"
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
                  transition: 'border-color 0.2s',
                }}
              />
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-1)' }}>
            <label
              htmlFor="email"
              style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)' }}
            >
              Email
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
                padding: 'var(--space-2)',
                backgroundColor: 'rgba(255,255,255,0.05)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-sm)',
                color: 'var(--text-primary)',
                outline: 'none',
                transition: 'border-color 0.2s',
              }}
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-1)' }}>
            <label
              htmlFor="role"
              style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)' }}
            >
              Role
            </label>
            <input
              id="role"
              type="text"
              disabled
              value="Operations Manager (Demo)"
              style={{
                width: '100%',
                padding: 'var(--space-2)',
                backgroundColor: 'rgba(255,255,255,0.02)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-sm)',
                color: 'var(--text-tertiary)',
                outline: 'none',
              }}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-3)' }}>
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: 'var(--space-1)',
                position: 'relative',
              }}
            >
              <label
                htmlFor="password"
                style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)' }}
              >
                Password
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  disabled={isLoading}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="form-input"
                  style={{
                    width: '100%',
                    padding: 'var(--space-2)',
                    paddingRight: 'var(--space-8)',
                    backgroundColor: 'rgba(255,255,255,0.05)',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: 'var(--radius-sm)',
                    color: 'var(--text-primary)',
                    outline: 'none',
                    transition: 'border-color 0.2s',
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: 'absolute',
                    right: 'var(--space-2)',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    color: 'var(--text-tertiary)',
                    cursor: 'pointer',
                    fontSize: 'var(--text-xs)',
                  }}
                >
                  {showPassword ? 'Hide' : 'Show'}
                </button>
              </div>
              {password && (
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 'var(--space-2)',
                    marginTop: '4px',
                  }}
                >
                  <div style={{ display: 'flex', flex: 1, gap: '2px' }}>
                    {[1, 2, 3, 4].map((level) => (
                      <div
                        key={level}
                        style={{
                          height: '4px',
                          flex: 1,
                          backgroundColor:
                            level <= strength ? strengthColors[strength] : 'rgba(255,255,255,0.1)',
                          borderRadius: '2px',
                          transition: 'background-color 0.3s ease',
                        }}
                      />
                    ))}
                  </div>
                  <span style={{ fontSize: '10px', color: strengthColors[strength] }}>
                    {strengthLabels[strength]}
                  </span>
                </div>
              )}
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-1)' }}>
              <label
                htmlFor="confirmPassword"
                style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)' }}
              >
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                type={showPassword ? 'text' : 'password'}
                required
                disabled={isLoading}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="form-input"
                style={{
                  width: '100%',
                  padding: 'var(--space-2)',
                  backgroundColor: 'rgba(255,255,255,0.05)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-sm)',
                  color: 'var(--text-primary)',
                  outline: 'none',
                  transition: 'border-color 0.2s',
                }}
              />
            </div>
          </div>

          {capsLockActive && (
            <div
              style={{
                color: 'var(--status-warning)',
                fontSize: 'var(--text-xs)',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
              }}
            >
              <svg
                width="12"
                height="12"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
                <line x1="12" y1="9" x2="12" y2="13"></line>
                <line x1="12" y1="17" x2="12.01" y2="17"></line>
              </svg>
              Caps Lock is on
            </div>
          )}

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
                className="btn btn-primary"
                style={{
                  flex: 2,
                  padding: 'var(--space-2)',
                  backgroundImage:
                    'linear-gradient(to right, rgba(10, 132, 255, 0.8), rgba(94, 92, 230, 0.8))',
                  border: '1px solid rgba(255,255,255,0.2)',
                }}
              >
                {isLoading ? (
                  <div
                    className="animate-pulse"
                    style={{
                      display: 'flex',
                      gap: '4px',
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}
                  >
                    <div
                      style={{
                        width: 6,
                        height: 6,
                        borderRadius: '50%',
                        backgroundColor: 'currentColor',
                      }}
                    />
                    <div
                      style={{
                        width: 6,
                        height: 6,
                        borderRadius: '50%',
                        backgroundColor: 'currentColor',
                        animationDelay: '150ms',
                      }}
                    />
                    <div
                      style={{
                        width: 6,
                        height: 6,
                        borderRadius: '50%',
                        backgroundColor: 'currentColor',
                        animationDelay: '300ms',
                      }}
                    />
                  </div>
                ) : (
                  'Create Demo Operator Account'
                )}
              </button>
            </PressFeedback>
          </div>
        </form>
      </WarningShake>

      {isTransitioning && <CinematicTransition />}
    </>
  );
}
