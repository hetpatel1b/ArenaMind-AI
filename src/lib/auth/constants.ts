export class AuthError extends Error {
  constructor(
    message: string,
    public statusCode: number = 401
  ) {
    super(message);
    this.name = 'AuthError';
  }
}

export class AuthorizationError extends Error {
  constructor(message: string = 'Forbidden: Insufficient privileges') {
    super(message);
    this.name = 'AuthorizationError';
  }
}
