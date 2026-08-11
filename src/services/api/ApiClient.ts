import { ApiError, type ApiResponse } from '@/types/api';

/**
 * Enterprise HTTP API Client
 * Encapsulates fetch logic, error mapping, timeout, and authentication header injection.
 * Fully decoupled for seamless integration with ASP.NET Core Web API controllers.
 */
export class ApiClient {
  private readonly baseUrl: string;
  private readonly timeoutMs: number;

  constructor(baseUrl?: string, timeoutMs: number = 10000) {
    this.baseUrl = baseUrl || (import.meta.env.PUBLIC_API_BASE_URL ?? 'https://api.sportiverf.com/v1');
    this.timeoutMs = Number(import.meta.env.PUBLIC_API_TIMEOUT_MS) || timeoutMs;
  }

  /**
   * Generic HTTP Request Executor with AbortController timeout handling
   */
  public async request<T>(
    endpoint: string,
    options: RequestInit = {},
    customHeaders: Record<string, string> = {}
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseUrl.replace(/\/$/, '')}/${endpoint.replace(/^\//, '')}`;
    
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeoutMs);

    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      ...customHeaders,
      ...(options.headers || {})
    };

    try {
      const response = await fetch(url, {
        ...options,
        headers,
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        let errorData;
        try {
          errorData = await response.json();
        } catch {
          errorData = { message: response.statusText };
        }
        throw new ApiError(
          errorData.message || `HTTP Error ${response.status}`,
          response.status,
          errorData.errors || []
        );
      }

      const result: ApiResponse<T> = await response.json();
      return result;
    } catch (error: unknown) {
      clearTimeout(timeoutId);

      if (error instanceof ApiError) {
        throw error;
      }

      if (error instanceof Error && error.name === 'AbortError') {
        throw new ApiError(`Request timed out after ${this.timeoutMs}ms`, 408);
      }

      throw new ApiError(
        error instanceof Error ? error.message : 'An unexpected network error occurred',
        500
      );
    }
  }

  public async get<T>(endpoint: string, headers?: Record<string, string>): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: 'GET' }, headers);
  }

  public async post<T, D>(endpoint: string, data: D, headers?: Record<string, string>): Promise<ApiResponse<T>> {
    return this.request<T>(
      endpoint,
      {
        method: 'POST',
        body: JSON.stringify(data)
      },
      headers
    );
  }
}

// Singleton instance export
export const apiClient = new ApiClient();
