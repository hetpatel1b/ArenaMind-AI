import { getServerSession } from '@/lib/auth/server-session';
import { prisma } from '@/lib/db/client';
import { redirect } from 'next/navigation';
import { MobilityCommandWorkspace } from '@/app/components/mobility/MobilityCommandWorkspace';

export const dynamic = 'force-dynamic';

export default async function MobilityCommandPage() {
  const session = await getServerSession();

  if (!session) {
    redirect('/unauthorized');
  }

  const stadiumId = session.stadiumId;

  // Fetch active match with mobility-focused payload
  const match = await prisma.match.findFirst({
    where: {
      stadiumId,
      matchStatus: 'active',
    },
    include: {
      phaseTransitions: {
        orderBy: { timestamp: 'desc' },
      },
      stadium: {
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

  const isEgress = match.currentPhase === 'crowd_exit';

  // Try to load external mobility telemetry from SystemSettings
  const telemetrySetting = match.stadium?.systemSettings?.find(
    (s) => s.key === 'mobility_telemetry'
  );

  let mobilityState;

  if (telemetrySetting && telemetrySetting.value) {
    // Cast from JSON
    mobilityState = telemetrySetting.value as any;
  } else {
    // Fallback to synthesizing based on active match data instead of hardcoded mock
    mobilityState = {
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
        activeRequests: match.accessibilityRequests?.length || 0, // Fallback if accessibility is not joined
        shuttleAvailability: isEgress ? 10 : 100, // percentage
      },
    };
  }

  return <MobilityCommandWorkspace matchData={match as any} mobilityState={mobilityState} />;
}
