'use client';

import React, { useEffect, useRef, useState } from 'react';
import { DateFormatter } from '@/lib/utils/formatters';
import { motion, AnimatePresence } from 'framer-motion';
import { useWorkforceWorkspace } from './useWorkforceWorkspace';

export function WorkforceCommunicationFeed() {
  const { state, dispatch } = useWorkforceWorkspace();
  const { communicationFeed, selectedDepartment } = state;
  const feedRef = useRef<HTMLDivElement>(null);
  const [inputValue, setInputValue] = useState('');

  const filteredFeed = selectedDepartment
    ? communicationFeed.filter(
        (m) => m.department === selectedDepartment || m.department === 'System'
      )
    : communicationFeed;

  useEffect(() => {
    if (feedRef.current) {
      feedRef.current.scrollTop = feedRef.current.scrollHeight;
    }
  }, [filteredFeed]);

  const handleSend = () => {
    if (!inputValue.trim()) return;
    dispatch({
      type: 'SEND_MESSAGE',
      payload: {
        id: Date.now().toString(),
        timestamp: DateFormatter.formatTimeShort(Date.now()),
        sender: 'Executive Command',
        department: selectedDepartment || 'All Departments',
        content: inputValue.trim(),
        priority: 'high',
      },
    });
    setInputValue('');
  };

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: '#080A0C' }}>
      {/* Header */}
      <div style={{ padding: '24px', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
        <h2 style={{ fontSize: '18px', fontWeight: 600, color: '#F8FAFC', margin: '0 0 4px 0' }}>
          {selectedDepartment
            ? `${selectedDepartment} Communications`
            : 'Live Communication Center'}
        </h2>
        <p style={{ fontSize: '13px', color: '#94A3B8', margin: 0 }}>
          Auto-scrolling operational feed across{' '}
          {selectedDepartment ? 'the department' : 'all departments'}.
        </p>
      </div>

      {/* Feed */}
      <div
        ref={feedRef}
        style={{
          flex: 1,
          overflowY: 'auto',
          padding: '24px',
          display: 'flex',
          flexDirection: 'column',
          gap: '12px',
        }}
      >
        <AnimatePresence initial={false}>
          {filteredFeed.map((msg) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              style={{
                background: 'rgba(255,255,255,0.02)',
                borderLeft: `3px solid ${getPriorityColor(msg.priority)}`,
                borderRadius: '0 8px 8px 0',
                padding: '16px',
                display: 'flex',
                flexDirection: 'column',
                gap: '8px',
              }}
            >
              <div
                style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '13px', fontWeight: 600, color: '#F8FAFC' }}>
                    {msg.sender}
                  </span>
                  <span
                    style={{
                      fontSize: '11px',
                      color: '#94A3B8',
                      background: 'rgba(255,255,255,0.05)',
                      padding: '2px 6px',
                      borderRadius: '4px',
                    }}
                  >
                    {msg.department}
                  </span>
                </div>
                <span style={{ fontSize: '11px', color: '#64748B' }}>{msg.timestamp}</span>
              </div>
              <div style={{ fontSize: '14px', color: '#E2E8F0', lineHeight: 1.5 }}>
                {msg.content}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Input */}
      <div
        style={{
          padding: '16px 24px',
          borderTop: '1px solid rgba(255,255,255,0.05)',
          background: 'rgba(13, 15, 18, 0.95)',
        }}
      >
        <div style={{ display: 'flex', gap: '12px' }}>
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder={
              selectedDepartment
                ? `Broadcast to ${selectedDepartment}...`
                : 'Broadcast to all departments...'
            }
            style={{
              flex: 1,
              background: 'rgba(0,0,0,0.3)',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '6px',
              padding: '12px 16px',
              color: '#F8FAFC',
              outline: 'none',
              fontSize: '13px',
            }}
          />
          <button
            onClick={handleSend}
            style={{
              background: '#38BDF8',
              border: 'none',
              color: '#0F172A',
              fontWeight: 600,
              padding: '0 24px',
              borderRadius: '6px',
              cursor: 'pointer',
            }}
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}

function getPriorityColor(priority: string) {
  switch (priority) {
    case 'critical':
      return '#EF4444';
    case 'high':
      return '#F59E0B';
    case 'medium':
      return '#38BDF8';
    case 'low':
      return '#10B981';
    default:
      return '#64748B';
  }
}
