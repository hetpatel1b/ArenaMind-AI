'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  duration: number;
  delay: number;
}

export function ParticleBackground() {
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    // Generate random particles only on the client
    const generatedParticles = Array.from({ length: 40 }).map((_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 3 + 1,
      duration: Math.random() * 10 + 10,
      delay: Math.random() * 5,
    }));
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setParticles(generatedParticles);
  }, []);

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        overflow: 'hidden',
        zIndex: 0,
        pointerEvents: 'none',
      }}
    >
      {/* Animated noise texture overlay */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          opacity: 0.03,
          backgroundImage: 'url(/images/noise.png)',
          backgroundRepeat: 'repeat',
          mixBlendMode: 'overlay',
        }}
      />

      {/* Very slow grid / stadium blueprint */}
      <motion.div
        initial={{ opacity: 0, scale: 1.1 }}
        animate={{ opacity: 0.1, scale: 1, rotate: [0, 2] }}
        transition={{ duration: 10, ease: 'linear', repeat: Infinity, repeatType: 'reverse' }}
        style={{
          position: 'absolute',
          inset: '-20%',
          backgroundImage:
            'linear-gradient(rgba(100, 50, 255, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(100, 50, 255, 0.1) 1px, transparent 1px)',
          backgroundSize: '40px 40px',
          transformOrigin: 'center center',
        }}
      />

      {/* Radar sweep (soft light) */}
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 8, ease: 'linear', repeat: Infinity }}
        style={{
          position: 'absolute',
          inset: '-50%',
          background: 'conic-gradient(from 0deg, transparent 70%, rgba(100, 50, 255, 0.05) 100%)',
          borderRadius: '50%',
          transformOrigin: 'center center',
        }}
      />

      {/* Tiny neural nodes / particles */}
      {particles.map((p) => (
        <motion.div
          key={p.id}
          initial={{
            opacity: 0,
            x: `${p.x}vw`,
            y: `${p.y}vh`,
          }}
          animate={{
            opacity: [0, 0.6, 0],
            y: [`${p.y}vh`, `${p.y - 10}vh`],
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
            backgroundColor: 'rgba(150, 100, 255, 0.8)',
            boxShadow: '0 0 10px rgba(150, 100, 255, 0.5)',
          }}
        />
      ))}
    </div>
  );
}
