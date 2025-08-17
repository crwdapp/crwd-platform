export const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:3000/api';
export class ApiError extends Error {
    status;
    message;
    details;
    constructor(status, message, details) {
        super(message);
        this.status = status;
        this.message = message;
        this.details = details;
        this.name = 'ApiError';
    }
}
export const handleApiResponse = async (response) => {
    if (!response.ok) {
        let errorData;
        try {
            errorData = await response.json();
        }
        catch {
            errorData = {
                statusCode: response.status,
                message: response.statusText,
                error: 'Unknown error',
                timestamp: new Date().toISOString(),
                path: response.url
            };
        }
        throw new ApiError(response.status, errorData.message || response.statusText, errorData);
    }
    const data = await response.json();
    return data;
};
export const createApiRequest = async (endpoint, options = {}) => {
    const url = `${API_BASE_URL}${endpoint}`;
    const defaultOptions = {
        headers: {
            'Content-Type': 'application/json',
            ...options.headers,
        },
    };
    const response = await fetch(url, {
        ...defaultOptions,
        ...options,
    });
    return handleApiResponse(response);
};
export const api = {
    get: (endpoint, options) => {
        return createApiRequest(endpoint, {
            method: 'GET',
            ...options,
        });
    },
    post: (endpoint, data, options) => {
        return createApiRequest(endpoint, {
            method: 'POST',
            body: data ? JSON.stringify(data) : undefined,
            ...options,
        });
    },
    put: (endpoint, data, options) => {
        return createApiRequest(endpoint, {
            method: 'PUT',
            body: data ? JSON.stringify(data) : undefined,
            ...options,
        });
    },
    patch: (endpoint, data, options) => {
        return createApiRequest(endpoint, {
            method: 'PATCH',
            body: data ? JSON.stringify(data) : undefined,
            ...options,
        });
    },
    delete: (endpoint, options) => {
        return createApiRequest(endpoint, {
            method: 'DELETE',
            ...options,
        });
    },
};
export const withAuth = (token) => (options = {}) => ({
    ...options,
    headers: {
        ...options.headers,
        Authorization: `Bearer ${token}`,
    },
});
//# sourceMappingURL=api.js.map