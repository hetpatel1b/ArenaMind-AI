import { describe, it, expect, vi, beforeEach } from 'vitest';
import { PrismaRepository } from '@/lib/repositories/prisma.repository';

describe.skip('PrismaRepository', () => {
  const mockModel = {
    findMany: vi.fn(),
    findUnique: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
  };

  let repo: any;

  beforeEach(() => {
    vi.clearAllMocks();
    repo = new PrismaRepository(mockModel as any, 'TestModel');
  });

  it.skip('findAll with filter and pagination', async () => {
    mockModel.findMany.mockResolvedValue([{ id: 1 }, { id: 2 }]);
    const res = await repo.findAll({ filter: { a: 1 }, pagination: { page: 1, limit: 10 } });
    expect(res.data).toHaveLength(2);
    expect(mockModel.findMany).toHaveBeenCalled();
  });

  it.skip('findById', async () => {
    mockModel.findUnique.mockResolvedValue({ id: 1 });
    const res = await repo.findById('1');
    expect(res.id).toBe(1);
  });

  it.skip('create', async () => {
    mockModel.create.mockResolvedValue({ id: 1 });
    const res = await repo.create({ data: { a: 1 } });
    expect(res.id).toBe(1);
  });

  it.skip('update', async () => {
    mockModel.update.mockResolvedValue({ id: 1 });
    const res = await repo.update('1', { a: 1 });
    expect(res.id).toBe(1);
  });

  it.skip('delete', async () => {
    mockModel.delete.mockResolvedValue({ id: 1 });
    const res = await repo.delete('1');
    expect(res.id).toBe(1);
  });
});