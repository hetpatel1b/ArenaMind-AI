import { getServerSession } from '@/lib/auth/server-session';
import { prisma } from '@/lib/db/client';
import { redirect } from 'next/navigation';
import { IncidentCommandWorkspace } from '@/app/components/incidents/IncidentCommandWorkspace';

export const dynamic = 'force-dynamic';

export default async function IncidentCommandPage() {
  const session = await getServerSession();

  if (!session) {
    redirect('/unauthorized');
  }

  const stadiumId = session.stadiumId;

  // Fetch the active match with deep relations for incidents and resources
  const activeMatchIds = await prisma.$queryRaw<Array<{ id: string }>>`
    SELECT id FROM matches 
    WHERE stadium_id = ${stadiumId}::uuid 
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
      stadium: {
        include: {
          zones: true,
        },
      },
      incidents: {
        include: {
          incidentType: true,
          zone: true,
          assignee: true,
        },
        orderBy: [
          { severityTier: 'asc' }, // 1 is highest severity
          { createdAt: 'desc' },
        ],
      },
      resources: {
        include: {
          zone: true,
        },
      },
      aiRecommendations: {
        where: {
          featureName: 'incident_resolution',
        },
        orderBy: { confidenceScore: 'desc' },
      },
      phaseTransitions: {
        orderBy: { timestamp: 'desc' },
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
    <IncidentCommandWorkspace
      matchData={JSON.parse(JSON.stringify(match)) as any} // Typing appropriately in the client component
    />
  );
}
