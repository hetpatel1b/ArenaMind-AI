'use client';

import React, { useEffect, useRef, useCallback } from 'react';
import { FOCUSABLE_ELEMENTS_STRICT_SELECTOR } from './constants';
import { isTabForward, isTabBackward, isEscape } from './keyboard';

/**
 * Returns a list of all focusable elements within a given container.
 */
export function getFocusableElements(container: HTMLElement): HTMLElement[] {
  return Array.from(
    container.querySelectorAll<HTMLElement>(FOCUSABLE_ELEMENTS_STRICT_SELECTOR)
  ).filter(
    (el) =>
      !el.hasAttribute('disabled') &&
      el.getAttribute('aria-hidden') !== 'true' &&
      el.tabIndex !== -1
  );
}

export interface FocusTrapProps {
  children: React.ReactNode;
  active: boolean;
  onEscape?: () => void;
  initialFocusRef?: React.RefObject<HTMLElement | null>;
  returnFocusOnDeactivate?: boolean;
}

/**
 * FocusTrap isolates focus within its children while active.
 * It is essential for Modals, Dialogs, and Drawers to ensure screen reader
 * and keyboard users do not interact with background content.
 */
export function FocusTrap({
  children,
  active,
  onEscape,
  initialFocusRef,
  returnFocusOnDeactivate = true,
}: FocusTrapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);

  // Handle initialization and cleanup
  useEffect(() => {
    if (active) {
      // Store previous focus
      previousFocusRef.current = document.activeElement as HTMLElement;

      // Set initial focus
      if (initialFocusRef?.current) {
        initialFocusRef.current.focus();
      } else if (containerRef.current) {
        const focusable = getFocusableElements(containerRef.current);
        if (focusable.length > 0) {
          focusable[0]?.focus();
        } else {
          containerRef.current.focus(); // Fallback to container
        }
      }
    } else if (returnFocusOnDeactivate && previousFocusRef.current) {
      // Restore focus on deactivate
      previousFocusRef.current.focus();
    }

    return () => {
      if (active && returnFocusOnDeactivate && previousFocusRef.current) {
        previousFocusRef.current.focus();
      }
    };
  }, [active, initialFocusRef, returnFocusOnDeactivate]);

  // Handle keyboard trapping
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLDivElement>) => {
      if (!active) return;

      if (isEscape(e) && onEscape) {
        e.preventDefault();
        onEscape();
        return;
      }

      const isTabFwd = isTabForward(e);
      const isTabBwd = isTabBackward(e);

      if (isTabFwd || isTabBwd) {
        if (!containerRef.current) return;

        const focusable = getFocusableElements(containerRef.current);
        if (focusable.length === 0) {
          e.preventDefault();
          return;
        }

        const first = focusable[0];
        const last = focusable[focusable.length - 1];

        if (isTabFwd && document.activeElement === last) {
          e.preventDefault();
          first?.focus();
        } else if (isTabBwd && document.activeElement === first) {
          e.preventDefault();
          last?.focus();
        }
      }
    },
    [active, onEscape]
  );

  return (
    <div
      ref={containerRef}
      onKeyDown={handleKeyDown}
      tabIndex={-1} // Allow fallback focus
      style={{ outline: 'none' }} // Hide focus ring if container receives focus
    >
      {children}
    </div>
  );
}

/**
 * Hook to imperatively manage focus, useful for complex widgets.
 */
export function useFocusManager(containerRef: React.RefObject<HTMLElement | null>) {
  const focusNext = useCallback(() => {
    if (!containerRef.current) return;
    const focusable = getFocusableElements(containerRef.current);
    const index = focusable.findIndex((el) => el === document.activeElement);
    if (index >= 0 && index < focusable.length - 1) {
      focusable[index + 1]?.focus();
    } else if (focusable.length > 0) {
      focusable[0]?.focus();
    }
  }, [containerRef]);

  const focusPrevious = useCallback(() => {
    if (!containerRef.current) return;
    const focusable = getFocusableElements(containerRef.current);
    const index = focusable.findIndex((el) => el === document.activeElement);
    if (index > 0) {
      focusable[index - 1]?.focus();
    } else if (focusable.length > 0) {
      focusable[focusable.length - 1]?.focus();
    }
  }, [containerRef]);

  const focusFirst = useCallback(() => {
    if (!containerRef.current) return;
    const focusable = getFocusableElements(containerRef.current);
    if (focusable.length > 0) focusable[0]?.focus();
  }, [containerRef]);

  const focusLast = useCallback(() => {
    if (!containerRef.current) return;
    const focusable = getFocusableElements(containerRef.current);
    if (focusable.length > 0) focusable[focusable.length - 1]?.focus();
  }, [containerRef]);

  return { focusNext, focusPrevious, focusFirst, focusLast, getFocusableElements };
}
