import { PrismaRepository } from '@/lib/repositories/prisma.repository';
import { SystemSetting } from '@prisma/client';
import { prisma } from '@/lib/db/client';

export class SettingRepository extends PrismaRepository<SystemSetting, SafeAny, SafeAny> {
  constructor() {
    super(prisma.systemSetting, 'systemSetting');
  }
}

export const settingRepository = new SettingRepository();
