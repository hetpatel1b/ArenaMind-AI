import { User } from '@prisma/client';
import { ProfileDto } from './dto';

export function toProfileDto(user: User): ProfileDto {
  return {
    id: user.id,
    fullName: user.name || 'Unknown',
    role: user.role,
    department: user.department,
    phoneNumber: user.phoneNumber,
    employeeId: user.employeeId,
    isActive: user.isActive,
    preferences:
      user.preferences && typeof user.preferences === 'object' && !Array.isArray(user.preferences)
        ? (user.preferences as Record<string, SafeAny>)
        : {},
  };
}
