'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePathname } from 'next/navigation';
import { useWorkspaceStore } from '@/app/hooks/useWorkspaceStore';

export function RouteTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { appearance } = useWorkspaceStore();

  if (appearance.reducedMotion) {
    return <>{children}</>;
  }

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={pathname}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ type: 'spring', stiffness: 400, damping: 30 }}
        style={{ flex: 1, display: 'flex', flexDirection: 'column', height: '100%', minHeight: 0 }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
