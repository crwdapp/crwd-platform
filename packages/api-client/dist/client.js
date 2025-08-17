import { ApiError } from '@crwd/utils';
export class ApiClient {
    config;
    token;
    constructor(config) {
        this.config = config;
    }
    setToken(token) {
        this.token = token;
    }
    clearToken() {
        this.token = undefined;
    }
    getHeaders() {
        const headers = {
            'Content-Type': 'application/json',
            ...this.config.headers,
        };
        if (this.token) {
            headers.Authorization = `Bearer ${this.token}`;
        }
        return headers;
    }
    async request(method, endpoint, data, options) {
        const url = `${this.config.baseURL}${endpoint}`;
        const requestOptions = {
            method,
            headers: this.getHeaders(),
            ...options,
        };
        if (data && method !== 'GET') {
            requestOptions.body = JSON.stringify(data);
        }
        try {
            const response = await fetch(url, requestOptions);
            return await this.handleResponse(response);
        }
        catch (error) {
            throw this.handleError(error);
        }
    }
    async handleResponse(response) {
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
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
            return await response.json();
        }
        return await response.text();
    }
    handleError(error) {
        if (error instanceof ApiError) {
            return error;
        }
        if (error.name === 'TypeError' && error.message.includes('fetch')) {
            return new ApiError(0, 'Network error', { originalError: error });
        }
        return new ApiError(0, 'Unknown error', { originalError: error });
    }
    // Convenience methods
    async get(endpoint, options) {
        return this.request('GET', endpoint, undefined, options);
    }
    async post(endpoint, data, options) {
        return this.request('POST', endpoint, data, options);
    }
    async put(endpoint, data, options) {
        return this.request('PUT', endpoint, data, options);
    }
    async patch(endpoint, data, options) {
        return this.request('PATCH', endpoint, data, options);
    }
    async delete(endpoint, options) {
        return this.request('DELETE', endpoint, undefined, options);
    }
    // File upload
    async upload(endpoint, file, options) {
        const formData = new FormData();
        formData.append('file', file);
        const url = `${this.config.baseURL}${endpoint}`;
        const requestOptions = {
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
            return await this.handleResponse(response);
        }
        catch (error) {
            throw this.handleError(error);
        }
    }
    // Multiple file upload
    async uploadMultiple(endpoint, files, options) {
        const formData = new FormData();
        files.forEach((file, index) => {
            formData.append(`files[${index}]`, file);
        });
        const url = `${this.config.baseURL}${endpoint}`;
        const requestOptions = {
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
            return await this.handleResponse(response);
        }
        catch (error) {
            throw this.handleError(error);
        }
    }
}
// Default client instance
export const defaultClient = new ApiClient({
    baseURL: process.env.REACT_APP_API_BASE_URL || 'http://localhost:3000/api',
    timeout: 10000,
});
//# sourceMappingURL=client.js.map