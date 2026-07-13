import { User } from '@prisma/client';
import { ProfileDto } from './dto';

export function toProfileDto(user: User): ProfileDto {
  return {
    id: user.id,
    fullName: user.fullName,
    role: user.role,
    department: user.department,
    phoneNumber: user.phoneNumber,
    employeeId: user.employeeId,
    isActive: user.isActive,
    preferences: user.preferences,
  };
}
