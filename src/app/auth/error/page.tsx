'use client';

import React, { Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';

function AuthErrorContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const error = searchParams.get('error');

  let errorMessage = 'An authentication error occurred. Please log in again.';

  if (error === 'Configuration') {
    errorMessage = 'There is a problem with the server authentication configuration.';
  } else if (error === 'AccessDenied') {
    errorMessage = 'Access denied. You do not have permission to access this resource.';
  } else if (error === 'Verification') {
    errorMessage = 'The authentication token has expired or is invalid.';
  } else if (error === 'CredentialsSignin') {
    errorMessage = 'Invalid credentials provided. Please check your operator ID and password.';
  } else if (error) {
    errorMessage = `Authentication error: ${error}`;
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#0a0d14',
        color: '#f3f4f6',
        fontFamily: 'system-ui, -apple-system, sans-serif',
        padding: '1.5rem',
      }}
    >
      <div
        style={{
          maxWidth: '440px',
          width: '100%',
          backgroundColor: 'rgba(255, 255, 255, 0.03)',
          border: '1px solid rgba(255, 59, 48, 0.3)',
          borderRadius: '12px',
          padding: '2rem',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)',
          textAlign: 'center',
        }}
      >
        <div
          style={{
            width: '48px',
            height: '48px',
            borderRadius: '50%',
            backgroundColor: 'rgba(255, 59, 48, 0.15)',
            color: '#ff3b30',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 1.25rem auto',
            fontSize: '1.5rem',
            fontWeight: 'bold',
          }}
        >
          !
        </div>

        <h2 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '0.75rem' }}>
          Authentication Error
        </h2>

        <p
          style={{
            fontSize: '0.875rem',
            color: '#9ca3af',
            marginBottom: '1.75rem',
            lineHeight: '1.5',
          }}
        >
          {errorMessage}
        </p>

        <button
          onClick={() => router.push('/login')}
          style={{
            width: '100%',
            padding: '0.75rem 1rem',
            backgroundColor: '#0a84ff',
            color: '#ffffff',
            border: 'none',
            borderRadius: '8px',
            fontSize: '0.875rem',
            fontWeight: 600,
            cursor: 'pointer',
            transition: 'background-color 0.2s',
          }}
        >
          Return to Login
        </button>
      </div>
    </div>
  );
}

export default function AuthErrorPage() {
  return (
    <Suspense
      fallback={
        <div style={{ padding: '2rem', textAlign: 'center', color: '#fff' }}>
          Loading authentication error details...
        </div>
      }
    >
      <AuthErrorContent />
    </Suspense>
  );
}
