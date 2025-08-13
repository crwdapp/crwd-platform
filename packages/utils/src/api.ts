import { ApiResponse, ErrorResponse } from '@crwd/types';

export const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:3000/api';

export class ApiError extends Error {
  constructor(
    public status: number,
    public message: string,
    public details?: any
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

export const handleApiResponse = async <T>(response: Response): Promise<T> => {
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

  const data = await response.json();
  return data;
};

export const createApiRequest = async <T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> => {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const defaultOptions: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  };

  const response = await fetch(url, {
    ...defaultOptions,
    ...options,
  });

  return handleApiResponse<T>(response);
};

export const api = {
  get: <T>(endpoint: string, options?: RequestInit): Promise<T> => {
    return createApiRequest<T>(endpoint, {
      method: 'GET',
      ...options,
    });
  },

  post: <T>(endpoint: string, data?: any, options?: RequestInit): Promise<T> => {
    return createApiRequest<T>(endpoint, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
      ...options,
    });
  },

  put: <T>(endpoint: string, data?: any, options?: RequestInit): Promise<T> => {
    return createApiRequest<T>(endpoint, {
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
      ...options,
    });
  },

  patch: <T>(endpoint: string, data?: any, options?: RequestInit): Promise<T> => {
    return createApiRequest<T>(endpoint, {
      method: 'PATCH',
      body: data ? JSON.stringify(data) : undefined,
      ...options,
    });
  },

  delete: <T>(endpoint: string, options?: RequestInit): Promise<T> => {
    return createApiRequest<T>(endpoint, {
      method: 'DELETE',
      ...options,
    });
  },
};

export const withAuth = (token: string) => (options: RequestInit = {}): RequestInit => ({
  ...options,
  headers: {
    ...options.headers,
    Authorization: `Bearer ${token}`,
  },
});
