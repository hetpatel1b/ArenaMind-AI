'use client';

import React, { useEffect, useState, useRef } from 'react';
import { motion, useSpring, useReducedMotion } from 'framer-motion';

export function EnterpriseCursor() {
  const shouldReduceMotion = useReducedMotion();
  const [isTouch, setIsTouch] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const cursorRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  // High stiffness spring for immediate but smooth response
  const springConfig = { stiffness: 400, damping: 28, mass: 0.5 };
  const mouseX = useSpring(0, springConfig);
  const mouseY = useSpring(0, springConfig);

  useEffect(() => {
    // Detect touch devices to disable custom cursor
    if (window.matchMedia('(pointer: coarse)').matches) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setIsTouch(true);
      return;
    }

    const handleMouseMove = (e: MouseEvent) => {
      cursorRef.current = { x: e.clientX, y: e.clientY };
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      // Check if interactive
      const isInteractive = target.closest(
        'button, a, input, [tabindex="0"], [data-interactive="true"]'
      );
      setIsHovering(!!isInteractive);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseover', handleMouseOver);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseover', handleMouseOver);
    };
  }, [mouseX, mouseY]);

  if (isTouch || shouldReduceMotion) return null;

  return (
    <>
      <motion.div
        animate={{
          opacity: isHovering ? 0.06 : 0, // Below 8%
          scale: isHovering ? 1 : 0.5,
        }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '120px',
          height: '120px',
          backgroundColor: '#ffffff',
          borderRadius: '50%',
          pointerEvents: 'none',
          zIndex: 99998,
          translateX: '-50%',
          translateY: '-50%',
          x: mouseX,
          y: mouseY,
          filter: 'blur(40px)',
          mixBlendMode: 'screen',
        }}
      />
    </>
  );
}
