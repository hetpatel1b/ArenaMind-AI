// eslint-disable-next-line no-restricted-imports
import { IBaseRepository } from '@/lib/repositories/base.repository';
// eslint-disable-next-line no-restricted-imports
import { Incident } from '@prisma/client';

export interface IIncidentRepository extends IBaseRepository<Incident, any, any> {
  // Add incident-specific repository methods here
  createIncidentWithAction(
    matchId: string,
    stadiumId: string,
    userId: string,
    payload: any
  ): Promise<Incident>;

  updateIncidentWithAction(incidentId: string, userId: string, payload: any): Promise<Incident>;
}
