'use client';

import React from 'react';
import { motion } from 'framer-motion';

export function LogoReveal() {
  const brandName = 'ArenaMind AI'.split('');

  return (
    <div
      style={{
        position: 'absolute',
        top: '40%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 10,
      }}
    >
      {/* Node expansion & Logo symbol */}
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: [0, 1.2, 1], opacity: [0, 1, 1] }}
        transition={{ duration: 0.6, delay: 0.2, ease: 'easeOut' }}
        style={{
          width: '48px',
          height: '48px',
          borderRadius: '12px',
          background: 'linear-gradient(135deg, rgba(150,100,255,0.8), rgba(80,50,200,0.8))',
          boxShadow: '0 0 30px rgba(150,100,255,0.6)',
          marginBottom: '24px',
          position: 'relative',
        }}
      >
        {/* Soft purple pulse behind logo */}
        <motion.div
          initial={{ scale: 1, opacity: 0.8 }}
          animate={{ scale: 2, opacity: 0 }}
          transition={{ duration: 1.5, delay: 0.8, ease: 'easeOut' }}
          style={{
            position: 'absolute',
            inset: 0,
            borderRadius: '12px',
            background: 'rgba(150,100,255,0.5)',
            zIndex: -1,
          }}
        />
      </motion.div>

      {/* Brand Name - letter by letter */}
      <h1
        style={{
          fontSize: 'var(--text-3xl, 2rem)',
          fontWeight: 'var(--font-weight-bold, 700)',
          color: 'var(--text-primary, #ffffff)',
          letterSpacing: '0.05em',
          display: 'flex',
          margin: 0,
          marginBottom: '8px',
        }}
      >
        {brandName.map((char, index) => (
          <motion.span
            key={index}
            initial={{ opacity: 0, y: 10, filter: 'blur(4px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            transition={{
              duration: 0.4,
              delay: 0.8 + index * 0.05,
              ease: 'easeOut',
            }}
            style={{ display: 'inline-block', whiteSpace: 'pre' }}
          >
            {char}
          </motion.span>
        ))}
      </h1>

      {/* Subtitle */}
      <motion.p
        initial={{ opacity: 0, y: 5 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 1.6, ease: 'easeOut' }}
        style={{
          fontSize: 'var(--text-sm, 0.875rem)',
          color: 'var(--text-secondary, rgba(255,255,255,0.6))',
          textTransform: 'uppercase',
          letterSpacing: '0.2em',
          margin: 0,
        }}
      >
        Intelligent Stadium Operations
      </motion.p>
    </div>
  );
}
