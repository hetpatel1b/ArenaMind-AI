'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useWorkspaceStore } from './useWorkspaceStore';

export function useGlobalShortcuts() {
  const router = useRouter();
  const { shortcuts, setShowShortcutOverlay } = useWorkspaceStore();

  useEffect(() => {
    if (!shortcuts.enabled) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if typing in an input
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }

      // Shift + ? -> Toggle Help
      if (e.shiftKey && e.key === '?') {
        e.preventDefault();
        setShowShortcutOverlay(!shortcuts.showOverlay);
        return;
      }

      // ESC -> Close Help
      if (e.key === 'Escape') {
        setShowShortcutOverlay(false);
      }

      // Alt + 1-8 -> Routing
      if (e.altKey) {
        switch (e.key) {
          case '1':
            e.preventDefault();
            router.push('/dashboard');
            break;
          case '2':
            e.preventDefault();
            router.push('/dashboard/incident');
            break;
          case '3':
            e.preventDefault();
            router.push('/dashboard/mobility');
            break;
          case '4':
            e.preventDefault();
            router.push('/dashboard/intelligence');
            break;
          case '5':
            e.preventDefault();
            router.push('/dashboard/workforce');
            break;
          case '6':
            e.preventDefault();
            router.push('/dashboard/camera');
            break;
          case '7':
            e.preventDefault();
            router.push('/dashboard/governance');
            break;
          case '8':
            e.preventDefault();
            router.push('/dashboard/infrastructure');
            break;
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [shortcuts.enabled, shortcuts.showOverlay, setShowShortcutOverlay, router]);
}
