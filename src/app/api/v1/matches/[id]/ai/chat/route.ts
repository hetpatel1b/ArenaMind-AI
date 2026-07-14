import { createRouteHandler } from '@/lib/api/route-factory';
import { NextResponse } from 'next/server';
import { aiContextBuilder } from '@/lib/modules/ai/context-builder';
import { geminiModel } from '@/lib/ai/gemini';
import { z } from 'zod';

const chatSchema = z.object({
  message: z.string(),
  history: z
    .array(
      z.object({
        role: z.enum(['user', 'model']),
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

    const contextData = await aiContextBuilder.buildMatchContext(bizContext, matchId);

    const systemPrompt = `You are the ArenaMind AI Principal Operations Assistant.
Context: ${JSON.stringify(contextData)}
Answer the user's questions strictly based on this context. Be concise and precise.`;

    const chatSession = geminiModel.startChat({
      systemInstruction: systemPrompt,
      history: history || [],
    });

    const result = await chatSession.sendMessage(message);
    const responseText = result.response.text();

    return NextResponse.json({ data: { response: responseText } });
  },
  { requireAuth: true }
);
