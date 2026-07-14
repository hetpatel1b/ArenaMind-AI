import { createRouteHandler } from '@/lib/api/route-factory';
import { NextResponse } from 'next/server';
import { aiService } from '@/lib/modules/ai/service';
import { z } from 'zod';
import { AIFeature } from '@prisma/client';

const generateSchema = z.object({
  feature: z.nativeEnum(AIFeature),
});

export const POST = createRouteHandler(
  async (req, { params, bizContext }) => {
    const matchId = params?.id;
    if (!matchId) throw new Error('Missing match ID');

    const body = await req.json();
    const { feature } = generateSchema.parse(body);

    const recommendation = await aiService.generateRecommendation(bizContext, matchId, feature);

    return NextResponse.json({ data: recommendation });
  },
  { requireAuth: true }
);
