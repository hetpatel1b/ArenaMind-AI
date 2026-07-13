import { z } from 'zod';
import { registerSchema } from '@/lib/api/openapi';

export const AccessibilityRequestDtoSchema = registerSchema(
  'AccessibilityRequest',
  z.object({
    id: z.string().uuid(),
    matchId: z.string().uuid(),
    zoneId: z.string().uuid().nullable(),
    requestType: z.string(),
    status: z.string(),
    priority: z.string(),
  })
);

export type AccessibilityRequestDto = z.infer<typeof AccessibilityRequestDtoSchema>;

export const CreateAccessibilityRequestDtoSchema = registerSchema(
  'CreateAccessibilityRequest',
  z.object({
    zoneId: z.string().uuid().optional(),
    requestType: z.string().min(3).max(100),
    priority: z.enum(['low', 'medium', 'high', 'critical']).default('medium'),
  })
);
export type CreateAccessibilityRequestDto = z.infer<typeof CreateAccessibilityRequestDtoSchema>;

export const UpdateAccessibilityRequestDtoSchema = registerSchema(
  'UpdateAccessibilityRequest',
  z.object({
    status: z.enum(['pending', 'assigned', 'in_progress', 'completed', 'cancelled']).optional(),
    priority: z.enum(['low', 'medium', 'high', 'critical']).optional(),
  })
);
export type UpdateAccessibilityRequestDto = z.infer<typeof UpdateAccessibilityRequestDtoSchema>;
