import { PrismaRepository } from '@/lib/repositories/prisma.repository';
import { Camera } from '@prisma/client';
import { prisma } from '@/lib/db/client';

export class CameraRepository extends PrismaRepository<Camera, any, any> {
  constructor() {
    super(prisma.camera as any);
  }
}

export const cameraRepository = new CameraRepository();
