'use client';

import { useEffect, useState } from 'react';

/**
 * A polyfill hook to detect whether the user is currently navigating via keyboard.
 * This is useful for conditionally rendering focus rings only when navigating via keyboard
 * (similar to the `:focus-visible` CSS pseudo-class, but programmatic).
 *
 * @returns boolean indicating if the user is in "keyboard navigation mode"
 */
export function useFocusVisible(): boolean {
  const [isFocusVisible, setIsFocusVisible] = useState(false);

  useEffect(() => {
    // Only run on client
    if (typeof window === 'undefined') return;

    let keyboardMode = false;

    const handleKeyDown = (e: KeyboardEvent) => {
      // If the user uses a keyboard (other than modifier keys), they are in keyboard mode
      if (
        e.metaKey ||
        e.altKey ||
        e.ctrlKey ||
        e.key === 'Control' ||
        e.key === 'Shift' ||
        e.key === 'Meta' ||
        e.key === 'Alt'
      ) {
        return;
      }
      keyboardMode = true;
      setIsFocusVisible(true);
    };

    const handlePointerDown = () => {
      keyboardMode = false;
      setIsFocusVisible(false);
    };

    const handleFocus = () => {
      if (keyboardMode) {
        setIsFocusVisible(true);
      }
    };

    document.addEventListener('keydown', handleKeyDown, true);
    document.addEventListener('mousedown', handlePointerDown, true);
    document.addEventListener('pointerdown', handlePointerDown, true);
    document.addEventListener('touchstart', handlePointerDown, true);
    document.addEventListener('focusin', handleFocus, true);

    return () => {
      document.removeEventListener('keydown', handleKeyDown, true);
      document.removeEventListener('mousedown', handlePointerDown, true);
      document.removeEventListener('pointerdown', handlePointerDown, true);
      document.removeEventListener('touchstart', handlePointerDown, true);
      document.removeEventListener('focusin', handleFocus, true);
    };
  }, []);

  return isFocusVisible;
}
