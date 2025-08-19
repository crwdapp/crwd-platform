import { useState, useEffect, useCallback } from 'react';
import { ApiServices } from './client';
import { ApiError } from '@crwd/utils';
export function useApi(apiCall, options = {}) {
    const [state, setState] = useState({
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
        }
        catch (error) {
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
export function useApiClient(client) {
    return new ApiServices(client);
}
export function useAuth(client) {
    const services = useApiClient(client);
    return services.auth;
}
export function useBars(client) {
    const services = useApiClient(client);
    return services.bars;
}
export function useEvents(client) {
    const services = useApiClient(client);
    return services.events;
}
export function useUsers(client) {
    const services = useApiClient(client);
    return services.users;
}
export function useDrinks(client) {
    const services = useApiClient(client);
    return services.drinks;
}
export function usePayments(client) {
    const services = useApiClient(client);
    return services.payments;
}
//# sourceMappingURL=hooks.js.map