/**
 * Base Application Error.
 * All custom business and HTTP errors should extend this class.
 */
export class ApplicationError extends Error {
  public readonly name: string;
  public readonly isOperational: boolean;

  constructor(
    public readonly message: string,
    public readonly statusCode: number = 500,
    public readonly code: string = 'INTERNAL_ERROR',
    public readonly details?: Record<string, unknown>,
    isOperational = true
  ) {
    super(message);

    // Restore prototype chain due to extending Error in TypeScript
    Object.setPrototypeOf(this, new.target.prototype);

    this.name = this.constructor.name;
    this.isOperational = isOperational;

    // Capture stack trace (V8 specific)
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}
