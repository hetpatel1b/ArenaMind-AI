import { z } from 'zod';
import { HospitalityTier } from './hospitality.types';

export const HospitalityGuestSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  tier: z.nativeEnum(HospitalityTier),
  suiteId: z.string(),
  eta: z.string(),
  specialRequirements: z.array(z.string()),
});

export const HospitalitySuiteSchema = z.object({
  id: z.string(),
  name: z.string(),
  tier: z.nativeEnum(HospitalityTier),
  capacity: z.number().positive(),
  occupancy: z.number().nonnegative(),
  staffAssigned: z.number().nonnegative(),
});
