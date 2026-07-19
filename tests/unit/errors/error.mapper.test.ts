import { describe, it, expect } from 'vitest';
import { mapErrorToResponse } from '@/lib/errors/error.mapper';
import { ApplicationError } from '@/lib/errors/app.error';

describe('error.mapper', () => {
  it('maps ApplicationError', () => {
    const err = new ApplicationError('Test', 400, 'TEST');
    const res = mapErrorToResponse(err);
    expect(res.status).toBe(400);
  });

  it('maps generic Error to 500', () => {
    const err = new Error('Generic');
    const res = mapErrorToResponse(err);
    expect(res.status).toBe(500);
  });
});