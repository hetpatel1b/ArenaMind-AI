'use client';

import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';

export function StoryIntroduction() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <section
      aria-label="Introduction to ArenaMind AI"
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        backgroundColor: '#050507',
        padding: '0 24px',
      }}
    >
      <div style={{ maxWidth: '800px', width: '100%', paddingLeft: '10vw' }}>
        <motion.h2
          initial={{
            opacity: 0,
            y: shouldReduceMotion ? 0 : 50,
            filter: shouldReduceMotion ? 'blur(0px)' : 'blur(10px)',
          }}
          whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          style={{
            fontSize: 'clamp(2rem, 4vw, 3.5rem)',
            fontWeight: 600,
            color: '#fff',
            lineHeight: 1.2,
            marginBottom: '32px',
          }}
        >
          100,000 fans. 5,000 staff. <br />
          <span style={{ color: 'rgba(255,255,255,0.4)' }}>Infinite variables.</span>
        </motion.h2>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 1, delay: 0.3, ease: 'easeOut' }}
          style={{
            fontSize: 'clamp(1rem, 1.5vw, 1.25rem)',
            color: 'rgba(255,255,255,0.6)',
            lineHeight: 1.6,
            maxWidth: '600px',
          }}
        >
          Human operators cannot process this scale. ArenaMind AI was engineered specifically for
          the sheer mathematical complexity of the FIFA World Cup 2026. It is the first enterprise
          intelligence layer that continuously reasons across thousands of distinct data streams to
          govern stadium operations.
        </motion.p>
      </div>
    </section>
  );
}
