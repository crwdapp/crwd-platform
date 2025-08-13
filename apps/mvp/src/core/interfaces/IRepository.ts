/**
 * Generic Repository Interface
 * Implements Repository Pattern for data access abstraction
 */
export interface IRepository<T, K = number> {
  findById(id: K): Promise<T | null>;
  findAll(filters?: Record<string, any>): Promise<T[]>;
  create(entity: Omit<T, 'id'>): Promise<T>;
  update(id: K, entity: Partial<T>): Promise<T>;
  delete(id: K): Promise<boolean>;
}

/**
 * Query interface for complex filtering
 */
export interface IQuery<T> {
  filters?: Partial<T>;
  search?: string;
  sort?: {
    field: keyof T;
    direction: 'asc' | 'desc';
  };
  pagination?: {
    page: number;
    limit: number;
  };
}