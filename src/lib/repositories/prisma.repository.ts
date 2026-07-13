import { IBaseRepository } from './base.repository';
import { PaginatedResult } from '@/types/api.types';
import { PaginationOptions, SortOptions, ITransaction } from '@/types/domain.types';
import { calculatePaginationMeta, getOffset } from '@/lib/utils/pagination';

/**
 * Minimal interface representing a Prisma model delegate.
 */
export interface PrismaDelegate {
  findUnique(args: unknown): Promise<unknown>;
  findMany(args: unknown): Promise<unknown[]>;
  create(args: unknown): Promise<unknown>;
  update(args: unknown): Promise<unknown>;
  delete(args: unknown): Promise<unknown>;
  count(args?: unknown): Promise<number>;
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
  constructor(protected readonly delegate: PrismaDelegate) {}

  /**
   * Helper to resolve the correct delegate (either the global client or a transaction client).
   */
  protected getDelegate(tx?: ITransaction): PrismaDelegate {
    return tx
      ? (tx as unknown as Record<string, PrismaDelegate>)[
          this.constructor.name.replace('Repository', '').toLowerCase()
        ] || this.delegate
      : this.delegate;
  }

  public async findById(id: string, tx?: ITransaction): Promise<TEntity | null> {
    const result = await this.getDelegate(tx).findUnique({
      where: { id },
    });
    return (result as TEntity) || null;
  }

  public async findAll(options?: {
    filter?: Record<string, unknown>;
    pagination?: PaginationOptions;
    sort?: SortOptions[];
  }): Promise<PaginatedResult<TEntity>> {
    const { filter, pagination, sort } = options || {};

    const queryArgs: Record<string, unknown> = {
      where: filter || {},
    };

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
      data: { isDeleted: true, deletedAt: new Date() },
    });
    return true;
  }

  public async delete(id: string, tx?: ITransaction): Promise<boolean> {
    await this.getDelegate(tx).delete({
      where: { id },
    });
    return true;
  }

  public async count(filter?: Record<string, unknown>): Promise<number> {
    return this.delegate.count({
      where: filter || {},
    });
  }
}
