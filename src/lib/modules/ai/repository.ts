import { PrismaRepository } from '@/lib/repositories/prisma.repository';
import { AiRecommendation, AiCallLog, AiFeedback, Prisma } from '@prisma/client';
import { prisma } from '@/lib/db/client';

export class AiRecommendationRepository extends PrismaRepository<
  AiRecommendation,
  Prisma.AiRecommendationCreateInput,
  Prisma.AiRecommendationUpdateInput
> {
  constructor() {
    super(prisma.aiRecommendation, 'aiRecommendation');
  }
}

export class AiCallLogRepository extends PrismaRepository<
  AiCallLog,
  Prisma.AiCallLogCreateInput,
  Prisma.AiCallLogUpdateInput
> {
  constructor() {
    super(prisma.aiCallLog, 'aiCallLog');
  }
}

export class AiFeedbackRepository extends PrismaRepository<
  AiFeedback,
  Prisma.AiFeedbackCreateInput,
  Prisma.AiFeedbackUpdateInput
> {
  constructor() {
    super(prisma.aiFeedback, 'aiFeedback');
  }
}

export const aiRecommendationRepository = new AiRecommendationRepository();
export const aiCallLogRepository = new AiCallLogRepository();
export const aiFeedbackRepository = new AiFeedbackRepository();
