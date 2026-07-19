import { prisma } from '@/lib/db/client';
import { AuditService } from '../audit/audit.service';
import bcrypt from 'bcrypt';
import { UserRole } from '@prisma/client';

export class UserService {
  static async getUsersByOrganization(organizationId: string) {
    return prisma.user.findMany({
      where: { organizationId },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        isActive: true,
        isSuspended: true,
        lastLoginAt: true,
        department: true,
        mfaReady: true,
      },
    });
  }

  static async inviteUser(data: any, inviterId: string, organizationId: string) {
    const hashedPassword = await bcrypt.hash(data.password, 10);

    const user = await prisma.user.create({
      data: {
        email: data.email,
        name: data.name,
        password: hashedPassword,
        role: data.role as UserRole,
        organizationId,
        isActive: true,
      },
    });

    await AuditService.log({
      tableName: 'User',
      recordId: user.id,
      action: 'CREATE',
      userId: inviterId,
      organizationId,
      newData: { email: user.email, role: user.role },
    });

    return user;
  }

  static async suspendUser(userId: string, adminId: string, organizationId: string) {
    const oldUser = await prisma.user.findFirst({ where: { id: userId, organizationId } });
    if (!oldUser) throw new Error('User not found');

    const user = await prisma.user.update({
      where: { id: userId },
      data: { isSuspended: true },
    });

    await AuditService.log({
      tableName: 'User',
      recordId: user.id,
      action: 'UPDATE',
      userId: adminId,
      organizationId,
      oldData: { isSuspended: false },
      newData: { isSuspended: true },
    });

    return user;
  }
}
