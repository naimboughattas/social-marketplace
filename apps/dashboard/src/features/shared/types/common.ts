// Types communs
export interface BaseEntity {
  id: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Pagination {
  page: number;
  limit: number;
  total: number;
}

export interface SortConfig {
  field: string;
  direction: 'asc' | 'desc';
}