import { auth } from '@/server/auth/auth';
import { prisma } from '@/server/database/prisma';
import { redirect } from 'next/navigation';
import { DashboardClient } from './DashboardClient';

export const dynamic = 'force-dynamic';

export default async function DashboardPage() {
  const session = await auth();

  if (!session || !session.user) {
    redirect('/login');
  }

  const organizationId = session.user.organizationId;

  if (!organizationId) {
    return (
      <div style={{ padding: '2rem', color: 'var(--text-primary)' }}>
        <h1>No Organization Linked</h1>
        <p>Your account is not linked to any organization.</p>
      </div>
    );
  }

  // Fetch the active match for the organization
  const match = await prisma.match.findFirst({
    where: {
      organizationId,
      matchStatus: 'active',
    },
    include: {
      venue: {
        include: {
          zones: {
            include: {
              crowdSnapshots: {
                orderBy: { recordedAt: 'desc' },
                take: 1,
              },
            },
          },
        },
      },
      incidents: {
        include: {
          incidentType: true,
          zone: true,
        },
      },
      aiRecommendations: {
        orderBy: { confidenceScore: 'desc' },
      },
      kpiSnapshots: {
        orderBy: { capturedAt: 'desc' },
        take: 1,
      },
      healthScores: {
        orderBy: { capturedAt: 'desc' },
        take: 1,
      },
      resources: {
        include: {
          resourceType: true,
          zone: true,
        },
      },
    },
  });

  if (!match) {
    return (
      <div style={{ padding: '2rem', color: 'var(--text-primary)' }}>
        <h1>No Active Match Found</h1>
        <p>Please ensure a match is set to active in your organization.</p>
      </div>
    );
  }
  // Recursive function to convert all Dates to ISO strings and Decimals to numbers
  const serializeData = <T,>(obj: T): any => {
    if (obj === null || obj === undefined) return obj;
    if (obj instanceof Date) return obj.toISOString();

    // Check for Prisma Decimal
    if (
      typeof obj === 'object' &&
      'toNumber' in obj &&
      typeof (obj as { toNumber?: unknown }).toNumber === 'function' &&
      'd' in obj &&
      'e' in obj &&
      's' in obj
    ) {
      return (obj as { toNumber: () => number }).toNumber();
    }
    if (Array.isArray(obj)) return obj.map((item) => serializeData(item));
    if (typeof obj === 'object') {
      const res: any = {};
      for (const key of Object.keys(obj)) {
        res[key] = serializeData((obj as Record<string, unknown>)[key]);
      }
      return res;
    }
    return obj;
    return obj;
  };

  const serializedMatch = serializeData(match);

  return <DashboardClient initialMatchData={serializedMatch} organizationId={organizationId} />;
}
