import { getServerSession } from '@/lib/auth/server-session';
import { prisma } from '@/lib/db/client';
import { redirect } from 'next/navigation';
import { CrowdIntelligenceWorkspace } from '@/app/components/crowd/CrowdIntelligenceWorkspace';

export const dynamic = 'force-dynamic';

export default async function CrowdIntelligencePage() {
  const session = await getServerSession();

  if (!session) {
    redirect('/unauthorized');
  }

  const organizationId = session.organizationId;

  // We find the active match for this venue and deeply fetch crowd data
  const activeMatchIds = await prisma.$queryRaw<Array<{ id: string }>>`
    SELECT id FROM matches 
    WHERE organization_id = ${organizationId}::uuid 
    AND match_status::text = 'active'
    LIMIT 1
  `;

  if (!activeMatchIds || activeMatchIds.length === 0 || !activeMatchIds[0]) {
    return (
      <div style={{ padding: '2rem', color: 'var(--text-primary)' }}>
        <h1>No Active Match Found</h1>
        <p>Please ensure your Demo Operator Workspace has been fully provisioned.</p>
      </div>
    );
  }

  const match = await prisma.match.findUnique({
    where: {
      id: activeMatchIds[0]!.id,
    },
    include: {
      venue: {
        include: {
          zones: {
            include: {
              crowdSnapshots: {
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
      matchData={JSON.parse(JSON.stringify(match)) as any} // Typing appropriately in the client component
    />
  );
}
