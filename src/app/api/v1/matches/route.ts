import { NextResponse } from 'next/server';
import { GlobalErrorHandler } from '@/lib/platform/errors/GlobalErrorHandler';
import { MatchService } from '@/server/services/match.service';
import { withAuth, AuthenticatedRequest } from '@/server/middleware/rbac';
import { createMatchSchema } from '@/server/validators/match.schema';

export const GET = withAuth(async (req: AuthenticatedRequest) => {
  const { organizationId } = req.user;
  if (!organizationId) {
    return NextResponse.json({ error: 'No organization linked' }, { status: 400 });
  }

  const matches = await MatchService.getMatchesByOrganization(organizationId);
  return NextResponse.json(matches);
});

export const POST = withAuth(async (req: AuthenticatedRequest) => {
  const { organizationId, id: userId } = req.user;
  if (!organizationId) {
    return NextResponse.json({ error: 'No organization linked' }, { status: 400 });
  }

  try {
    const body = await req.json();
    const data = createMatchSchema.parse({ ...body, organizationId });
    const match = await MatchService.createMatch(data, userId);
    return NextResponse.json(match, { status: 201 });
  } catch (error: any) {
    return GlobalErrorHandler.handle(error);
  }
});
