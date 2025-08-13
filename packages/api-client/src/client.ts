import { ApiResponse, ErrorResponse } from '@crwd/types';
import { api, withAuth, ApiError } from '@crwd/utils';

export interface ApiClientConfig {
  baseURL: string;
  timeout?: number;
  headers?: Record<string, string>;
}

export class ApiClient {
  private config: ApiClientConfig;
  private token?: string;

  constructor(config: ApiClientConfig) {
    this.config = config;
  }

  setToken(token: string): void {
    this.token = token;
  }

  clearToken(): void {
    this.token = undefined;
  }

  private getHeaders(): Record<string, string> {
    const headers = {
      'Content-Type': 'application/json',
      ...this.config.headers,
    };

    if (this.token) {
      headers.Authorization = `Bearer ${this.token}`;
    }

    return headers;
  }

  async request<T>(
    method: string,
    endpoint: string,
    data?: any,
    options?: RequestInit
  ): Promise<T> {
    const url = `${this.config.baseURL}${endpoint}`;
    
    const requestOptions: RequestInit = {
      method,
      headers: this.getHeaders(),
      ...options,
    };

    if (data && method !== 'GET') {
      requestOptions.body = JSON.stringify(data);
    }

    try {
      const response = await fetch(url, requestOptions);
      return await this.handleResponse<T>(response);
    } catch (error) {
      throw this.handleError(error);
    }
  }

  private async handleResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
      let errorData: ErrorResponse;
      try {
        errorData = await response.json();
      } catch {
        errorData = {
          statusCode: response.status,
          message: response.statusText,
          error: 'Unknown error',
          timestamp: new Date().toISOString(),
          path: response.url
        };
      }
      
      throw new ApiError(
        response.status,
        errorData.message || response.statusText,
        errorData
      );
    }

    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      return await response.json();
    }
    
    return await response.text() as T;
  }

  private handleError(error: any): Error {
    if (error instanceof ApiError) {
      return error;
    }
    
    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      return new ApiError(0, 'Network error', { originalError: error });
    }
    
    return new ApiError(0, 'Unknown error', { originalError: error });
  }

  // Convenience methods
  async get<T>(endpoint: string, options?: RequestInit): Promise<T> {
    return this.request<T>('GET', endpoint, undefined, options);
  }

  async post<T>(endpoint: string, data?: any, options?: RequestInit): Promise<T> {
    return this.request<T>('POST', endpoint, data, options);
  }

  async put<T>(endpoint: string, data?: any, options?: RequestInit): Promise<T> {
    return this.request<T>('PUT', endpoint, data, options);
  }

  async patch<T>(endpoint: string, data?: any, options?: RequestInit): Promise<T> {
    return this.request<T>('PATCH', endpoint, data, options);
  }

  async delete<T>(endpoint: string, options?: RequestInit): Promise<T> {
    return this.request<T>('DELETE', endpoint, undefined, options);
  }

  // File upload
  async upload<T>(endpoint: string, file: File, options?: RequestInit): Promise<T> {
    const formData = new FormData();
    formData.append('file', file);

    const url = `${this.config.baseURL}${endpoint}`;
    
    const requestOptions: RequestInit = {
      method: 'POST',
      headers: {
        Authorization: this.token ? `Bearer ${this.token}` : '',
        ...this.config.headers,
      },
      body: formData,
      ...options,
    };

    try {
      const response = await fetch(url, requestOptions);
      return await this.handleResponse<T>(response);
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Multiple file upload
  async uploadMultiple<T>(endpoint: string, files: File[], options?: RequestInit): Promise<T> {
    const formData = new FormData();
    files.forEach((file, index) => {
      formData.append(`files[${index}]`, file);
    });

    const url = `${this.config.baseURL}${endpoint}`;
    
    const requestOptions: RequestInit = {
      method: 'POST',
      headers: {
        Authorization: this.token ? `Bearer ${this.token}` : '',
        ...this.config.headers,
      },
      body: formData,
      ...options,
    };

    try {
      const response = await fetch(url, requestOptions);
      return await this.handleResponse<T>(response);
    } catch (error) {
      throw this.handleError(error);
    }
  }
}

// Default client instance
export const defaultClient = new ApiClient({
  baseURL: process.env.REACT_APP_API_BASE_URL || 'http://localhost:3000/api',
  timeout: 10000,
});
