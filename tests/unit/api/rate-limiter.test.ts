import { describe, it, expect, vi, beforeEach } from 'vitest';
import { enforceRateLimit } from '@/lib/api/rate-limiter';
import { RateLimitError } from '@/lib/errors/http.errors';
import { NextRequest } from 'next/server';
import { prisma } from '@/lib/db/client';

// Mock prisma client
vi.mock('@/lib/db/client', () => ({
  prisma: {
    rateLimit: {
      count: vi.fn(),
      create: vi.fn(),
    },
  },
}));

describe('Rate Limiter', () => {
  const req = new NextRequest('http://localhost');
  const identifier = 'user-123';
  const options = { windowMs: 1000, maxRequests: 5 };

  beforeEach(() => {
    vi.clearAllMocks();
    
    // Silence console.error for fail-open test
    vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  it('allows request if within limit and creates record', async () => {
    vi.mocked(prisma.rateLimit.count).mockResolvedValue(2);
    vi.mocked(prisma.rateLimit.create).mockResolvedValue({} as any);

    await expect(enforceRateLimit(req, identifier, options)).resolves.toBeUndefined();

    expect(prisma.rateLimit.count).toHaveBeenCalledWith({
      where: expect.objectContaining({
        id: expect.stringContaining(`${identifier}_`),
      }),
    });
    expect(prisma.rateLimit.create).toHaveBeenCalled();
  });

  it('throws RateLimitError if limit exceeded', async () => {
    vi.mocked(prisma.rateLimit.count).mockResolvedValue(5);

    await expect(enforceRateLimit(req, identifier, options)).rejects.toThrow(RateLimitError);
    
    expect(prisma.rateLimit.create).not.toHaveBeenCalled();
  });

  it('fails open (allows request) if DB fails with non-RateLimitError', async () => {
    vi.mocked(prisma.rateLimit.count).mockRejectedValue(new Error('DB connection failed'));

    // Should resolve, not reject
    await expect(enforceRateLimit(req, identifier, options)).resolves.toBeUndefined();
    
    expect(console.error).toHaveBeenCalledWith('Rate limit DB error', expect.any(Error));
  });
});
