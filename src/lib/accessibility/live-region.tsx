'use client';

import React, { createContext, useContext, useState, useCallback, useEffect, useRef } from 'react';

export type AnnouncementPriority = 'polite' | 'assertive';

export interface AnnouncementContextValue {
  announce: (message: string, priority?: AnnouncementPriority) => void;
  announceError: (message: string) => void;
  announceSuccess: (message: string) => void;
  announceStatus: (message: string) => void;
}

const AnnouncementContext = createContext<AnnouncementContextValue | null>(null);

export interface AccessibilityProviderProps {
  children: React.ReactNode;
}

/**
 * The overarching AccessibilityProvider that establishes the global accessibility
 * contexts (such as LiveRegionProvider) for the application.
 */
export function AccessibilityProvider({ children }: AccessibilityProviderProps) {
  return <LiveRegionProvider>{children}</LiveRegionProvider>;
}

/**
 * Manages an invisible DOM node used to announce dynamic changes to screen readers.
 * Uses 'aria-live' regions.
 */
export function LiveRegionProvider({ children }: { children: React.ReactNode }) {
  const [politeMessage, setPoliteMessage] = useState('');
  const [assertiveMessage, setAssertiveMessage] = useState('');

  const politeTimer = useRef<NodeJS.Timeout>(null);
  const assertiveTimer = useRef<NodeJS.Timeout>(null);

  // Clear messages after they are likely read, so the same message can be re-announced
  const clearPolite = useCallback(() => {
    if (politeTimer.current) clearTimeout(politeTimer.current);
    politeTimer.current = setTimeout(() => setPoliteMessage(''), 3000);
  }, []);

  const clearAssertive = useCallback(() => {
    if (assertiveTimer.current) clearTimeout(assertiveTimer.current);
    assertiveTimer.current = setTimeout(() => setAssertiveMessage(''), 3000);
  }, []);

  const announce = useCallback(
    (message: string, priority: AnnouncementPriority = 'polite') => {
      if (priority === 'assertive') {
        setAssertiveMessage(message);
        clearAssertive();
      } else {
        setPoliteMessage(message);
        clearPolite();
      }
    },
    [clearPolite, clearAssertive]
  );

  const announceError = useCallback(
    (message: string) => announce(`Error: ${message}`, 'assertive'),
    [announce]
  );

  const announceSuccess = useCallback(
    (message: string) => announce(`Success: ${message}`, 'polite'),
    [announce]
  );

  const announceStatus = useCallback((message: string) => announce(message, 'polite'), [announce]);

  useEffect(() => {
    return () => {
      if (politeTimer.current) clearTimeout(politeTimer.current);
      if (assertiveTimer.current) clearTimeout(assertiveTimer.current);
    };
  }, []);

  return (
    <AnnouncementContext.Provider
      value={{ announce, announceError, announceSuccess, announceStatus }}
    >
      {children}
      {/* Invisible screen reader announcer node */}
      <div
        style={{
          position: 'absolute',
          width: '1px',
          height: '1px',
          padding: 0,
          margin: '-1px',
          overflow: 'hidden',
          clip: 'rect(0, 0, 0, 0)',
          whiteSpace: 'nowrap',
          borderWidth: 0,
        }}
      >
        <div aria-live="polite" aria-atomic="true">
          {politeMessage}
        </div>
        <div aria-live="assertive" aria-atomic="true">
          {assertiveMessage}
        </div>
      </div>
    </AnnouncementContext.Provider>
  );
}

/**
 * Hook to access the announcement API.
 * Throws an error if used outside of the AccessibilityProvider.
 */
export function useAnnouncement(): AnnouncementContextValue {
  const context = useContext(AnnouncementContext);
  if (!context) {
    throw new Error('useAnnouncement must be used within an AccessibilityProvider');
  }
  return context;
}
