import { PrismaRepository } from '@/lib/repositories/prisma.repository';
import { Camera } from '@prisma/client';
import { prisma } from '@/lib/db/client';

export class CameraRepository extends PrismaRepository<Camera, SafeAny, SafeAny> {
  constructor() {
    super(prisma.camera, 'camera');
  }
}

export const cameraRepository = new CameraRepository();
