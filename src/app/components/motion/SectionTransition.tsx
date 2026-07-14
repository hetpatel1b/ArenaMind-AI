'use client';

import React from 'react';
import { motion, useReducedMotion, Variants } from 'framer-motion';

type TransitionType = 'camera-push' | 'depth-shift' | 'fade-up' | 'reveal';

interface Props {
  children: React.ReactNode;
  type?: TransitionType;
  delay?: number;
}

export function SectionTransition({ children, type = 'fade-up', delay = 0 }: Props) {
  const shouldReduceMotion = useReducedMotion();

  if (shouldReduceMotion) {
    return <>{children}</>;
  }

  const getVariants = (): Variants => {
    switch (type) {
      case 'camera-push':
        return {
          hidden: { opacity: 0, scale: 0.9, y: 50 },
          visible: {
            opacity: 1,
            scale: 1,
            y: 0,
            transition: { duration: 1, ease: 'easeOut', delay },
          },
        };
      case 'depth-shift':
        return {
          hidden: { opacity: 0, z: -100, rotateX: 10 },
          visible: {
            opacity: 1,
            z: 0,
            rotateX: 0,
            transition: { duration: 1, ease: 'easeOut', delay },
          },
        };
      case 'reveal':
        return {
          hidden: { opacity: 0, filter: 'blur(10px)' },
          visible: { opacity: 1, filter: 'blur(0px)', transition: { duration: 1, delay } },
        };
      case 'fade-up':
      default:
        return {
          hidden: { opacity: 0, y: 40 },
          visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: 'easeOut', delay } },
        };
    }
  };

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-100px' }}
      variants={getVariants()}
      style={{
        width: '100%',
        perspective: type === 'depth-shift' ? '1000px' : 'none',
      }}
    >
      {children}
    </motion.div>
  );
}
