import React from 'react';
import { KEYBOARD_KEYS } from './constants';

/**
 * Checks if a keyboard event is the Enter or Space key.
 */
export function isEnterSpace(event: React.KeyboardEvent | KeyboardEvent): boolean {
  return event.key === KEYBOARD_KEYS.ENTER || event.key === KEYBOARD_KEYS.SPACE;
}

/**
 * Checks if a keyboard event is the Escape key.
 */
export function isEscape(event: React.KeyboardEvent | KeyboardEvent): boolean {
  return event.key === KEYBOARD_KEYS.ESCAPE;
}

/**
 * Checks if a keyboard event is any of the arrow keys.
 */
export function isArrowKey(event: React.KeyboardEvent | KeyboardEvent): boolean {
  return [
    KEYBOARD_KEYS.ARROW_UP,
    KEYBOARD_KEYS.ARROW_DOWN,
    KEYBOARD_KEYS.ARROW_LEFT,
    KEYBOARD_KEYS.ARROW_RIGHT,
  ].includes(event.key as any);
}

/**
 * Checks if a keyboard event is the Home or End key.
 */
export function isHomeEnd(event: React.KeyboardEvent | KeyboardEvent): boolean {
  return event.key === 'Home' || event.key === 'End';
}

/**
 * Checks if a keyboard event is a forward Tab navigation.
 */
export function isTabForward(event: React.KeyboardEvent | KeyboardEvent): boolean {
  return event.key === KEYBOARD_KEYS.TAB && !event.shiftKey;
}

/**
 * Checks if a keyboard event is a backward Tab navigation.
 */
export function isTabBackward(event: React.KeyboardEvent | KeyboardEvent): boolean {
  return event.key === KEYBOARD_KEYS.TAB && event.shiftKey;
}

/**
 * Creates an onKeyDown handler that triggers a callback when Enter or Space is pressed.
 * This is useful for making custom elements (like divs/spans) act as buttons.
 *
 * @param callback The function to execute
 * @returns A React KeyboardEventHandler
 */
export function handleEnterSpace<T extends HTMLElement = HTMLElement>(
  callback: (event: React.KeyboardEvent<T>) => void
): React.KeyboardEventHandler<T> {
  return (event) => {
    if (isEnterSpace(event)) {
      event.preventDefault(); // Prevent page scroll on Space
      callback(event);
    }
  };
}
