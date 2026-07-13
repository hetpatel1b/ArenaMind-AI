import { logger } from './logger';

export class Span {
  private startTime: number;
  private endTime?: number;

  constructor(
    public readonly name: string,
    public readonly traceId: string,
    public readonly spanId: string,
    private tags: Record<string, any> = {}
  ) {
    this.startTime = Date.now();
    logger.debug(`Span started: ${name}`, { traceId, spanId, ...tags });
  }

  end() {
    this.endTime = Date.now();
    const durationMs = this.endTime - this.startTime;
    logger.debug(`Span ended: ${this.name}`, {
      traceId: this.traceId,
      spanId: this.spanId,
      durationMs,
      ...this.tags,
    });
  }

  addTag(key: string, value: any) {
    this.tags[key] = value;
  }
}

export class Tracer {
  startSpan(name: string, traceId?: string): Span {
    const activeTraceId = traceId || crypto.randomUUID();
    const spanId = crypto.randomUUID();
    return new Span(name, activeTraceId, spanId);
  }
}

export const tracer = new Tracer();
