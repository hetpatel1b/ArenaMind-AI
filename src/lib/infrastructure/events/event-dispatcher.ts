import { LoggerService } from '@/lib/platform/observability/LoggerService';
type EventHandler<T = unknown> = (payload: T) => Promise<void> | void;

export class EventDispatcher {
  private handlers: Map<string, EventHandler[]> = new Map();

  subscribe<T>(eventName: string, handler: EventHandler<T>): void {
    const current = this.handlers.get(eventName) || [];
    this.handlers.set(eventName, [...current, handler as unknown as EventHandler<SafeAny>]);
  }

  async publish<T>(eventName: string, payload: T): Promise<void> {
    const eventHandlers = this.handlers.get(eventName);
    if (!eventHandlers) return;

    // Execute all handlers concurrently without blocking the main thread execution pipeline
    Promise.allSettled(eventHandlers.map((handler) => handler(payload))).catch((err) => {
      LoggerService.error(`Error in event handler for ${eventName}:`, err);
    });
  }
}

export const eventDispatcher = new EventDispatcher();
