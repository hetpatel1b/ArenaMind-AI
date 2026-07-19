import { BaseService } from '@/lib/services/base.service';
import { BusinessContext } from '@/lib/services/business.context';
import { userRepository } from './repository';
import { toProfileDto } from './mapper';
import { ProfileDto, UpdateUserDto } from './dto';
import { prisma } from '@/lib/db/client';
import { Prisma } from '@prisma/client';
import { NotFoundError, AuthenticationError } from '@/lib/errors/http.errors';

export class UserService extends BaseService {
  constructor() {
    super('UserService');
  }

  async getMyProfile(ctx: BusinessContext): Promise<ProfileDto> {
    return this.execute('getMyProfile', ctx, async () => {
      if (!ctx.userId) throw new AuthenticationError('User ID is missing from context');
      const user = await userRepository.findById(ctx.userId);
      if (!user) {
        throw new NotFoundError('User profile not found');
      }
      return toProfileDto(user);
    });
  }

  async updateMe(ctx: BusinessContext, payload: UpdateUserDto): Promise<ProfileDto> {
    return this.execute('updateMe', ctx, async () => {
      if (!ctx.userId) throw new AuthenticationError('User ID not found in context');

      const updatedUser = await prisma.$transaction(async (tx) => {
        const user = await tx.user.update({
          where: { id: ctx.userId },
          data: {
            phoneNumber: payload.phoneNumber,
            preferences: payload.preferences as Prisma.InputJsonValue | undefined,
          },
        });

        await tx.auditLog.create({
          data: {
            recordId: user.id,
            tableName: 'unknown',
            action: 'UPDATE_USER_PROFILE',
          },
        });

        return user;
      });

      return toProfileDto(updatedUser);
    });
  }
}

export const userService = new UserService();
