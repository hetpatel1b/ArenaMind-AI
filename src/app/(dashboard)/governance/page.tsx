import { getServerSession } from '@/lib/auth/server-session';
import { prisma } from '@/lib/db/client';
import { redirect } from 'next/navigation';
import { GovernanceCommandWorkspace } from '@/app/components/governance/GovernanceCommandWorkspace';

export const dynamic = 'force-dynamic';

export default async function GovernanceCommandPage() {
  const session = await getServerSession();

  if (!session) {
    redirect('/unauthorized');
  }

  const stadiumId = session.stadiumId;

  // Fetch critical platform configuration and active state
  const [match, stadium, users] = await Promise.all([
    prisma.match.findFirst({
      where: { stadiumId, matchStatus: 'active' },
      include: {
        aiRecommendations: {
          take: 5,
          orderBy: { createdAt: 'desc' },
        },
      },
    }),
    prisma.stadium.findUnique({
      where: { id: stadiumId },
      include: { zones: true },
    }),
    prisma.user.findMany({
      where: { stadiumId: session.stadiumId },
      select: { id: true, fullName: true, role: true, isActive: true, lastSeenAt: true },
    }),
  ]);

  if (!match || !stadium) {
    return (
      <div style={{ padding: '2rem', color: 'var(--text-primary)' }}>
        <h1>System Uninitialized</h1>
        <p>Please ensure your ArenaMind AI Demo Environment is fully provisioned.</p>
      </div>
    );
  }

  // Construct the governance specific payload
  const governancePayload = {
    environment: 'Production (FIFA World Cup)',
    organization: 'FIFA Operations Group',
    stadium: stadium.name,
    aiProvider: 'Google Gemini Pro 1.5',
    aiVersion: 'v4.2.1-enterprise',
    securityStatus: 'Secure (SOC2 Compliant)',
    lastAudit: new Date().toISOString(),
    operationalHealth: match.currentPhase === 'egress' ? 82 : 94,
    recommendedAction: 'Rotate API Keys for Edge Sensors',
    policies: {
      confidenceThreshold: 0.85,
      recommendationThreshold: 0.7,
      promptVersion: 'sys_ops_v12',
      humanApproval: 'MANDATORY',
      aiSafety: 'NEVER EXECUTE',
    },
  };

  return (
    <GovernanceCommandWorkspace
      matchData={match as any}
      stadiumData={stadium as any}
      users={users}
      governancePayload={governancePayload}
    />
  );
}
