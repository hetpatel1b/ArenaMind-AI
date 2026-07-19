import { z } from 'zod';
import { AccreditationLevel } from './media.types';

export const JournalistSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  organization: z.string(),
  accreditationLevel: z.nativeEnum(AccreditationLevel),
  currentZoneId: z.string().optional(),
  isPriority: z.boolean().default(false),
});

export const MediaZoneSchema = z.object({
  id: z.string(),
  name: z.string(),
  capacity: z.number().int().positive(),
  currentOccupancy: z.number().int().nonnegative(),
  requiredAccreditation: z.array(z.nativeEnum(AccreditationLevel)),
});
