import { z } from 'zod';
import { registerSchema } from '@/lib/api/openapi';

export const AlertDtoSchema = registerSchema(
  'Alert',
  z.object({
    id: z.string().uuid(),
    userId: z.string().uuid(),
    matchId: z.string().uuid().nullable(),
    type: z.string(),
    title: z.string(),
    body: z.string(),
    data: z.any(),
    createdAt: z.date(),
  })
);

export type AlertDto = z.infer<typeof AlertDtoSchema>;

export const CreateAlertDtoSchema = registerSchema(
  'CreateAlert',
  z.object({
    userId: z.string().uuid().optional(),
    type: z.string().min(3).max(50),
    title: z.string().min(3).max(100),
    body: z.string().min(5).max(500),
    data: z.any().optional(),
  })
);
export type CreateAlertDto = z.infer<typeof CreateAlertDtoSchema>;

export const UpdateAlertDtoSchema = registerSchema(
  'UpdateAlert',
  z.object({
    acknowledged: z.boolean().optional(),
  })
);
export type UpdateAlertDto = z.infer<typeof UpdateAlertDtoSchema>;
