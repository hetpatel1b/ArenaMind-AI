import { PrismaRepository } from '@/lib/repositories/prisma.repository';
import { AccessibilityRequest } from '@prisma/client';
import { prisma } from '@/lib/db/client';

export class AccessibilityRequestRepository extends PrismaRepository<
  AccessibilityRequest,
  any,
  any
> {
  constructor() {
    super(prisma.accessibilityRequest, 'accessibilityRequest');
  }
}

export const accessibilityRequestRepository = new AccessibilityRequestRepository();
