import { z } from 'zod';
import { registerSchema } from '@/lib/api/openapi';

export const TransportDtoSchema = registerSchema(
  'Transport',
  z.object({
    id: z.string(),
    matchId: z.string().uuid(),
    stadiumId: z.string().uuid(),
    type: z.enum(['shuttle', 'parking', 'train', 'drop-off']),
    name: z.string(),
    capacity: z.number(),
    utilizationPct: z.number(),
    status: z.string(),
    estimatedWaitTime: z.number().nullable(),
  })
);

export type TransportDto = z.infer<typeof TransportDtoSchema>;

export const UpdateTransportDtoSchema = registerSchema(
  'UpdateTransport',
  z.object({
    status: z.string().optional(),
    utilizationPct: z.number().min(0).max(100).optional(),
  })
);
export type UpdateTransportDto = z.infer<typeof UpdateTransportDtoSchema>;
