/**
 * Standard API Response Structure
 * Designed for 1:1 mapping with ASP.NET Core API Standard Response Wrappers (e.g., ApiResponse<T>).
 */
export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
  errors?: string[];
  statusCode: number;
  timestamp: string; // ISO-8601 string
}

/**
 * Paginated API Result
 * Matches ASP.NET Core PaginatedList<T> or PagedResult<T>.
 */
export interface PaginatedResult<T> {
  items: T[];
  pageNumber: number;
  pageSize: number;
  totalPages: number;
  totalCount: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
}

/**
 * Filter Parameters for Queries
 */
export interface QueryParameters {
  pageNumber?: number;
  pageSize?: number;
  sortBy?: string;
  isDescending?: boolean;
  searchQuery?: string;
  locale?: string;
}

/**
 * Custom Error Class for API Client
 */
export class ApiError extends Error {
  public readonly statusCode: number;
  public readonly errors: string[];

  constructor(message: string, statusCode: number, errors: string[] = []) {
    super(message);
    this.name = 'ApiError';
    this.statusCode = statusCode;
    this.errors = errors;
  }
}
