'use client';

import React, { useEffect, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';

interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  duration: number;
  delay: number;
}

export function HeroBackground() {
  const shouldReduceMotion = useReducedMotion();
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    // Client-side only particle generation for hydration safety
    const generated = Array.from({ length: 30 }).map((_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 2 + 1,
      duration: Math.random() * 20 + 15,
      delay: Math.random() * 5,
    }));
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setParticles(generated);
  }, []);

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        overflow: 'hidden',
        zIndex: 0,
        pointerEvents: 'none',
        backgroundColor: 'var(--bg-app, #050507)',
      }}
    >
      {/* Stadium Blueprint / Grid */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.15, rotate: shouldReduceMotion ? 0 : [0, 1] }}
        transition={{
          duration: 20,
          ease: 'linear',
          repeat: Infinity,
          repeatType: 'reverse',
        }}
        style={{
          position: 'absolute',
          inset: '-20%',
          backgroundImage:
            'linear-gradient(rgba(100, 150, 255, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(100, 150, 255, 0.1) 1px, transparent 1px)',
          backgroundSize: '50px 50px',
          transformOrigin: 'center center',
          maskImage: 'radial-gradient(ellipse at center, black 20%, transparent 70%)',
          WebkitMaskImage: 'radial-gradient(ellipse at center, black 20%, transparent 70%)',
        }}
      />

      {/* Radar Sweep */}
      {!shouldReduceMotion && (
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 12, ease: 'linear', repeat: Infinity }}
          style={{
            position: 'absolute',
            inset: '-50%',
            background:
              'conic-gradient(from 0deg, transparent 70%, rgba(100, 150, 255, 0.05) 100%)',
            borderRadius: '50%',
            transformOrigin: 'center center',
          }}
        />
      )}

      {/* AI Pulse */}
      {!shouldReduceMotion && (
        <motion.div
          animate={{ scale: [1, 1.5], opacity: [0.5, 0] }}
          transition={{ duration: 4, ease: 'easeOut', repeat: Infinity }}
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            width: '400px',
            height: '400px',
            marginLeft: '-200px',
            marginTop: '-200px',
            borderRadius: '50%',
            border: '1px solid rgba(100, 150, 255, 0.2)',
          }}
        />
      )}

      {/* Neural Network Particles */}
      {particles.map((p) => (
        <motion.div
          key={p.id}
          initial={{
            opacity: 0,
            x: `${p.x}vw`,
            y: `${p.y}vh`,
          }}
          animate={{
            opacity: shouldReduceMotion ? 0.3 : [0, 0.5, 0],
            y: shouldReduceMotion ? `${p.y}vh` : [`${p.y}vh`, `${p.y - 5}vh`],
          }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            repeat: Infinity,
            ease: 'linear',
          }}
          style={{
            position: 'absolute',
            width: p.size,
            height: p.size,
            borderRadius: '50%',
            backgroundColor: 'rgba(100, 150, 255, 0.8)',
            boxShadow: '0 0 8px rgba(100, 150, 255, 0.5)',
          }}
        />
      ))}

      {/* Vignette Overlay for Depth */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'radial-gradient(circle at center, transparent 30%, var(--bg-app, #050507) 90%)',
        }}
      />
    </div>
  );
}
