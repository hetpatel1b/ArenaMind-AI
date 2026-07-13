/**
 * Base interface for all domain events.
 * Enables the publisher-subscriber pattern for decoupled side-effects.
 */
export interface IDomainEvent {
  /** Unique identifier for the event instance */
  readonly id: string;

  /** Timestamp when the event occurred */
  readonly occurredAt: Date;

  /** Name of the event (e.g., 'IncidentCreated') */
  readonly eventName: string;

  /** The aggregate or entity ID this event relates to */
  readonly aggregateId: string;

  /** The ID of the stadium this event belongs to (for multi-tenant isolation) */
  readonly stadiumId: string;
}

/**
 * Abstract base class for domain events.
 */
export abstract class BaseDomainEvent implements IDomainEvent {
  public readonly id: string;
  public readonly occurredAt: Date;

  constructor(
    public readonly eventName: string,
    public readonly aggregateId: string,
    public readonly stadiumId: string
  ) {
    this.id = crypto.randomUUID();
    this.occurredAt = new Date();
  }
}
