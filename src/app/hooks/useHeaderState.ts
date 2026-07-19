'use client';

import { useState, useEffect, useCallback } from 'react';
import { LoggerService } from '@/lib/platform/observability/LoggerService';

export type ThemeType = 'light' | 'dark' | 'system';

export interface HeaderState {
  theme: ThemeType;
  recentSearches: string[];
  pinnedSearches: string[];
  readNotifications: string[];
  lastSelectedEnvironment: string;
}

const HEADER_STORAGE_KEY = 'arenamind_header_state';

const defaultState: HeaderState = {
  theme: 'dark',
  recentSearches: [],
  pinnedSearches: [],
  readNotifications: [],
  lastSelectedEnvironment: 'production',
};

export function useHeaderState() {
  const [state, setState] = useState<HeaderState>(defaultState);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsClient(true);
    try {
      const stored = localStorage.getItem(HEADER_STORAGE_KEY);
      if (stored) {
        setState({ ...defaultState, ...JSON.parse(stored) });
      }
    } catch (e) {
      LoggerService.error('Failed to load header state', e);
    }
  }, []);

  const saveState = useCallback((newState: Partial<HeaderState>) => {
    setState((prev) => {
      const nextState = { ...prev, ...newState };
      try {
        localStorage.setItem(HEADER_STORAGE_KEY, JSON.stringify(nextState));
      } catch (e) {
        LoggerService.error('Failed to save header state', e);
      }
      return nextState;
    });
  }, []);

  const setTheme = useCallback(
    (theme: ThemeType) => {
      saveState({ theme });
      // Global theme side-effect can go here if ArenaMind supports dynamic classes on <html>
    },
    [saveState]
  );

  const addRecentSearch = useCallback((query: string) => {
    setState((prev) => {
      const filtered = prev.recentSearches.filter((s) => s !== query);
      const updated = [query, ...filtered].slice(0, 10); // Keep last 10
      const nextState = { ...prev, recentSearches: updated };
      try {
        localStorage.setItem(HEADER_STORAGE_KEY, JSON.stringify(nextState));
      } catch (e) {}
      return nextState;
    });
  }, []);

  const clearRecentSearches = useCallback(() => {
    saveState({ recentSearches: [] });
  }, [saveState]);

  const markNotificationRead = useCallback((id: string) => {
    setState((prev) => {
      if (prev.readNotifications.includes(id)) return prev;
      const updated = [...prev.readNotifications, id];
      const nextState = { ...prev, readNotifications: updated };
      try {
        localStorage.setItem(HEADER_STORAGE_KEY, JSON.stringify(nextState));
      } catch (e) {}
      return nextState;
    });
  }, []);

  const markAllNotificationsRead = useCallback((ids: string[]) => {
    setState((prev) => {
      const updated = Array.from(new Set([...prev.readNotifications, ...ids]));
      const nextState = { ...prev, readNotifications: updated };
      try {
        localStorage.setItem(HEADER_STORAGE_KEY, JSON.stringify(nextState));
      } catch (e) {}
      return nextState;
    });
  }, []);

  const setEnvironment = useCallback(
    (env: string) => {
      saveState({ lastSelectedEnvironment: env });
    },
    [saveState]
  );

  return {
    state,
    isClient,
    setTheme,
    addRecentSearch,
    clearRecentSearches,
    markNotificationRead,
    markAllNotificationsRead,
    setEnvironment,
  };
}
