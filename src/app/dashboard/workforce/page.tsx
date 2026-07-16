import { getServerSession } from '@/lib/auth/server-session';
import { redirect } from 'next/navigation';
import { WorkforceWorkspace } from '@/app/components/workforce/foundation/WorkforceWorkspace';

export const dynamic = 'force-dynamic';

export default async function WorkforceCommandPage() {
  const session = await getServerSession();

  if (!session) {
    redirect('/unauthorized');
  }

  // Phase 13 Workforce Foundation
  // We temporarily bypass database fetching as backend will be in Phase 13 Sprint 2.
  return <WorkforceWorkspace />;
}
