'use client';

import React from 'react';
import { LoggerService } from '@/lib/platform/observability/LoggerService';

interface ErrorBoundaryProps {
  children: React.ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

export class GlobalErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    LoggerService.error('Enterprise Error Boundary caught an error:', error, errorInfo);
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null });
  };

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            height: '100%',
            width: '100%',
            backgroundColor: 'var(--bg-app)',
            padding: 'var(--space-8)',
            color: 'var(--text-primary)',
          }}
        >
          <div
            style={{
              maxWidth: '600px',
              width: '100%',
              backgroundColor: 'var(--bg-surface-elevated)',
              border: '1px solid var(--border-strong)',
              borderRadius: 'var(--radius-xl)',
              padding: 'var(--space-6)',
              boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)',
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 'var(--space-3)',
                color: 'var(--status-critical)',
                marginBottom: 'var(--space-4)',
              }}
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
              <h2 style={{ margin: 0, fontSize: 'var(--text-xl)' }}>Module Failure Detected</h2>
            </div>

            <p
              style={{
                color: 'var(--text-secondary)',
                marginBottom: 'var(--space-4)',
                lineHeight: 1.5,
              }}
            >
              The workspace encountered an unexpected runtime exception. The error has been logged
              to the central telemetry server.
            </p>

            <div
              style={{
                backgroundColor: 'rgba(0,0,0,0.2)',
                padding: 'var(--space-4)',
                borderRadius: 'var(--radius-md)',
                fontFamily: 'monospace',
                fontSize: '12px',
                color: 'var(--text-tertiary)',
                marginBottom: 'var(--space-6)',
                overflowX: 'auto',
              }}
            >
              <div>
                <strong>TIMESTAMP:</strong> {new Date().toISOString()}
              </div>
              <div>
                <strong>ERROR:</strong> {this.state.error?.message}
              </div>
              {this.state.error?.stack && (
                <div style={{ marginTop: 'var(--space-2)', opacity: 0.7 }}>
                  {this.state.error.stack.split('\n')[1]?.trim()}
                </div>
              )}
            </div>

            <div style={{ display: 'flex', gap: 'var(--space-3)' }}>
              <button
                onClick={this.handleRetry}
                className="btn focus-ring"
                style={{
                  padding: 'var(--space-3) var(--space-4)',
                  backgroundColor: 'var(--brand-primary)',
                  color: 'white',
                  border: 'none',
                  borderRadius: 'var(--radius-md)',
                  cursor: 'pointer',
                  fontWeight: 'bold',
                  flex: 1,
                }}
              >
                Attempt Recovery
              </button>
              <button
                onClick={this.handleReload}
                className="btn focus-ring"
                style={{
                  padding: 'var(--space-3) var(--space-4)',
                  backgroundColor: 'transparent',
                  color: 'var(--text-primary)',
                  border: '1px solid var(--border-strong)',
                  borderRadius: 'var(--radius-md)',
                  cursor: 'pointer',
                  fontWeight: 'bold',
                  flex: 1,
                }}
              >
                Hard Reload
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
