'use client';

import { useEffect } from 'react';
import { useMap } from '../context/MapContext';

export function useMapKeyboardShortcuts() {
  const { state, dispatch } = useMap();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger if user is typing in an input
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }

      switch (e.key.toLowerCase()) {
        case 'v':
          dispatch({ type: 'SET_ACTIVE_TOOL', payload: 'POINTER' });
          break;
        case 'h':
          dispatch({ type: 'SET_ACTIVE_TOOL', payload: 'PAN' });
          break;
        case 'm':
          dispatch({ type: 'SET_ACTIVE_TOOL', payload: 'MEASURE' });
          break;
        case 'l':
          dispatch({ type: 'SET_WORKSPACE_MODE', payload: 'SETTINGS' }); // Layer settings
          break;
        case 'f':
          dispatch({ type: 'TOGGLE_FULLSCREEN' });
          break;
        case 'escape':
          if (state.activeMapTool !== 'POINTER') {
            dispatch({ type: 'SET_ACTIVE_TOOL', payload: 'POINTER' });
          } else if (state.workspaceMode !== 'NONE') {
            dispatch({ type: 'SET_WORKSPACE_MODE', payload: 'NONE' });
          } else {
            dispatch({ type: 'CLEAR_SELECTED_OBJECTS' });
          }
          break;
        case ' ': // spacebar
          if (e.type === 'keydown') {
            // We can't really do a "temporary" pan state cleanly without local state,
            // but we'll set it to pan while space is held if not already panning.
            dispatch({ type: 'SET_ACTIVE_TOOL', payload: 'PAN' });
          }
          break;
        case '0':
          if (e.ctrlKey || e.metaKey) {
            e.preventDefault();
            dispatch({ type: 'SET_VIEWPORT', payload: { zoom: 1 } });
          }
          break;
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key === ' ' && state.activeMapTool === 'PAN') {
        dispatch({ type: 'SET_ACTIVE_TOOL', payload: 'POINTER' });
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [dispatch, state.activeMapTool, state.workspaceMode]);
}
