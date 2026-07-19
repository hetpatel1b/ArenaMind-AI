import { NextResponse } from 'next/server';
import { MatchService } from '@/server/services/match.service';
import { createRouteHandler } from '@/lib/api/route-factory';
import { createMatchSchema } from '@/server/validators/match.schema';

export const GET = createRouteHandler(async (req, { bizContext }) => {
  const { venueId: organizationId } = bizContext;
  if (!organizationId) {
    return NextResponse.json({ error: 'No organization linked' }, { status: 400 });
  }

  const matches = await MatchService.getMatchesByOrganization(organizationId);
  return NextResponse.json(matches);
});

export const POST = createRouteHandler(async (req, { bizContext }) => {
  const { venueId: organizationId, userId } = bizContext;
  if (!organizationId) {
    return NextResponse.json({ error: 'No organization linked' }, { status: 400 });
  }

  const body = await req.json();
  const data = createMatchSchema.parse({ ...body, organizationId });
  const match = await MatchService.createMatch(data, userId as string);
  return NextResponse.json(match, { status: 201 });
});
