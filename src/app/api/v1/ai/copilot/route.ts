import { NextRequest } from 'next/server';
import { auth } from '@/server/auth/auth';
import { aiGatewayService } from '@/lib/enterprise/ai/gateway.service';
import { BusinessContext } from '@/lib/services/business.context';

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const body = await req.json();
    const { message, moduleFeature, contextData, matchId = 'system-default-match' } = body;

    if (!moduleFeature) {
      return new Response(JSON.stringify({ error: 'moduleFeature is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const ctx: BusinessContext = {
      userId: session.user.id,
      organizationId: (session.user as any).organizationId || 'default-org',
      role: session.user.role || 'operator',
      correlationId: `copilot-${Date.now()}`,
      venueId: 'default-venue',
    };

    // We will use Server-Sent Events (SSE) to stream progress and the final result.
    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        const sendEvent = (event: string, data: any) => {
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
        } catch (error: any) {
          console.error('Copilot API Error:', error);
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
  } catch (error: any) {
    console.error('API Route Error:', error);
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
