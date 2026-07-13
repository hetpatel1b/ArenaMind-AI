export const Roles = {
  OPERATIONS_MANAGER: 'operations_manager',
  DEPUTY_MANAGER: 'deputy_manager',
  COORDINATOR: 'coordinator',
  SYSTEM_ADMIN: 'system_admin',
} as const;

export type Role = (typeof Roles)[keyof typeof Roles];

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
