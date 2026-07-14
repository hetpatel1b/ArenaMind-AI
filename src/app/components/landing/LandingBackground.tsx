'use client';

import React, { useEffect, useState } from 'react';
import { motion, useScroll, useTransform, useReducedMotion } from 'framer-motion';

export function LandingBackground() {
  const { scrollYProgress, scrollY } = useScroll();
  const shouldReduceMotion = useReducedMotion();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsClient(true);
  }, []);

  // Parallax transform for depth
  const gridY = useTransform(scrollY, [0, 3000], [0, -300]);

  // Phase Opacities
  // 0.0 - 0.2: Radar (Hero)
  // 0.2 - 0.4: Blueprint Grid
  // 0.4 - 0.6: Neural Particles
  // 0.6 - 0.8: Data Streams
  // 0.8 - 1.0: Aurora
  const radarOpacity = useTransform(scrollYProgress, [0, 0.2, 0.3], [1, 1, 0]);
  const gridOpacity = useTransform(scrollYProgress, [0.1, 0.2, 0.4, 0.5], [0, 1, 1, 0]);
  const neuralOpacity = useTransform(scrollYProgress, [0.3, 0.4, 0.6, 0.7], [0, 1, 1, 0]);
  const dataOpacity = useTransform(scrollYProgress, [0.5, 0.6, 0.8, 0.9], [0, 1, 1, 0]);
  const auroraOpacity = useTransform(scrollYProgress, [0.7, 0.8, 1], [0, 1, 1]);

  if (!isClient)
    return <div style={{ position: 'fixed', inset: 0, backgroundColor: '#050507', zIndex: -1 }} />;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: -1,
        backgroundColor: '#050507',
        overflow: 'hidden',
        pointerEvents: 'none',
      }}
    >
      {/* 1. Radar Sweep (Hero) */}
      {!shouldReduceMotion && (
        <motion.div style={{ opacity: radarOpacity, position: 'absolute', inset: 0 }}>
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              width: '200vw',
              height: '200vw',
              marginTop: '-100vw',
              marginLeft: '-100vw',
              background:
                'conic-gradient(from 0deg, transparent 70%, rgba(100, 150, 255, 0.03) 95%, rgba(100, 150, 255, 0.15) 100%)',
              mixBlendMode: 'screen',
            }}
          />
        </motion.div>
      )}

      {/* 2. Stadium Blueprint Grid */}
      <motion.div
        style={{
          opacity: gridOpacity,
          position: 'absolute',
          inset: -300,
          backgroundImage: `
            linear-gradient(rgba(255, 255, 255, 0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255, 255, 255, 0.03) 1px, transparent 1px)
          `,
          backgroundSize: '100px 100px',
          perspective: '1000px',
          y: shouldReduceMotion ? 0 : gridY,
          maskImage: 'radial-gradient(ellipse at center, black 20%, transparent 80%)',
          WebkitMaskImage: 'radial-gradient(ellipse at center, black 20%, transparent 80%)',
        }}
      >
        {!shouldReduceMotion && (
          <motion.div
            animate={{ opacity: [0.1, 0.4, 0.1] }}
            transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
            style={{
              position: 'absolute',
              inset: 0,
              backgroundImage:
                'radial-gradient(circle at center, rgba(100,150,255,0.15) 2px, transparent 2px)',
              backgroundSize: '100px 100px',
            }}
          />
        )}
      </motion.div>

      {/* 3. Neural Particles */}
      <motion.div style={{ opacity: neuralOpacity, position: 'absolute', inset: 0 }}>
        {!shouldReduceMotion && (
          <motion.div
            animate={{ y: [0, -50, 0] }}
            transition={{ duration: 15, repeat: Infinity, ease: 'easeInOut' }}
            style={{
              position: 'absolute',
              inset: 0,
              backgroundImage:
                'radial-gradient(circle, rgba(255,255,255,0.1) 1px, transparent 1px)',
              backgroundSize: '40px 40px',
              maskImage: 'radial-gradient(circle at center, black 30%, transparent 70%)',
              WebkitMaskImage: 'radial-gradient(circle at center, black 30%, transparent 70%)',
            }}
          />
        )}
      </motion.div>

      {/* 4. Data Streams */}
      <motion.div style={{ opacity: dataOpacity, position: 'absolute', inset: 0 }}>
        {!shouldReduceMotion && (
          <motion.div
            animate={{ backgroundPosition: ['0px 0px', '0px 1000px'] }}
            transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
            style={{
              position: 'absolute',
              inset: 0,
              backgroundImage: 'linear-gradient(rgba(100,150,255,0.05) 50%, transparent 50%)',
              backgroundSize: '2px 50px',
              opacity: 0.3,
            }}
          />
        )}
      </motion.div>

      {/* 5. Aurora Intelligence */}
      <motion.div style={{ opacity: auroraOpacity, position: 'absolute', inset: 0 }}>
        {!shouldReduceMotion && (
          <>
            <motion.div
              animate={{ x: [-20, 20, -20], scale: [1, 1.1, 1] }}
              transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
              style={{
                position: 'absolute',
                bottom: '-20%',
                left: '20%',
                width: '60vw',
                height: '60vh',
                background:
                  'radial-gradient(ellipse at center, rgba(100, 150, 255, 0.15) 0%, transparent 70%)',
                filter: 'blur(24px)', // Reduced from 80px
              }}
            />
            <motion.div
              animate={{ x: [20, -20, 20], scale: [1.1, 1, 1.1] }}
              transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
              style={{
                position: 'absolute',
                bottom: '-10%',
                right: '10%',
                width: '70vw',
                height: '50vh',
                background:
                  'radial-gradient(ellipse at center, rgba(74, 222, 128, 0.08) 0%, transparent 60%)',
                filter: 'blur(24px)', // Reduced from 100px
              }}
            />
          </>
        )}
      </motion.div>
    </div>
  );
}
