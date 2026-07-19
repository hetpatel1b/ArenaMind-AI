import { z } from 'zod';
import { registerSchema } from '@/lib/api/openapi';

export const SettingDtoSchema = registerSchema(
  'Setting',
  z.object({
    id: z.string().uuid(),
    key: z.string(),
    value: z.unknown(),
  })
);

export type SettingDto = z.infer<typeof SettingDtoSchema>;

export const UpdateSettingDtoSchema = registerSchema(
  'UpdateSetting',
  z.object({
    key: z.string().min(1).max(100),
    value: z.unknown(),
  })
);
export type UpdateSettingDto = z.infer<typeof UpdateSettingDtoSchema>;
