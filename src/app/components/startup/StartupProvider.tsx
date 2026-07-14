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

    // The startup experience lasts 2.3 - 3.0 seconds.
    // We'll set the complete flag at 2.8s to trigger the fade out.
    const timer = setTimeout(() => {
      setIsStartupComplete(true);
    }, 2800);

    return () => clearTimeout(timer);
  }, [shouldReduceMotion]);

  return (
    <StartupContext.Provider value={{ isStartupComplete, reducedMotion: shouldReduceMotion }}>
      {children}
    </StartupContext.Provider>
  );
}

export function useStartup() {
  const context = useContext(StartupContext);
  if (context === undefined) {
    throw new Error('useStartup must be used within a StartupProvider');
  }
  return context;
}
