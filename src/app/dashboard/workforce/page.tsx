import { getServerSession } from '@/lib/auth/server-session';
import { prisma } from '@/lib/db/client';
import { redirect } from 'next/navigation';
import { WorkforceCommandWorkspace } from '@/app/components/workforce/WorkforceCommandWorkspace';

export const dynamic = 'force-dynamic';

export default async function WorkforceCommandPage() {
  const session = await getServerSession();

  if (!session) {
    redirect('/unauthorized');
  }

  const stadiumId = session.stadiumId;

  // Fetch active match with workforce-focused payload
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
      resources: {
        include: {
          resourceType: true,
          zone: true,
        },
      },
      aiRecommendations: {
        where: {
          featureName: 'resource_suggestions',
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
    <WorkforceCommandWorkspace
      matchData={JSON.parse(JSON.stringify(match)) as any} // Typing appropriately in the client component
    />
  );
}
