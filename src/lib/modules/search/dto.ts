import { z } from 'zod';
import { registerSchema } from '@/lib/api/openapi';

export const SearchResultDtoSchema = registerSchema(
  'SearchResult',
  z.object({
    id: z.string(),
    type: z.enum(['incident', 'match', 'user', 'stadium']),
    title: z.string(),
    subtitle: z.string().nullable(),
    score: z.number().optional(),
  })
);

export type SearchResultDto = z.infer<typeof SearchResultDtoSchema>;
