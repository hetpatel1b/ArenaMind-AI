import { PrismaRepository } from '@/lib/repositories/prisma.repository';
import { User } from '@prisma/client';
import { prisma } from '@/lib/db/client';

export class UserRepository extends PrismaRepository<User, any, any> {
  constructor() {
    super(prisma.user as any);
  }
}

export const userRepository = new UserRepository();
