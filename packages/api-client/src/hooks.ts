import { useState, useEffect, useCallback } from 'react';
import { ApiClient, ApiServices } from './client';
import { ApiError } from '@crwd/utils';

export interface UseApiState<T> {
  data: T | null;
  loading: boolean;
  error: ApiError | null;
}

export interface UseApiOptions {
  immediate?: boolean;
  onSuccess?: (data: any) => void;
  onError?: (error: ApiError) => void;
}

export function useApi<T>(
  apiCall: () => Promise<T>,
  options: UseApiOptions = {}
): UseApiState<T> & { execute: () => Promise<void> } {
  const [state, setState] = useState<UseApiState<T>>({
    data: null,
    loading: false,
    error: null,
  });

  const execute = useCallback(async () => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      const data = await apiCall();
      setState({ data, loading: false, error: null });
      options.onSuccess?.(data);
    } catch (error) {
      const apiError = error instanceof ApiError ? error : new ApiError(0, 'Unknown error');
      setState({ data: null, loading: false, error: apiError });
      options.onError?.(apiError);
    }
  }, [apiCall, options]);

  useEffect(() => {
    if (options.immediate !== false) {
      execute();
    }
  }, [execute, options.immediate]);

  return { ...state, execute };
}

export function useApiClient(client: ApiClient) {
  return new ApiServices(client);
}

export function useAuth(client: ApiClient) {
  const services = useApiClient(client);
  return services.auth;
}

export function useBars(client: ApiClient) {
  const services = useApiClient(client);
  return services.bars;
}

export function useEvents(client: ApiClient) {
  const services = useApiClient(client);
  return services.events;
}

export function useUsers(client: ApiClient) {
  const services = useApiClient(client);
  return services.users;
}

export function useDrinks(client: ApiClient) {
  const services = useApiClient(client);
  return services.drinks;
}

export function usePayments(client: ApiClient) {
  const services = useApiClient(client);
  return services.payments;
}
