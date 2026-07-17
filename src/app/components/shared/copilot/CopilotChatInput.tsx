import React, { useState } from 'react';

export interface CopilotChatInputProps {
  onSend: (message: string) => void;
  onStop?: () => void;
  isLoading?: boolean;
}

export function CopilotChatInput({ onSend, onStop, isLoading }: CopilotChatInputProps) {
  const [input, setInput] = useState('');

  const handleSend = () => {
    if (input.trim() && !isLoading) {
      onSend(input);
      setInput('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div
      style={{
        marginTop: 'auto',
        paddingTop: '16px',
        borderTop: '1px solid var(--border-subtle, rgba(255,255,255,0.1))',
      }}
    >
      <div
        style={{
          display: 'flex',
          gap: '8px',
          background: 'rgba(255,255,255,0.05)',
          borderRadius: '8px',
          padding: '8px',
          alignItems: 'center',
        }}
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask Copilot..."
          disabled={isLoading}
          style={{
            flex: 1,
            background: 'transparent',
            border: 'none',
            color: '#fff',
            outline: 'none',
            fontSize: '13px',
          }}
        />
        {isLoading && onStop ? (
          <button
            onClick={onStop}
            style={{
              background: 'rgba(255,59,48,0.2)',
              border: '1px solid rgba(255,59,48,0.5)',
              borderRadius: '4px',
              color: '#ff3b30',
              padding: '6px 12px',
              fontSize: '12px',
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            Stop
          </button>
        ) : (
          <button
            onClick={handleSend}
            disabled={!input.trim() || isLoading}
            style={{
              background: !input.trim() || isLoading ? 'rgba(255,255,255,0.1)' : '#3e82f7',
              border: 'none',
              borderRadius: '4px',
              color: !input.trim() || isLoading ? 'rgba(255,255,255,0.4)' : '#fff',
              padding: '6px 12px',
              fontSize: '12px',
              fontWeight: 600,
              cursor: !input.trim() || isLoading ? 'not-allowed' : 'pointer',
            }}
          >
            Send
          </button>
        )}
      </div>
    </div>
  );
}
