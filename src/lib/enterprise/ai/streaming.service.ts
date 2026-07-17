import { EventEmitter } from 'events';

export interface StreamEvent {
  type: 'token' | 'error' | 'end' | 'reconnect' | 'interrupted';
  payload?: any;
}

export class StreamingService extends EventEmitter {
  // Future-ready for WebSockets or SSE
  // Currently abstracting the stream implementation so the frontend contract is untouched

  public stream(
    providerStream: AsyncIterable<any>,
    cancellationToken?: AbortSignal
  ): AsyncIterable<string> {
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const emitter = this;

    return {
      async *[Symbol.asyncIterator]() {
        try {
          for await (const chunk of providerStream) {
            if (cancellationToken?.aborted) {
              emitter.emit('event', { type: 'interrupted', payload: 'Client aborted stream' });
              break;
            }

            // Abstract token parsing (would adapt based on provider: grok vs gemini)
            const token =
              chunk?.choices?.[0]?.delta?.content ||
              chunk?.candidates?.[0]?.content?.parts?.[0]?.text ||
              '';

            if (token) {
              emitter.emit('event', { type: 'token', payload: token });
              yield token;
            }
          }
          emitter.emit('event', { type: 'end' });
        } catch (error) {
          // Reconnect logic placeholder
          if (error instanceof Error && error.message.includes('network')) {
            emitter.emit('event', { type: 'reconnect', payload: 'Attempting reconnect...' });
            // In a real implementation, we'd resume the stream from last state
          }
          emitter.emit('event', { type: 'error', payload: error });
          throw error;
        }
      },
    };
  }

  // Helper for Gateway to optionally consume streams internally and return a rigid JSON payload
  public async consumeStreamToString(stream: AsyncIterable<string>): Promise<string> {
    let fullText = '';
    for await (const token of stream) {
      fullText += token;
    }
    return fullText;
  }
}

export const aiStreamingService = new StreamingService();
