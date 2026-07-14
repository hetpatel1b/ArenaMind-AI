import { createRouteHandler } from '@/lib/api/route-factory';
import { NextResponse } from 'next/server';
import { aiService } from '@/lib/modules/ai/service';
import { z } from 'zod';
import { ActionTaken } from '@prisma/client';

const actionSchema = z.object({
  action: z.nativeEnum(ActionTaken),
  rating: z.number().optional(),
  reason: z.string().optional(),
});

export const POST = createRouteHandler(
  async (req, { params, bizContext }) => {
    const recId = params?.recId;
    if (!recId) throw new Error('Missing recommendation ID');

    const body = await req.json();
    const { action, rating, reason } = actionSchema.parse(body);

    const result = await aiService.recordFeedback(bizContext, recId, action, rating, reason);

    return NextResponse.json({ data: result });
  },
  { requireAuth: true }
);
