'use client';

import { useEffect } from 'react';
import { useCommandCenter } from '@/lib/contexts/CommandCenterContext';

export function useKeyboardShortcuts(onCommandPaletteToggle: () => void) {
  const { dispatch, focusedMissionId, activeMissions } = useCommandCenter();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger if user is typing in an input
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }

      // Command Palette (Cmd+K or Ctrl+K)
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        onCommandPaletteToggle();
        return;
      }

      // Search fallback to Command Palette ( / )
      if (e.key === '/') {
        e.preventDefault();
        onCommandPaletteToggle();
        return;
      }

      // Escape to exit focus mode or clear selection
      if (e.key === 'Escape') {
        dispatch({ type: 'MISSION_FOCUSED', payload: { missionId: null } });
        // Can also trigger focusMode = false here if it was a standalone state
        // But since we are managing it in CommandCenter context:
        // Actually, let's fire a specific event if needed, but for now MISSION_FOCUSED null is good.
        return;
      }

      // 'F' to focus first active mission (if none selected)
      if (e.key === 'f' || e.key === 'F') {
        if (!focusedMissionId) {
          const firstActive = activeMissions.find((m) => m.phase !== 'RESOLVED');
          if (firstActive) {
            dispatch({ type: 'MISSION_FOCUSED', payload: { missionId: firstActive.id } });
          }
        }
        return;
      }

      // 'Space' to toggle something? The spec said "Space - Pause updates". We could dispatch an event.
      // For now we'll just log or dispatch a hypothetical event.

      // Shift+Enter to approve mission
      if (e.shiftKey && e.key === 'Enter') {
        if (focusedMissionId) {
          const mission = activeMissions.find((m) => m.id === focusedMissionId);
          if (mission && mission.phase === 'APPROVAL') {
            dispatch({ type: 'APPROVAL_GRANTED', payload: { missionId: mission.id } });
          }
        }
        return;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [dispatch, focusedMissionId, activeMissions, onCommandPaletteToggle]);
}
