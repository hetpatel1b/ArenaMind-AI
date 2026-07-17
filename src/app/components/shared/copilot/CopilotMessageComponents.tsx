import React from 'react';

export function CopilotUserMessage({ content }: { content: string }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '16px' }}>
      <div
        style={{
          background: '#3e82f7',
          color: '#fff',
          padding: '12px 16px',
          borderRadius: '12px 12px 0 12px',
          fontSize: '13px',
          maxWidth: '85%',
          lineHeight: 1.5,
          boxShadow: '0 4px 12px rgba(62,130,247,0.2)',
        }}
      >
        {content}
      </div>
    </div>
  );
}

export function CopilotProgressIndicator({ progress }: { progress: string }) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        marginBottom: '16px',
        padding: '12px',
        background: 'rgba(255,255,255,0.02)',
        borderRadius: '8px',
      }}
    >
      <div
        style={{
          width: '16px',
          height: '16px',
          border: '2px solid rgba(255,255,255,0.1)',
          borderTopColor: '#3e82f7',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite',
        }}
      />
      <div style={{ fontSize: '13px', color: 'var(--text-secondary, #8b949e)' }}>{progress}</div>
      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
