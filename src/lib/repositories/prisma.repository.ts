import { IBaseRepository } from './base.repository';
import { PaginatedResult } from '@/types/api.types';
import { PaginationOptions, SortOptions, ITransaction } from '@/types/domain.types';
import { calculatePaginationMeta, getOffset } from '@/lib/utils/pagination';

/**
 * Minimal interface representing a Prisma model delegate.
 */
export interface PrismaDelegate {
  findUnique(args: SafeAny): Promise<SafeAny>;
  findMany(args: SafeAny): Promise<SafeAny[]>;
  create(args: SafeAny): Promise<SafeAny>;
  update(args: SafeAny): Promise<SafeAny>;
  delete(args: SafeAny): Promise<SafeAny>;
  count(args?: SafeAny): Promise<number>;
}

/**
 * Abstract base class for Prisma-backed repositories.
 * Handles the generic CRUD operations so concrete repositories only need to implement domain-specific logic.
 */
export abstract class PrismaRepository<
  TEntity extends { id: string },
  TCreateDTO,
  TUpdateDTO,
> implements IBaseRepository<TEntity, TCreateDTO, TUpdateDTO> {
  constructor(
    protected readonly delegate: PrismaDelegate,
    protected readonly modelName: string
  ) {}

  /**
   * Helper to resolve the correct delegate (either the global client or a transaction client).
   */
  protected getDelegate(tx?: ITransaction): PrismaDelegate {
    return tx
      ? (tx as unknown as Record<string, PrismaDelegate>)[this.modelName] || this.delegate
      : this.delegate;
  }

  public async findById(id: string, tx?: ITransaction): Promise<TEntity | null> {
    const result = await this.getDelegate(tx).findUnique({
      where: { id },
    });
    // For soft delete models, we should theoretically filter by deletedAt here or in the caller
    return (result as TEntity) || null;
  }

  public async findAll(options?: {
    filter?: Record<string, SafeAny>;
    pagination?: PaginationOptions;
    sort?: SortOptions[];
    includeDeleted?: boolean;
  }): Promise<PaginatedResult<TEntity>> {
    const { filter, pagination, sort, includeDeleted } = options || {};

    const where: Record<string, SafeAny> = { ...(filter || {}) };

    // Default to excluding soft-deleted records unless explicitly requested
    if (!includeDeleted && where.deletedAt === undefined) {
      where.deletedAt = null;
    }

    const queryArgs: Record<string, SafeAny> = { where };

    if (sort && sort.length > 0) {
      queryArgs.orderBy = sort.map((s) => ({ [String(s.field)]: s.order }));
    }

    if (pagination) {
      queryArgs.skip = getOffset(pagination.page, pagination.limit);
      queryArgs.take = pagination.limit;
    }

    const [data, totalCount] = await Promise.all([
      this.delegate.findMany(queryArgs) as Promise<TEntity[]>,
      this.delegate.count({ where: queryArgs.where }),
    ]);

    const limit = pagination?.limit || totalCount || 1;
    const page = pagination?.page || 1;

    return {
      data,
      meta: calculatePaginationMeta(totalCount, page, limit),
    };
  }

  public async create(data: TCreateDTO, tx?: ITransaction): Promise<TEntity> {
    const result = await this.getDelegate(tx).create({
      data,
    });
    return result as TEntity;
  }

  public async update(id: string, data: TUpdateDTO, tx?: ITransaction): Promise<TEntity> {
    const result = await this.getDelegate(tx).update({
      where: { id },
      data,
    });
    return result as TEntity;
  }

  public async softDelete(id: string, tx?: ITransaction): Promise<boolean> {
    await this.getDelegate(tx).update({
      where: { id },
      data: { deletedAt: new Date() },
    });
    return true;
  }

  public async delete(id: string, tx?: ITransaction): Promise<boolean> {
    await this.getDelegate(tx).delete({
      where: { id },
    });
    return true;
  }

  public async count(filter?: Record<string, SafeAny>, includeDeleted = false): Promise<number> {
    const where: Record<string, SafeAny> = { ...(filter || {}) };

    if (!includeDeleted && where.deletedAt === undefined) {
      where.deletedAt = null;
    }

    return this.delegate.count({
      where,
    });
  }
}
