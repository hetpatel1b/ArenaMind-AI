import { PaginatedResult } from '@/types/api.types';
import { PaginationOptions, SortOptions, ITransaction } from '@/types/domain.types';

/**
 * The standard generic repository interface.
 * Implements the Repository Pattern to decouple business logic from the ORM.
 */
export interface IBaseRepository<TEntity, TCreateDTO, TUpdateDTO> {
  /**
   * Retrieves a single entity by its unique identifier.
   */
  findById(id: string, tx?: ITransaction): Promise<TEntity | null>;

  /**
   * Retrieves all entities matching optional filtering, pagination, and sorting.
   */
  findAll(options?: {
    filter?: Record<string, SafeAny>;
    pagination?: PaginationOptions;
    sort?: SortOptions[];
  }): Promise<PaginatedResult<TEntity>>;

  /**
   * Creates a new entity.
   */
  create(data: TCreateDTO, tx?: ITransaction): Promise<TEntity>;

  /**
   * Updates an existing entity.
   */
  update(id: string, data: TUpdateDTO, tx?: ITransaction): Promise<TEntity>;

  /**
   * Soft deletes an entity by setting a deletedAt timestamp or isDeleted flag.
   */
  softDelete(id: string, tx?: ITransaction): Promise<boolean>;

  /**
   * Hard deletes an entity.
   */
  delete(id: string, tx?: ITransaction): Promise<boolean>;

  /**
   * Counts the number of entities matching a filter.
   */
  count(filter?: Record<string, SafeAny>): Promise<number>;
}
