'use client';

import { useEffect } from 'react';
import { useInfrastructureWorkspace } from './useInfrastructureWorkspace';

export function useInfrastructureKeyboard() {
  const { dispatch } = useInfrastructureWorkspace();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // SPACE -> Toggle Engine
      if (e.code === 'Space' && e.target === document.body) {
        e.preventDefault();
        dispatch({ type: 'TOGGLE_ENGINE' });
      }
      // ESC -> Clear Selection
      if (e.code === 'Escape') {
        dispatch({ type: 'SET_NODE', payload: null });
        dispatch({ type: 'SET_CLUSTER', payload: null });
        dispatch({ type: 'SET_SERVICE', payload: null });
      }
      // CTRL+K -> Focus Search (simulated for now)
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        const searchInput = document.getElementById('infra-search-input');
        if (searchInput) searchInput.focus();
      }
      // Left/Right Arrow -> Timeline
      if (e.code === 'ArrowLeft' || e.code === 'ArrowRight') {
        // Simple mock for scrubbing timeline
        dispatch({ type: 'TOGGLE_TIMELINE_PLAYBACK' });
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [dispatch]);
}
