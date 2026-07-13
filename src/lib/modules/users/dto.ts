import { z } from 'zod';
import { registerSchema } from '@/lib/api/openapi';

export const ProfileDtoSchema = registerSchema(
  'Profile',
  z.object({
    id: z.string().uuid(),
    fullName: z.string(),
    role: z.string(),
    department: z.string().nullable(),
    phoneNumber: z.string().nullable(),
    employeeId: z.string().nullable(),
    isActive: z.boolean(),
    preferences: z.any(),
  })
);

export type ProfileDto = z.infer<typeof ProfileDtoSchema>;

export const UpdateUserDtoSchema = registerSchema(
  'UpdateUser',
  z.object({
    phoneNumber: z.string().nullable().optional(),
    preferences: z.any().optional(),
  })
);
export type UpdateUserDto = z.infer<typeof UpdateUserDtoSchema>;
