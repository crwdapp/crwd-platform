export class AuthService {
    client;
    constructor(client) {
        this.client = client;
    }
    async login(credentials) {
        return this.client.post('/auth/login', credentials);
    }
    async register(data) {
        return this.client.post('/auth/register', data);
    }
    async refreshToken(refreshToken) {
        return this.client.post('/auth/refresh', { refreshToken });
    }
    async logout() {
        return this.client.post('/auth/logout');
    }
    async forgotPassword(email) {
        return this.client.post('/auth/forgot-password', { email });
    }
    async resetPassword(token, newPassword) {
        return this.client.post('/auth/reset-password', { token, newPassword });
    }
    async verifyEmail(token) {
        return this.client.post('/auth/verify-email', { token });
    }
}
export class BarService {
    client;
    constructor(client) {
        this.client = client;
    }
    async getBars(filters, pagination) {
        const params = new URLSearchParams();
        if (filters) {
            Object.entries(filters).forEach(([key, value]) => {
                if (value !== undefined) {
                    params.append(key, String(value));
                }
            });
        }
        if (pagination) {
            params.append('page', String(pagination.page));
            params.append('limit', String(pagination.limit));
        }
        return this.client.get(`/bars?${params.toString()}`);
    }
    async getBar(id) {
        return this.client.get(`/bars/${id}`);
    }
    async createBar(data) {
        return this.client.post('/bars', data);
    }
    async updateBar(id, data) {
        return this.client.put(`/bars/${id}`, data);
    }
    async deleteBar(id) {
        return this.client.delete(`/bars/${id}`);
    }
    async uploadBarImages(id, files) {
        return this.client.uploadMultiple(`/bars/${id}/images`, files);
    }
}
export class EventService {
    client;
    constructor(client) {
        this.client = client;
    }
    async getEvents(filters, pagination) {
        const params = new URLSearchParams();
        if (filters) {
            Object.entries(filters).forEach(([key, value]) => {
                if (value !== undefined) {
                    params.append(key, String(value));
                }
            });
        }
        if (pagination) {
            params.append('page', String(pagination.page));
            params.append('limit', String(pagination.limit));
        }
        return this.client.get(`/events?${params.toString()}`);
    }
    async getEvent(id) {
        return this.client.get(`/events/${id}`);
    }
    async createEvent(data) {
        return this.client.post('/events', data);
    }
    async updateEvent(id, data) {
        return this.client.put(`/events/${id}`, data);
    }
    async deleteEvent(id) {
        return this.client.delete(`/events/${id}`);
    }
    async registerForEvent(eventId) {
        return this.client.post(`/events/${eventId}/register`);
    }
    async cancelEventRegistration(eventId) {
        return this.client.delete(`/events/${eventId}/register`);
    }
}
export class UserService {
    client;
    constructor(client) {
        this.client = client;
    }
    async getProfile() {
        return this.client.get('/users/profile');
    }
    async updateProfile(data) {
        return this.client.put('/users/profile', data);
    }
    async changePassword(currentPassword, newPassword) {
        return this.client.post('/users/change-password', { currentPassword, newPassword });
    }
    async uploadAvatar(file) {
        return this.client.upload('/users/avatar', file);
    }
    async deleteAccount() {
        return this.client.delete('/users/account');
    }
}
export class DrinkService {
    client;
    constructor(client) {
        this.client = client;
    }
    async getDrinks(barId, pagination) {
        const params = new URLSearchParams();
        if (barId) {
            params.append('barId', barId);
        }
        if (pagination) {
            params.append('page', String(pagination.page));
            params.append('limit', String(pagination.limit));
        }
        return this.client.get(`/drinks?${params.toString()}`);
    }
    async getDrink(id) {
        return this.client.get(`/drinks/${id}`);
    }
    async createDrink(data) {
        return this.client.post('/drinks', data);
    }
    async updateDrink(id, data) {
        return this.client.put(`/drinks/${id}`, data);
    }
    async deleteDrink(id) {
        return this.client.delete(`/drinks/${id}`);
    }
}
export class PaymentService {
    client;
    constructor(client) {
        this.client = client;
    }
    async createPayment(data) {
        return this.client.post('/payments', data);
    }
    async getPayment(id) {
        return this.client.get(`/payments/${id}`);
    }
    async getPayments(pagination) {
        const params = new URLSearchParams();
        if (pagination) {
            params.append('page', String(pagination.page));
            params.append('limit', String(pagination.limit));
        }
        return this.client.get(`/payments?${params.toString()}`);
    }
    async createSubscription(planId) {
        return this.client.post('/subscriptions', { planId });
    }
    async getSubscription(id) {
        return this.client.get(`/subscriptions/${id}`);
    }
    async cancelSubscription(id) {
        return this.client.patch(`/subscriptions/${id}/cancel`);
    }
}
// Service factory
export class ApiServices {
    auth;
    bars;
    events;
    users;
    drinks;
    payments;
    constructor(client) {
        this.auth = new AuthService(client);
        this.bars = new BarService(client);
        this.events = new EventService(client);
        this.users = new UserService(client);
        this.drinks = new DrinkService(client);
        this.payments = new PaymentService(client);
    }
}
//# sourceMappingURL=services.js.map