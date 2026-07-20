import { IBaseRepository } from './base.repository';
import { PaginatedResult } from '@/types/api.types';
import { PaginationOptions, SortOptions, ITransaction } from '@/types/domain.types';
import { calculatePaginationMeta, getOffset } from '@/lib/utils/pagination';
import { isUUID } from '@/lib/validation/uuid';

const KNOWN_UUID_FIELDS = [
  'id',
  'organizationId',
  'matchId',
  'venueId',
  'userId',
  'zoneId',
  'incidentId',
  'conversationId',
  'createdById',
  'assignedTo',
  'reportedBy',
  'resolvedBy',
  'actedByUserId',
];

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
 * Handles generic CRUD operations and protects PostgreSQL against invalid UUID syntax errors.
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
    if (!isUUID(id)) return null;
    try {
      const result = await this.getDelegate(tx).findUnique({
        where: { id },
      });
      return (result as TEntity) || null;
    } catch (e) {
      return null;
    }
  }

  public async findAll(options?: {
    filter?: Record<string, SafeAny>;
    pagination?: PaginationOptions;
    sort?: SortOptions[];
    includeDeleted?: boolean;
  }): Promise<PaginatedResult<TEntity>> {
    const { filter, pagination, sort, includeDeleted } = options || {};
    const limit = pagination?.limit || 10;
    const page = pagination?.page || 1;

    const where: Record<string, SafeAny> = { ...(filter || {}) };

    // Inspect filter for any non-UUID value assigned to a PostgreSQL @db.Uuid column
    for (const field of KNOWN_UUID_FIELDS) {
      if (where[field] !== undefined && typeof where[field] === 'string') {
        if (!isUUID(where[field])) {
          // Prevent DB error by returning empty result set for invalid UUID queries
          return {
            data: [],
            meta: calculatePaginationMeta(0, page, limit),
          };
        }
      }
    }

    // Default to excluding soft-deleted records unless explicitly requested
    if (!includeDeleted && where.deletedAt === undefined) {
      where.deletedAt = null;
    }

    const queryArgs: Record<string, SafeAny> = { where };

    if (sort && sort.length > 0) {
      queryArgs.orderBy = sort.map((s) => ({ [String(s.field)]: s.order }));
    }

    if (pagination) {
      queryArgs.skip = getOffset(page, limit);
      queryArgs.take = limit;
    }

    try {
      const [data, totalCount] = await Promise.all([
        this.getDelegate().findMany(queryArgs) as Promise<TEntity[]>,
        this.getDelegate().count({ where: queryArgs.where }),
      ]);

      return {
        data,
        meta: calculatePaginationMeta(totalCount, page, limit),
      };
    } catch (error) {
      return {
        data: [],
        meta: calculatePaginationMeta(0, page, limit),
      };
    }
  }

  public async create(data: TCreateDTO, tx?: ITransaction): Promise<TEntity> {
    const result = await this.getDelegate(tx).create({
      data,
    });
    return result as TEntity;
  }

  public async update(id: string, data: TUpdateDTO, tx?: ITransaction): Promise<TEntity> {
    if (!isUUID(id)) {
      throw new Error(`Cannot update record with invalid UUID: ${id}`);
    }
    const result = await this.getDelegate(tx).update({
      where: { id },
      data,
    });
    return result as TEntity;
  }

  public async softDelete(id: string, tx?: ITransaction): Promise<boolean> {
    if (!isUUID(id)) return false;
    try {
      await this.getDelegate(tx).update({
        where: { id },
        data: { deletedAt: new Date() },
      });
      return true;
    } catch (e) {
      return false;
    }
  }

  public async delete(id: string, tx?: ITransaction): Promise<boolean> {
    if (!isUUID(id)) return false;
    try {
      await this.getDelegate(tx).delete({
        where: { id },
      });
      return true;
    } catch (e) {
      return false;
    }
  }

  public async count(filter?: Record<string, SafeAny>, includeDeleted = false): Promise<number> {
    const where: Record<string, SafeAny> = { ...(filter || {}) };

    for (const field of KNOWN_UUID_FIELDS) {
      if (where[field] !== undefined && typeof where[field] === 'string') {
        if (!isUUID(where[field])) return 0;
      }
    }

    if (!includeDeleted && where.deletedAt === undefined) {
      where.deletedAt = null;
    }

    try {
      return await this.getDelegate().count({ where });
    } catch (e) {
      return 0;
    }
  }
}
