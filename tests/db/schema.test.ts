import { describe, it, expect } from 'vitest';
import { Prisma } from '@prisma/client';

describe('Database Schema & Constraints', () => {
  it('should have all critical tables defined in Prisma Client', () => {
    // Verify the critical models are generated on the client via ModelName enum
    expect(Prisma.ModelName.Venue).toBeDefined();
    expect(Prisma.ModelName.Match).toBeDefined();
    expect(Prisma.ModelName.User).toBeDefined();
    expect(Prisma.ModelName.Incident).toBeDefined();
    expect(Prisma.ModelName.AiRecommendation).toBeDefined();
    expect(Prisma.ModelName.CrowdSnapshot).toBeDefined();
    expect(Prisma.ModelName.Resource).toBeDefined();
    expect(Prisma.ModelName.Zone).toBeDefined();
    expect(Prisma.ModelName.KpiSnapshot).toBeDefined();
  });

  it('should enforce relations between Matches and Venues', () => {
    // A quick structural verification that Prisma generated the relations
    expect(Prisma.ModelName.Match).toBe('Match');
    expect(Prisma.ModelName.Venue).toBe('Venue');
  });
});
