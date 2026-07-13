'use client';

import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { motion, useReducedMotion } from 'framer-motion';

export function DashboardBootstrapper({ children }: { children: React.ReactNode }) {
  const searchParams = useSearchParams();
  const shouldReduceMotion = useReducedMotion();

  // We only boot if the query parameter is present
  const isBooting = searchParams.get('boot') === 'true' && !shouldReduceMotion;

  // State to track if the boot animation is actively running
  const [isBootSequenceActive, setIsBootSequenceActive] = useState(isBooting);

  useEffect(() => {
    if (isBootSequenceActive) {
      // The animation finishes in about 1.5 seconds due to stagger, we clear it so it doesn't run again on normal navigations
      const t = setTimeout(() => setIsBootSequenceActive(false), 2000);
      return () => clearTimeout(t);
    }
  }, [isBootSequenceActive]);

  if (!isBootSequenceActive) {
    return <>{children}</>;
  }

  // If we are booting, we wrap the children in a motion div that staggers their entry
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={{
        hidden: {},
        visible: {
          transition: {
            staggerChildren: 0.15,
            delayChildren: 0.2, // Small delay to let the routing fully finish
          },
        },
      }}
      style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column' }}
    >
      {/* 
        We pass a Context provider or we can just rely on the layout structure.
        Since we wrap the layout, we can just intercept the standard divs in the layout 
        and replace them with motion.divs inside the actual layout.tsx.
        However, to keep it clean, we just provide the stagger container here.
      */}
      {children}
    </motion.div>
  );
}

// A helper wrapper for individual shell components to animate in
export function ShellComponentReveal({
  children,
  style,
}: {
  children: React.ReactNode;
  style?: React.CSSProperties;
}) {
  const searchParams = useSearchParams();
  const shouldReduceMotion = useReducedMotion();
  const isBooting = searchParams.get('boot') === 'true' && !shouldReduceMotion;

  if (!isBooting) {
    return <div style={style}>{children}</div>;
  }

  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 10, filter: 'blur(4px)' },
        visible: {
          opacity: 1,
          y: 0,
          filter: 'blur(0px)',
          transition: { type: 'spring', stiffness: 400, damping: 30 },
        },
      }}
      style={style}
    >
      {children}
    </motion.div>
  );
}
