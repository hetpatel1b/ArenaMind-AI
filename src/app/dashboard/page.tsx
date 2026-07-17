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

  const organizationId = (session.user as any).organizationId;

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

  return (
    <DashboardClient
      initialMatchData={JSON.parse(JSON.stringify(match)) as any}
      organizationId={organizationId}
    />
  );
}
