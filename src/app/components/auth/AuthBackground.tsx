'use client';

import React, { useState, useEffect } from 'react';
import { motion, useReducedMotion } from 'framer-motion';

export function AuthBackground() {
  const shouldReduceMotion = useReducedMotion();
  const [particles, setParticles] = useState<SafeAny[]>([]);

  useEffect(() => {
    // Generate particles only on the client to avoid SSR hydration mismatches
    const generatedParticles = Array.from({ length: 20 }).map((_, i) => ({
      id: i,
      size: Math.random() * 4 + 2,
      x: Math.random() * 100,
      y: Math.random() * 100,
      duration: Math.random() * 20 + 20,
      delay: Math.random() * 10,
    }));

    // Use requestAnimationFrame to avoid synchronous state updates in useEffect
    const rafId = requestAnimationFrame(() => {
      setParticles(generatedParticles);
    });

    return () => cancelAnimationFrame(rafId);
  }, []);

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        overflow: 'hidden',
        pointerEvents: 'none',
        zIndex: 0,
      }}
    >
      {/* Dynamic Base Gradient */}
      <motion.div
        animate={
          shouldReduceMotion
            ? {}
            : {
                backgroundPosition: ['0% 0%', '100% 100%', '0% 0%'],
              }
        }
        transition={{ duration: 30, ease: 'linear', repeat: Infinity }}
        style={{
          position: 'absolute',
          inset: '-50%',
          background:
            'radial-gradient(circle at center, rgba(10, 132, 255, 0.1) 0%, transparent 60%)',
          backgroundSize: '200% 200%',
          opacity: 0.8,
        }}
      />

      {/* Floating Particles */}
      {!shouldReduceMotion &&
        particles.map((p) => (
          <motion.div
            key={p.id}
            animate={{
              y: [`${p.y}%`, `${p.y - 10}%`, `${p.y}%`],
              opacity: [0, 0.5, 0],
            }}
            transition={{
              duration: p.duration,
              repeat: Infinity,
              delay: p.delay,
              ease: 'easeInOut',
            }}
            style={{
              position: 'absolute',
              left: `${p.x}%`,
              width: p.size,
              height: p.size,
              backgroundColor: 'var(--ai-accent)',
              borderRadius: '50%',
              filter: 'blur(1px)',
              boxShadow: '0 0 10px var(--ai-accent)',
            }}
          />
        ))}
    </div>
  );
}
