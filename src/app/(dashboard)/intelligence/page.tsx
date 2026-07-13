import { getServerSession } from '@/lib/auth/server-session';
import { prisma } from '@/lib/db/client';
import { redirect } from 'next/navigation';
import { IntelligenceCommandWorkspace } from '@/app/components/intelligence/IntelligenceCommandWorkspace';

export const dynamic = 'force-dynamic';

export default async function IntelligenceCommandPage() {
  const session = await getServerSession();

  if (!session) {
    redirect('/login');
  }

  const stadiumId = session.stadiumId;

  // Fetch match with extensive historical includes
  const match = await prisma.match.findFirst({
    where: {
      stadiumId,
      matchStatus: 'active',
    },
    include: {
      stadium: true,
      incidents: {
        orderBy: { createdAt: 'desc' },
      },
      phaseTransitions: {
        orderBy: { timestamp: 'asc' },
      },
      aiRecommendations: {
        orderBy: { confidenceScore: 'desc' },
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

  // Construct the aggregated reporting payload
  const reportingPayload = {
    attendance: 78500,
    operationalHealth: match.currentPhase === 'egress' ? 82 : 94,
    incidentSummary: {
      total: match.incidents.length,
      resolved: match.incidents.filter((i) => i.status === 'resolved').length,
      avgResponseTime: '3m 12s',
    },
    crowdFlow: match.currentPhase === 'egress' ? 'High Volume' : 'Nominal',
    transportStatus: match.currentPhase === 'egress' ? 'Severe Congestion' : 'Nominal',
    kpis: {
      responseEfficiency: 92,
      crowdEfficiency: 88,
      transportEfficiency: match.currentPhase === 'egress' ? 74 : 95,
      workforceUtilization: 85,
      accessibilityScore: 98,
      aiAcceptance: 100,
    },
  };

  return (
    <IntelligenceCommandWorkspace matchData={match as any} reportingPayload={reportingPayload} />
  );
}
