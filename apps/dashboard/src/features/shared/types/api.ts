// Types API partagés
export interface ApiResponse<T> {
  data: T;
  meta?: {
    total: number;
    page: number;
    limit: number;
  };
}

export interface ApiError {
  code: string;
  message: string;
  details?: Record<string, any>;
}