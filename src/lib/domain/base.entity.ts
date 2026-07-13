/**
 * Base interface for all domain entities.
 * Ensures consistent tracking of lifecycle dates.
 */
export interface IBaseEntity {
  id: string;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Interface for entities that support soft deletion.
 */
export interface ISoftDeletable {
  deletedAt: Date | null;
  isDeleted: boolean;
}

/**
 * Standard pagination request parameters.
 */
export interface PaginationParams {
  page: number;
  limit: number;
}

/**
 * Standard sorting parameters.
 */
export interface SortParams {
  field: string;
  order: 'asc' | 'desc';
}
