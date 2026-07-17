import { z } from 'zod';
import { registerSchema } from '@/lib/api/openapi';

export const ReportDtoSchema = registerSchema(
  'Report',
  z.object({
    id: z.string().uuid(),
    venueId: z.string().uuid(),
    matchId: z.string().uuid().nullable(),
    userId: z.string().uuid(),
    type: z.string(),
    generatedAt: z.date(),
  })
);

export type ReportDto = z.infer<typeof ReportDtoSchema>;

export const CreateReportDtoSchema = registerSchema(
  'CreateReport',
  z.object({
    type: z.enum(['executive_summary', 'incident_log', 'crowd_analytics', 'shift_handover']),
  })
);
export type CreateReportDto = z.infer<typeof CreateReportDtoSchema>;
