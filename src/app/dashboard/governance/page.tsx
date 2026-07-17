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

  const organizationId = session.organizationId;

  // Bypass Enum bug for match
  const activeMatchIds = await prisma.$queryRaw<Array<{ id: string }>>`
    SELECT id FROM matches 
    WHERE organization_id = ${organizationId}::uuid 
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
  const [match, venue, users] = await Promise.all([
    prisma.match.findUnique({
      where: { id: activeMatchIds[0]!.id },
      include: {
        aiRecommendations: {
          take: 5,
          orderBy: { createdAt: 'desc' },
        },
      },
    }),
    prisma.venue.findFirst({
      where: { organizationId: session.organizationId as string },
      include: { zones: true },
    }),
    prisma.user.findMany({
      where: {
        organizationId: session.organizationId,
      },
      select: {
        id: true,
        name: true,
        role: true,
        isActive: true,
        lastLoginAt: true,
      },
    }),
  ]);

  if (!match || !venue) {
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
    venue: venue.name,
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
