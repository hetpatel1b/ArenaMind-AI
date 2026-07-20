import { createRouteHandler } from '@/lib/api/route-factory';
import { aiGatewayService } from '@/lib/enterprise/ai/gateway.service';
import { LoggerService } from '@/lib/platform/observability/LoggerService';
import { organizationResolver } from '@/lib/services/organization-resolver';
import { z } from 'zod';

const CopilotRequestBodySchema = z.object({
  message: z.string().optional(),
  moduleFeature: z.string().min(1, 'moduleFeature is required'),
  contextData: z.unknown().optional(),
  matchId: z.string().optional().default('system-default-match'),
});

export const POST = createRouteHandler(async (req, { bizContext: ctx }) => {
  let body: unknown;
  try {
    body = await req.json();
  } catch (err) {
    return new Response(JSON.stringify({ error: 'Invalid JSON payload' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const parseResult = CopilotRequestBodySchema.safeParse(body);
  if (!parseResult.success) {
    return new Response(
      JSON.stringify({
        error: 'Validation failed',
        details: parseResult.error.flatten(),
      }),
      {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }

  const { message, moduleFeature, matchId } = parseResult.data;

  // Resolve business context organization ID to a valid PostgreSQL UUID
  ctx.organizationId = await organizationResolver.resolveOrganizationId(ctx.organizationId);

  // We will use Server-Sent Events (SSE) to stream progress and the final result.
  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    async start(controller) {
      const sendEvent = (event: string, data: SafeAny) => {
        try {
          controller.enqueue(encoder.encode(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`));
        } catch (e) {
          // Stream might be closed
        }
      };

      try {
        // Send initial progress
        sendEvent('progress', { step: 'Initializing AI Gateway...' });

        // Execute the actual AI Feature, passing real-time progress callback
        const result = await aiGatewayService.executeFeature(
          ctx,
          matchId,
          moduleFeature as SafeAny,
          message || undefined,
          (step: string) => sendEvent('progress', { step })
        );

        // Send final response
        sendEvent('complete', { result });
        controller.close();
      } catch (error: SafeAny) {
        LoggerService.error('Copilot API Error:', error);
        sendEvent('error', {
          message: 'Unable to process AI Copilot request. Please try again.',
        });
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache, no-transform',
      Connection: 'keep-alive',
    },
  });
});
