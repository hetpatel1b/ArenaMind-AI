import { describe, it, expect } from 'vitest';
import { NextRequest, NextResponse } from 'next/server';
import { generateETag, checkConditionalCache, withCacheHeaders } from '@/lib/api/caching';

describe('caching utilities', () => {
  describe('generateETag', () => {
    it('generates an md5 hash for a string', () => {
      const eTag = generateETag('test payload');
      expect(typeof eTag).toBe('string');
      expect(eTag.length).toBeGreaterThan(0);
    });

    it('generates an md5 hash for an object', () => {
      const obj = { key: 'value' };
      const eTag = generateETag(obj);
      expect(typeof eTag).toBe('string');
      // Should equal md5 of '{"key":"value"}'
      expect(eTag).toBe(generateETag('{"key":"value"}'));
    });
  });

  describe('checkConditionalCache', () => {
    it('returns 304 response when if-none-match equals ETag', () => {
      const eTag = 'some-etag';
      const req = new NextRequest('http://localhost', {
        headers: { 'if-none-match': eTag },
      });
      const res = checkConditionalCache(req, eTag);
      
      expect(res).toBeInstanceOf(NextResponse);
      expect(res?.status).toBe(304);
    });

    it('returns null when if-none-match does not equal ETag', () => {
      const eTag = 'some-etag';
      const req = new NextRequest('http://localhost', {
        headers: { 'if-none-match': 'different-etag' },
      });
      const res = checkConditionalCache(req, eTag);
      
      expect(res).toBeNull();
    });

    it('returns null when if-none-match is missing', () => {
      const eTag = 'some-etag';
      const req = new NextRequest('http://localhost');
      const res = checkConditionalCache(req, eTag);
      
      expect(res).toBeNull();
    });
  });

  describe('withCacheHeaders', () => {
    it('sets correct cache headers on a response', () => {
      const res = new NextResponse();
      const eTag = 'test-etag';
      const maxAge = 60;
      
      const cachedRes = withCacheHeaders(res, eTag, maxAge);
      
      expect(cachedRes.headers.get('ETag')).toBe(eTag);
      expect(cachedRes.headers.get('Cache-Control')).toBe(`public, max-age=${maxAge}, stale-while-revalidate=${maxAge * 2}`);
    });

    it('uses default maxAgeSeconds if not provided', () => {
      const res = new NextResponse();
      const eTag = 'test-etag';
      
      const cachedRes = withCacheHeaders(res, eTag);
      
      expect(cachedRes.headers.get('ETag')).toBe(eTag);
      expect(cachedRes.headers.get('Cache-Control')).toBe(`public, max-age=60, stale-while-revalidate=120`);
    });
  });
});
