import { getServerSession } from '@/lib/auth/server-session';
import { prisma } from '@/lib/db/client';
import { redirect } from 'next/navigation';
import { CommandCenterDashboard } from '@/app/components/dashboard/CommandCenterDashboard';

export const dynamic = 'force-dynamic';

export default async function DashboardPage() {
  const session = await getServerSession();

  if (!session) {
    redirect('/unauthorized');
  }

  // Fetch all core operational data for the active match based on the user's stadium
  const stadiumId = session.stadiumId;

  // By casting the column to text, we avoid ALL Postgres type-mismatch errors
  // regardless of whether the DB column is currently an enum or text!
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

  // Now fetch all the nested relational data using the UUID, which Prisma handles perfectly
  const match = await prisma.match.findUnique({
    where: {
      id: activeMatchIds[0]!.id,
    },
    include: {
      stadium: {
        include: {
          zones: {
            include: {
              crowdData: {
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
    // If no active match is found, perhaps the demo provisioning failed or hasn't run.
    // In a real app, we'd show an empty state, but for ArenaMind AI we can redirect to a setup page.
    return (
      <div style={{ padding: '2rem', color: 'var(--text-primary)' }}>
        <h1>No Active Match Found</h1>
        <p>Please ensure your Demo Operator Workspace has been fully provisioned.</p>
      </div>
    );
  }

  return (
    <CommandCenterDashboard
      matchData={JSON.parse(JSON.stringify(match)) as any} // Typing appropriately in the client component
    />
  );
}
