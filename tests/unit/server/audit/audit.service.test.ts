import { describe, it, expect, vi } from 'vitest';
import { AuditService } from '@/server/audit/audit.service';
import { prismaMock } from '../../../../tests/e2e/mocks/prisma.mock';
import { prisma } from '@/lib/db/client';

vi.mock('@/lib/db/client', () => ({ prisma: { auditLog: { create: vi.fn() } } }));

describe('AuditService', () => {
  it('logs securely and catches errors', async () => {
    (prisma.auditLog.create as any).mockRejectedValueOnce(new Error('DB Error'));

    // Should not throw
    await expect(
      AuditService.log({ action: 'ACCESS', tableName: 't', recordId: '1', userId: 'u' })
    ).resolves.toBeUndefined();
  });
});
