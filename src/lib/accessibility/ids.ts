import { useId } from 'react';

/**
 * Generates a stable, SSR-safe ID.
 * Optionally prefixes the ID with a component name for easier debugging.
 *
 * @param prefix Optional string prefix for the ID
 * @returns A unique string ID
 */
export function useAccessibleId(prefix?: string): string {
  const reactId = useId();
  // React's useId returns strings like ":r1:", we sanitize it slightly for DOM usage
  const sanitizedId = reactId.replace(/:/g, '');
  return prefix ? `${prefix}-${sanitizedId}` : `a11y-${sanitizedId}`;
}
