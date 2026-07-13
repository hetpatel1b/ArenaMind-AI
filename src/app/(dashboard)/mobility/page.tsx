import { getServerSession } from '@/lib/auth/server-session';
import { prisma } from '@/lib/db/client';
import { redirect } from 'next/navigation';
import { MobilityCommandWorkspace } from '@/app/components/mobility/MobilityCommandWorkspace';

export const dynamic = 'force-dynamic';

export default async function MobilityCommandPage() {
  const session = await getServerSession();

  if (!session) {
    redirect('/login');
  }

  const stadiumId = session.stadiumId;

  // Fetch active match with mobility-focused payload
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
      aiRecommendations: {
        where: {
          featureName: 'mobility_suggestions', // Hypothetical feature flag for mobility
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

  // Construct a deterministic mock mobility state based on the match phase
  const isEgress = match.currentPhase === 'egress';
  const mobilityState = {
    metro: {
      status: isEgress ? 'congested' : 'nominal',
      capacity: isEgress ? 95 : 40,
      delay: isEgress ? 15 : 0,
    },
    shuttles: {
      status: isEgress ? 'rerouted' : 'nominal',
      capacity: isEgress ? 80 : 30,
      delay: isEgress ? 5 : 0,
    },
    parking: {
      status: isEgress ? 'emptying' : 'full',
      occupancy: isEgress ? 60 : 98,
      overflowActive: !isEgress,
    },
    accessibility: {
      status: 'active',
      activeRequests: isEgress ? 24 : 5,
      shuttleAvailability: isEgress ? 10 : 100, // percentage
    },
  };

  return <MobilityCommandWorkspace matchData={match as any} mobilityState={mobilityState} />;
}
