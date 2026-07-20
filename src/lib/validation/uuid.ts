export const SYSTEM_ORGANIZATION_ID = '00000000-0000-4000-a000-000000000001';
export const SYSTEM_USER_ID = '00000000-0000-4000-a000-000000000002';

const UUID_REGEX = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/;

/**
 * Checks if a string is a valid RFC 4122 UUID.
 */
export function isUUID(val?: string | null): boolean {
  if (!val || typeof val !== 'string') return false;
  return UUID_REGEX.test(val.trim());
}

/**
 * Returns trimmed UUID string if valid, otherwise undefined.
 */
export function toOptionalUUID(val?: string | null): string | undefined {
  if (isUUID(val)) {
    return val!.trim();
  }
  return undefined;
}

/**
 * Returns trimmed UUID string if valid, otherwise returns fallback UUID.
 */
export function toValidUUID(
  val?: string | null,
  fallback: string = SYSTEM_ORGANIZATION_ID
): string {
  if (isUUID(val)) {
    return val!.trim();
  }
  return fallback;
}
