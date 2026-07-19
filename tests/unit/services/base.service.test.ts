import { describe, it, expect } from 'vitest';
import { BaseService } from '@/lib/services/base.service';
import { AuthorizationError } from '@/lib/errors/http.errors';

class TestService extends BaseService {
  constructor() {
    super('TestService');
  }
  public testEnforceIsolation(ctx: any, venueId: string) {
    this.enforceTenantIsolation(ctx, venueId);
  }
}

describe.skip('BaseService', () => {
  it.skip('enforces tenant isolation', () => {
    const svc = new TestService();
    const ctx = { role: 'ADMIN', venueId: 'v1' };
    
    // Global bypass
    expect(() => svc.testEnforceIsolation({ role: 'ADMIN', venueId: 'GLOBAL' }, 'v2')).not.toThrow();
    
    // Match
    expect(() => svc.testEnforceIsolation(ctx, 'v1')).not.toThrow();
    
    // Mismatch
    expect(() => svc.testEnforceIsolation(ctx, 'v2')).toThrow(AuthorizationError);
  });
});