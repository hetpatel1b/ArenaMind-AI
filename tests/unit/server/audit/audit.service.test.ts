/* eslint-disable @typescript-eslint/no-require-imports */
import { describe, it, expect, vi } from 'vitest';
import { AuditService } from '@/server/audit/audit.service';
import { prismaMock } from '../../../../tests/e2e/mocks/prisma.mock';

vi.mock('@/lib/db/client', () => ({ prisma: { auditLog: { create: vi.fn() } } }));

describe.skip('AuditService', () => {
  it.skip('logs securely and catches errors', async () => {
    const { prisma } = require('@/lib/db/client');
    prisma.auditLog.create.mockRejectedValueOnce(new Error('DB Error'));
    
    // Should not throw
    await expect(AuditService.log({ action: "ACCESS", tableName: 't', recordId: '1', userId: 'u' })).resolves.toBeUndefined();
  });
});