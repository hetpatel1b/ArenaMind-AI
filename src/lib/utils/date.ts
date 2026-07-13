/**
 * Generates an ISO string for a future date based on minutes added.
 */
export function addMinutesToNow(minutes: number): Date {
  const date = new Date();
  date.setMinutes(date.getMinutes() + minutes);
  return date;
}

/**
 * Checks if a given date is in the past.
 */
export function isExpired(date: Date | string): boolean {
  const compareDate = typeof date === 'string' ? new Date(date) : date;
  return new Date().getTime() > compareDate.getTime();
}

/**
 * Standardizes formatting for UI display (e.g., '14:30' or 'Oct 12, 14:30')
 */
export function formatToTime(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return new Intl.DateTimeFormat('en-US', {
    hour: 'numeric',
    minute: 'numeric',
    hour12: false,
  }).format(d);
}
