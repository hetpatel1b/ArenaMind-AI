import { NextResponse } from 'next/server';
import { createHash } from 'crypto';

export class ApiOptimizer {
  /**
   * Automatically injects ETag, Cache-Control, and checks Conditional Requests (If-None-Match).
   */
  static applyCacheHeaders(
    request: Request,
    responseBody: SafeAny,
    options: { maxAgeSeconds?: number; sMaxAgeSeconds?: number } = {}
  ): NextResponse {
    const { maxAgeSeconds = 0, sMaxAgeSeconds = 0 } = options;

    const responsePayload =
      typeof responseBody === 'string' ? responseBody : JSON.stringify(responseBody);

    // Generate ETag (weak ETag by prefixing with W/ is standard for dynamic content)
    const etag = `W/"${createHash('md5').update(responsePayload).digest('hex')}"`;

    // Check Conditional Request
    const clientETag = request.headers.get('If-None-Match');
    if (clientETag === etag) {
      // 304 Not Modified
      return new NextResponse(null, { status: 304 });
    }

    // Build Cache-Control header
    const cacheDirectives = [];
    if (maxAgeSeconds > 0 || sMaxAgeSeconds > 0) {
      cacheDirectives.push('public');
      if (maxAgeSeconds > 0) cacheDirectives.push(`max-age=${maxAgeSeconds}`);
      if (sMaxAgeSeconds > 0) cacheDirectives.push(`s-maxage=${sMaxAgeSeconds}`);
    } else {
      cacheDirectives.push('no-store', 'must-revalidate');
    }

    const res = NextResponse.json(responseBody);
    res.headers.set('ETag', etag);
    res.headers.set('Cache-Control', cacheDirectives.join(', '));

    // Suggest connection persistence
    res.headers.set('Connection', 'keep-alive');

    return res;
  }
}
