import { createRouteHandler } from '@/lib/api/route-factory';
import { aiGatewayService } from '@/lib/enterprise/ai/gateway.service';
import { LoggerService } from '@/lib/platform/observability/LoggerService';

export const POST = createRouteHandler(async (req, { bizContext: ctx }) => {
  const body = await req.json();
  const { message, moduleFeature, contextData, matchId = 'system-default-match' } = body;

  if (!moduleFeature) {
    return new Response(JSON.stringify({ error: 'moduleFeature is required' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  // We will use Server-Sent Events (SSE) to stream progress and the final result.
  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    async start(controller) {
      const sendEvent = (event: string, data: SafeAny) => {
        controller.enqueue(encoder.encode(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`));
      };

      try {
        // Send initial progress
        sendEvent('progress', { step: 'Initializing AI Gateway...' });

        // Execute the actual AI Feature, passing real-time progress callback
        const result = await aiGatewayService.executeFeature(
          ctx,
          matchId,
          moduleFeature,
          message || undefined,
          (step: string) => sendEvent('progress', { step })
        );

        // Send final response
        sendEvent('complete', { result });
        controller.close();
      } catch (error: SafeAny) {
        LoggerService.error('Copilot API Error:', error);
        sendEvent('error', {
          message: error.message || 'An error occurred during AI processing.',
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
