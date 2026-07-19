import { describe, it, expect } from 'vitest';
import { createRouteHandler } from '@/lib/api/route-factory';
import { NextRequest } from 'next/server';

describe('createRouteHandler', () => {
  it('handles unexpected errors gracefully', async () => {
    const handler = createRouteHandler(
      () => {
        throw new Error('Unexpected');
      },
      { requireAuth: false }
    );

    const req = new NextRequest('http://localhost');
    const res = await handler(req, { params: {} });
    expect(res.status).toBe(500);
  });
});
