import { getServerSession } from '@/lib/auth/server-session';
import { prisma } from '@/lib/db/client';
import { redirect } from 'next/navigation';
import { IntelligenceWorkspace } from '@/app/components/intelligence/foundation/IntelligenceWorkspace';

export const dynamic = 'force-dynamic';

export default async function IntelligenceCommandPage() {
  const session = await getServerSession();

  if (!session) {
    redirect('/unauthorized');
  }

  const organizationId = session.organizationId as string;

  // Fetch match with extensive historical includes
  const match = await prisma.match.findFirst({
    where: {
      organizationId,
      matchStatus: 'active',
    },
    include: {
      venue: true,
      incidents: {
        orderBy: { createdAt: 'desc' },
      },
      phaseTransitions: {
        orderBy: { timestamp: 'asc' },
      },
      aiRecommendations: {
        orderBy: { confidenceScore: 'desc' },
      },
      kpiSnapshots: {
        orderBy: { capturedAt: 'asc' },
      },
      resources: true,
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

  return <IntelligenceWorkspace />;
}
