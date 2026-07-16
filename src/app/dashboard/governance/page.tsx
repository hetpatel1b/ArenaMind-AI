import { getServerSession } from '@/lib/auth/server-session';
import { prisma } from '@/lib/db/client';
import { redirect } from 'next/navigation';
import GovernanceWorkspace from '@/app/components/governance/foundation/GovernanceWorkspace';

export const dynamic = 'force-dynamic';

export default async function GovernanceCommandPage() {
  const session = await getServerSession();

  if (!session) {
    redirect('/unauthorized');
  }

  const stadiumId = session.stadiumId;

  // Bypass Enum bug for match
  const activeMatchIds = await prisma.$queryRaw<Array<{ id: string }>>`
    SELECT id FROM matches 
    WHERE stadium_id = ${stadiumId}::uuid 
    AND match_status::text = 'active'
    LIMIT 1
  `;

  if (!activeMatchIds || activeMatchIds.length === 0 || !activeMatchIds[0]) {
    return (
      <div style={{ padding: '2rem', color: 'var(--text-primary)' }}>
        <h1>System Uninitialized</h1>
        <p>Please ensure your ArenaMind AI Demo Environment is fully provisioned.</p>
      </div>
    );
  }

  // Fetch critical platform configuration and active state
  const [match, stadium, users] = await Promise.all([
    prisma.match.findUnique({
      where: { id: activeMatchIds[0]!.id },
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
    operationalHealth: match.currentPhase === 'crowd_exit' ? 82 : 94,
    recommendedAction: 'Rotate API Keys for Edge Sensors',
    policies: {
      confidenceThreshold: 0.85,
      recommendationThreshold: 0.7,
      promptVersion: 'sys_ops_v12',
      humanApproval: 'MANDATORY',
      aiSafety: 'NEVER EXECUTE',
    },
  };

  return <GovernanceWorkspace />;
}
