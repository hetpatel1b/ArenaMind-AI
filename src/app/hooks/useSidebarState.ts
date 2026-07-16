'use client';

import { useState, useEffect } from 'react';
import { SidebarState } from '../types/SidebarConfig';

const SIDEBAR_STORAGE_KEY = 'arenamind_sidebar_state';

const defaultState: SidebarState = {
  isExpanded: true,
  expandedGroups: {
    operations: true,
    resources: true,
    administration: true,
  },
  pinnedItems: [],
  favorites: [],
  recentItems: [],
};

export function useSidebarState() {
  const [state, setState] = useState<SidebarState>(defaultState);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsClient(true);
    try {
      const stored = localStorage.getItem(SIDEBAR_STORAGE_KEY);
      if (stored) {
        setState({ ...defaultState, ...JSON.parse(stored) });
      }
    } catch (e) {
      console.error('Failed to load sidebar state', e);
    }
  }, []);

  const saveState = (newState: SidebarState) => {
    setState(newState);
    if (isClient) {
      localStorage.setItem(SIDEBAR_STORAGE_KEY, JSON.stringify(newState));
    }
  };

  const toggleSidebar = () => {
    saveState({ ...state, isExpanded: !state.isExpanded });
  };

  const toggleGroup = (groupId: string) => {
    saveState({
      ...state,
      expandedGroups: {
        ...state.expandedGroups,
        [groupId]: !state.expandedGroups[groupId],
      },
    });
  };

  const togglePin = (itemId: string) => {
    const newPinned = state.pinnedItems.includes(itemId)
      ? state.pinnedItems.filter((id) => id !== itemId)
      : [...state.pinnedItems, itemId];
    saveState({ ...state, pinnedItems: newPinned });
  };

  const toggleFavorite = (itemId: string) => {
    const newFavorites = state.favorites.includes(itemId)
      ? state.favorites.filter((id) => id !== itemId)
      : [...state.favorites, itemId];
    saveState({ ...state, favorites: newFavorites });
  };

  const addRecent = (itemId: string) => {
    const withoutItem = state.recentItems.filter((id) => id !== itemId);
    const newRecent = [itemId, ...withoutItem].slice(0, 5);
    saveState({ ...state, recentItems: newRecent });
  };

  return {
    state,
    isClient,
    toggleSidebar,
    toggleGroup,
    togglePin,
    toggleFavorite,
    addRecent,
  };
}
