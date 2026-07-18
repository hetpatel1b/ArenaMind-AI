'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { useReducedMotion } from 'framer-motion';

interface StartupContextType {
  isStartupComplete: boolean;
  reducedMotion: boolean;
}

const StartupContext = createContext<StartupContextType | undefined>(undefined);

export function StartupProvider({ children }: { children: React.ReactNode }) {
  const [isStartupComplete, setIsStartupComplete] = useState(false);
  const shouldReduceMotion = useReducedMotion() ?? false;

  useEffect(() => {
    if (shouldReduceMotion) {
      // Skip animation, max 150ms per requirements
      const timer = setTimeout(() => {
        setIsStartupComplete(true);
      }, 50);
      return () => clearTimeout(timer);
    }

    // The startup experience lasts exactly 2.0 seconds.
    const timer = setTimeout(() => {
      setIsStartupComplete(true);
    }, 2000);

    return () => clearTimeout(timer);
  }, [shouldReduceMotion]);

  const value = React.useMemo(
    () => ({
      isStartupComplete,
      reducedMotion: shouldReduceMotion,
    }),
    [isStartupComplete, shouldReduceMotion]
  );

  return <StartupContext.Provider value={value}>{children}</StartupContext.Provider>;
}

export function useStartup() {
  const context = useContext(StartupContext);
  if (context === undefined) {
    throw new Error('useStartup must be used within a StartupProvider');
  }
  return context;
}
