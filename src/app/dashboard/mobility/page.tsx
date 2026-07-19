import { getServerSession } from '@/lib/auth/server-session';
import { prisma } from '@/lib/db/client';
import { redirect } from 'next/navigation';
import { MobilityWorkspace } from '@/app/components/mobility/foundation';

export const dynamic = 'force-dynamic';

export default async function MobilityCommandPage() {
  const session = await getServerSession();

  if (!session) {
    redirect('/unauthorized');
  }

  const organizationId = session.organizationId as string;

  // Fetch active match with mobility-focused payload
  const match = await prisma.match.findFirst({
    where: {
      organizationId,
      matchStatus: 'active',
    },
    include: {
      phaseTransitions: {
        orderBy: { timestamp: 'desc' },
      },
      venue: {
        include: {
          zones: true,
          systemSettings: {
            where: { key: 'mobility_telemetry' },
          },
        },
      },
      aiRecommendations: {
        where: {
          featureName: 'mobility_suggestions',
        },
        orderBy: { confidenceScore: 'desc' },
      },
      queueData: {
        orderBy: { createdAt: 'desc' },
        take: 1,
      },
      accessibilityRequests: true,
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

  return <MobilityWorkspace />;
}
