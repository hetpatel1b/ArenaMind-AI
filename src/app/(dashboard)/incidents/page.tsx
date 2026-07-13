import { getServerSession } from '@/lib/auth/server-session';
import { prisma } from '@/lib/db/client';
import { redirect } from 'next/navigation';
import { IncidentCommandWorkspace } from '@/app/components/incidents/IncidentCommandWorkspace';

export const dynamic = 'force-dynamic';

export default async function IncidentCommandPage() {
  const session = await getServerSession();

  if (!session) {
    redirect('/login');
  }

  const stadiumId = session.stadiumId;

  // Fetch the active match with deep relations for incidents and resources
  const match = await prisma.match.findFirst({
    where: {
      stadiumId,
      matchStatus: 'active',
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
      matchData={match as any} // Typing appropriately in the client component
    />
  );
}
