// @ts-nocheck
import { describe, it, expect } from 'vitest';
import { errorResponse, successResponse } from '@/lib/api/response';

describe('Response utils', () => {
  it('returns correctly formatted errorResponse', () => {
    const res = errorResponse('err', 400);
    expect(res.status).toBe(400);
  });

  it('returns correctly formatted successResponse without headers', async () => {
    const res = successResponse({ ok: true });
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.data.ok).toBe(true);
  });

  it('returns correctly formatted successResponse with headers', async () => {
    const res = successResponse({ ok: true }, 200, undefined, { 'x-test': '1' });
    expect(res.status).toBe(200);
    expect(res.headers.get('x-test')).toBe('1');
  });
});
