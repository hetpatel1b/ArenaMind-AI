import { PrismaRepository } from '@/lib/repositories/prisma.repository';
import { Incident } from '@prisma/client';
import { prisma } from '@/lib/db/client';

export class IncidentRepository extends PrismaRepository<Incident, any, any> {
  constructor() {
    super(prisma.incident as any);
  }
}

export const incidentRepository = new IncidentRepository();
