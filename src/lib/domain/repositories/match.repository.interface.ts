// eslint-disable-next-line no-restricted-imports
import { IBaseRepository } from '@/lib/repositories/base.repository';
// eslint-disable-next-line no-restricted-imports
import { Match } from '@prisma/client';

export type IMatchRepository = IBaseRepository<Match, unknown, unknown>;
