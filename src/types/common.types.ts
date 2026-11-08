export type EntityId = string;

export type AsyncStatus = 'idle' | 'loading' | 'success' | 'error';

export type PaginatedResult<T> = {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
};
