import React, { useEffect, useRef } from 'react';
import { DateFormatter } from '@/lib/utils/formatters';
import { motion, AnimatePresence } from 'framer-motion';
import { ChatMessage } from './IncidentTypes';

export function CommunicationCenter({ messages }: { messages: ChatMessage[] }) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        background: 'var(--bg-surface, #14161A)',
      }}
    >
      <div
        style={{
          padding: '12px 16px',
          borderBottom: '1px solid rgba(255,255,255,0.02)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <div style={{ fontSize: '13px', fontWeight: 600, color: '#fff' }}>
          Live Communication Feed
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <div
            style={{
              width: 8,
              height: 8,
              borderRadius: '50%',
              background: '#34c759',
              animation: 'pulse 2s infinite',
            }}
          />
          <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>RECORDING</div>
        </div>
      </div>

      <div
        ref={containerRef}
        style={{
          flex: 1,
          overflowY: 'auto',
          padding: '16px',
          display: 'flex',
          flexDirection: 'column',
          gap: '16px',
        }}
      >
        <AnimatePresence initial={false}>
          {messages
            .slice()
            .reverse()
            .map((msg, index) => {
              const isAI = msg.role === 'AI';
              const isSystem = msg.role === 'SYSTEM';
              const color = isAI ? '#bf5af2' : isSystem ? '#ff9f0a' : '#3e82f7';

              return (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  style={{
                    display: 'flex',
                    gap: '12px',
                    opacity: index > 10 ? Math.max(0.2, 1 - (index - 10) * 0.1) : 1,
                  }}
                >
                  <div
                    style={{
                      width: 32,
                      height: 32,
                      borderRadius: '50%',
                      background: `rgba(${isAI ? '191,90,242' : isSystem ? '255,159,10' : '62,130,247'},0.1)`,
                      color,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '12px',
                      fontWeight: 600,
                      flexShrink: 0,
                    }}
                  >
                    {msg.sender.substring(0, 2)}
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
                      <div style={{ fontSize: '12px', fontWeight: 600, color }}>{msg.sender}</div>
                      <div style={{ fontSize: '10px', color: 'var(--text-secondary)' }}>
                        {DateFormatter.formatTime(msg.timestamp)}
                      </div>
                    </div>
                    <div
                      style={{
                        fontSize: '13px',
                        color: '#fff',
                        lineHeight: 1.4,
                        background: 'rgba(255,255,255,0.02)',
                        padding: '8px 12px',
                        borderRadius: '0 8px 8px 8px',
                        border: '1px solid rgba(255,255,255,0.02)',
                      }}
                    >
                      {msg.content}
                    </div>
                  </div>
                </motion.div>
              );
            })}
        </AnimatePresence>
      </div>

      <div style={{ padding: '12px 16px', borderTop: '1px solid rgba(255,255,255,0.02)' }}>
        <div
          style={{
            display: 'flex',
            gap: '12px',
            alignItems: 'center',
            background: 'rgba(255,255,255,0.01)',
            border: '1px solid rgba(255,255,255,0.02)',
            borderRadius: '6px',
            padding: '8px 12px',
          }}
        >
          <input
            type="text"
            placeholder="Broadcast to all units..."
            style={{
              flex: 1,
              background: 'transparent',
              border: 'none',
              color: '#fff',
              fontSize: '13px',
              outline: 'none',
            }}
            disabled
          />
          <button
            style={{
              background: '#3e82f7',
              border: 'none',
              color: '#fff',
              padding: '6px 12px',
              borderRadius: '4px',
              fontSize: '12px',
              fontWeight: 600,
              cursor: 'not-allowed',
              opacity: 0.5,
            }}
          >
            SEND
          </button>
        </div>
      </div>
    </div>
  );
}
