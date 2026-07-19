import { createHash } from 'crypto';
import { NextRequest, NextResponse } from 'next/server';

/**
 * Generates an ETag hash for caching payloads.
 */
export function generateETag(data: SafeAny): string {
  const str = typeof data === 'string' ? data : JSON.stringify(data);
  return createHash('md5').update(str).digest('hex');
}

/**
 * Compares the request's If-None-Match header against the fresh ETag.
 * Returns a 304 Not Modified response if they match, saving bandwidth.
 */
export function checkConditionalCache(req: NextRequest, eTag: string): NextResponse | null {
  const ifNoneMatch = req.headers.get('if-none-match');

  if (ifNoneMatch === eTag) {
    return new NextResponse(null, { status: 304 });
  }

  return null;
}

/**
 * Injects caching headers into a standard response.
 */
export function withCacheHeaders(
  response: NextResponse,
  eTag: string,
  maxAgeSeconds = 60
): NextResponse {
  response.headers.set('ETag', eTag);
  response.headers.set(
    'Cache-Control',
    `public, max-age=${maxAgeSeconds}, stale-while-revalidate=${maxAgeSeconds * 2}`
  );
  return response;
}
