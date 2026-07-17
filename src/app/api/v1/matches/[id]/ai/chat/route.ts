import { createRouteHandler } from '@/lib/api/route-factory';
import { NextResponse } from 'next/server';
import { aiGatewayService } from '@/lib/enterprise/ai/gateway.service';
import { z } from 'zod';

const chatSchema = z.object({
  message: z.string(),
  history: z
    .array(
      z.object({
        role: z.enum(['user', 'model', 'assistant', 'system']),
        parts: z.array(z.object({ text: z.string() })),
      })
    )
    .optional(),
});

export const POST = createRouteHandler(
  async (req, { params, bizContext }) => {
    const matchId = params?.id;
    if (!matchId) throw new Error('Missing match ID');

    const body = await req.json();
    const { message, history } = chatSchema.parse(body);

    const responseText = await aiGatewayService.chat(bizContext, matchId, message, history || []);

    return NextResponse.json({ data: { response: responseText } });
  },
  { requireAuth: true }
);
