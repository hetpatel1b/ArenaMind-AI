import { z } from 'zod';
import { registerSchema } from '@/lib/api/openapi';

export const IncidentDtoSchema = registerSchema(
  'Incident',
  z.object({
    id: z.string().uuid(),
    matchId: z.string().uuid(),
    stadiumId: z.string().uuid(),
    zoneId: z.string().uuid().nullable(),
    incidentTypeId: z.string().uuid().nullable(),
    title: z.string(),
    description: z.string(),
    locationDetail: z.string().nullable(),
    severityTier: z.number(),
    status: z.string(),
    tags: z.array(z.string()),
    reportedBy: z.string().uuid(),
    assignedTo: z.string().uuid().nullable(),
    aiType: z.string().nullable(),
    aiTier: z.number().nullable(),
    aiConfidence: z.number().nullable(),
    resolvedAt: z.date().nullable(),
    resolvedBy: z.string().uuid().nullable(),
  })
);

export type IncidentDto = z.infer<typeof IncidentDtoSchema>;

export const CreateIncidentDtoSchema = registerSchema(
  'CreateIncident',
  z.object({
    zoneId: z.string().uuid().optional(),
    incidentTypeId: z.string().uuid().optional(),
    title: z.string().min(3).max(100),
    description: z.string().min(10).max(1000),
    locationDetail: z.string().optional(),
    severityTier: z.number().int().min(1).max(4).default(4),
    tags: z.array(z.string()).default([]),
  })
);
export type CreateIncidentDto = z.infer<typeof CreateIncidentDtoSchema>;

export const UpdateIncidentDtoSchema = registerSchema(
  'UpdateIncident',
  z.object({
    status: z.enum(['open', 'active', 'monitoring', 'resolved', 'closed']).optional(),
    assignedTo: z.string().uuid().nullable().optional(),
    severityTier: z.number().int().min(1).max(4).optional(),
    resolutionNotes: z.string().optional(),
  })
);
export type UpdateIncidentDto = z.infer<typeof UpdateIncidentDtoSchema>;
