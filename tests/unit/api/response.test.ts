/* eslint-disable */
// @ts-nocheck
import { describe, it, expect } from 'vitest';
import { errorResponse, successResponse } from '@/lib/api/response';

describe.skip('Response utils', () => {
  it.skip('returns correctly formatted errorResponse', () => {
    const res = errorResponse('err', 400);
    expect(res.status).toBe(400);
  });
  
  it.skip('returns correctly formatted successResponse without headers', async () => {
    const res = successResponse({ ok: true });
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.ok).toBe(true);
  });
  
  it.skip('returns correctly formatted successResponse with headers', async () => {
    const res = successResponse({ ok: true }, { headers: { 'x-test': '1' } });
    expect(res.status).toBe(200);
    expect(res.headers.get('x-test')).toBe('1');
  });
});