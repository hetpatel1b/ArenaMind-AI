/**
 * Recursively converts complex objects (Dates, Prisma Decimals) into plain objects
 * for safe serialization between Server Components and Client Components.
 */
export const serializeToPlainObject = <T>(obj: T): any => {
  if (obj === null || obj === undefined) return obj;
  if (obj instanceof Date) return obj.toISOString();

  // Check for Prisma Decimal (which has toNumber method and specific properties)
  if (
    typeof obj === 'object' &&
    'toNumber' in obj &&
    typeof (obj as { toNumber?: unknown }).toNumber === 'function' &&
    'd' in obj &&
    'e' in obj &&
    's' in obj
  ) {
    return (obj as { toNumber: () => number }).toNumber();
  }
  if (Array.isArray(obj)) return obj.map((item) => serializeToPlainObject(item));
  if (typeof obj === 'object') {
    const res: any = {};
    for (const key of Object.keys(obj)) {
      res[key] = serializeToPlainObject((obj as Record<string, unknown>)[key]);
    }
    return res;
  }
  return obj;
};
