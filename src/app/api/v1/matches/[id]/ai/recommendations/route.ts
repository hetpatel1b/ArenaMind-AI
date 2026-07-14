import { createRouteHandler } from '@/lib/api/route-factory';
import { NextResponse } from 'next/server';
import { aiService } from '@/lib/modules/ai/service';
import { AIFeature } from '@prisma/client';

export const GET = createRouteHandler(
  async (req, { params, bizContext }) => {
    const matchId = params?.id;
    if (!matchId) throw new Error('Missing match ID');

    const feature = req.nextUrl.searchParams.get('feature') as AIFeature | undefined;

    const recommendations = await aiService.getLatestRecommendations(bizContext, matchId, feature);

    return NextResponse.json({ data: recommendations });
  },
  { requireAuth: true }
);
