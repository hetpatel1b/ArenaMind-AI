import { getServerSession } from '@/lib/auth/server-session';
import { prisma } from '@/lib/db/client';
import { redirect } from 'next/navigation';
import { CommandCenterDashboard } from '@/app/components/dashboard/CommandCenterDashboard';

export const dynamic = 'force-dynamic';

export default async function DashboardPage() {
  const session = await getServerSession();

  if (!session) {
    redirect('/login');
  }

  // Fetch all core operational data for the active match based on the user's stadium
  const stadiumId = session.stadiumId;

  // We find the active match for this stadium
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
      matchData={match as any} // Typing appropriately in the client component
    />
  );
}
