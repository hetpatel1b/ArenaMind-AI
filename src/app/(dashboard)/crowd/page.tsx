import { getServerSession } from '@/lib/auth/server-session';
import { prisma } from '@/lib/db/client';
import { redirect } from 'next/navigation';
import { CrowdIntelligenceWorkspace } from '@/app/components/crowd/CrowdIntelligenceWorkspace';

export const dynamic = 'force-dynamic';

export default async function CrowdIntelligencePage() {
  const session = await getServerSession();

  if (!session) {
    redirect('/login');
  }

  const stadiumId = session.stadiumId;

  // We find the active match for this stadium and deeply fetch crowd data
  const match = await prisma.match.findFirst({
    where: {
      stadiumId,
      matchStatus: 'active',
    },
    include: {
      stadium: {
        include: {
          zones: {
            include: {
              crowdData: {
                orderBy: { recordedAt: 'desc' },
                take: 5, // Get some historical points for trends
              },
            },
          },
        },
      },
      queueData: {
        orderBy: { createdAt: 'desc' },
        take: 10,
      },
      phaseTransitions: {
        orderBy: { timestamp: 'desc' },
      },
      aiRecommendations: {
        where: {
          featureName: 'crowd_recommendations',
        },
        orderBy: { confidenceScore: 'desc' },
      },
      incidents: {
        include: {
          incidentType: true,
          zone: true,
        },
      },
      kpiSnapshots: {
        orderBy: { capturedAt: 'desc' },
        take: 5,
      },
      healthScores: {
        orderBy: { capturedAt: 'desc' },
        take: 1,
      },
    },
  });

  if (!match) {
    return (
      <div style={{ padding: '2rem', color: 'var(--text-primary)' }}>
        <h1>No Active Match Found</h1>
        <p>Please ensure your Demo Operator Workspace has been fully provisioned.</p>
      </div>
    );
  }

  return (
    <CrowdIntelligenceWorkspace
      matchData={match as any} // Typing appropriately in the client component
    />
  );
}
