'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const BOOT_MESSAGES = [
  'Initializing AI Engine...',
  'Loading Stadium Topology...',
  'Syncing Crowd Intelligence...',
  'Loading Match Telemetry...',
  'Connecting Secure Operations...',
  'Loading Decision Engine...',
  'Verifying Human Approval Layer...',
  'Mission Control Ready',
];

export function MissionControlBoot() {
  const [visibleMessages, setVisibleMessages] = useState<number>(0);

  useEffect(() => {
    // Reveal messages sequentially every 80ms
    // We delay the start by 1.2s so it begins after the logo starts forming
    const startDelay = 1200;
    const intervalTime = 80;

    const timeout = setTimeout(() => {
      const interval = setInterval(() => {
        setVisibleMessages((prev) => {
          if (prev < BOOT_MESSAGES.length) {
            return prev + 1;
          }
          clearInterval(interval);
          return prev;
        });
      }, intervalTime);

      return () => clearInterval(interval);
    }, startDelay);

    return () => clearTimeout(timeout);
  }, []);

  return (
    <div
      style={{
        position: 'absolute',
        bottom: '15%',
        left: '10%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        justifyContent: 'flex-end',
        height: '200px',
        zIndex: 10,
        fontFamily: 'monospace',
        fontSize: '12px',
        color: 'rgba(255, 255, 255, 0.7)',
        overflow: 'hidden',
        pointerEvents: 'none',
      }}
    >
      <AnimatePresence mode="popLayout">
        {BOOT_MESSAGES.slice(0, visibleMessages).map((msg, idx) => {
          const isLastMessage = idx === BOOT_MESSAGES.length - 1;
          return (
            <motion.div
              key={msg}
              initial={{ opacity: 0, y: 10, filter: 'blur(2px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                marginBottom: '4px',
                textShadow: '0 0 5px rgba(255,255,255,0.2)',
              }}
            >
              <span
                style={{
                  color: isLastMessage ? '#4ade80' : 'rgba(150, 100, 255, 0.8)',
                  textShadow: isLastMessage
                    ? '0 0 10px rgba(74, 222, 128, 0.5)'
                    : '0 0 10px rgba(150, 100, 255, 0.5)',
                }}
              >
                {isLastMessage ? '✓' : '>'}
              </span>
              <span style={{ color: isLastMessage ? '#ffffff' : 'inherit' }}>{msg}</span>
              {idx === visibleMessages - 1 && !isLastMessage && (
                <motion.span
                  animate={{ opacity: [1, 0, 1] }}
                  transition={{ duration: 0.8, repeat: Infinity }}
                  style={{
                    display: 'inline-block',
                    width: '6px',
                    height: '12px',
                    backgroundColor: 'rgba(150, 100, 255, 0.8)',
                    marginLeft: '4px',
                  }}
                />
              )}
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
