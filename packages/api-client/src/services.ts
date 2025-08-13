import { ApiClient } from './client';
import {
  Bar,
  BarSearchFilters,
  Event,
  EventSearchFilters,
  User,
  Drink,
  Payment,
  Subscription,
  AuthResponse,
  LoginCredentials,
  RegisterData,
  ApiResponse,
  PaginationInfo
} from '@crwd/types';

export class AuthService {
  constructor(private client: ApiClient) {}

  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    return this.client.post<AuthResponse>('/auth/login', credentials);
  }

  async register(data: RegisterData): Promise<AuthResponse> {
    return this.client.post<AuthResponse>('/auth/register', data);
  }

  async refreshToken(refreshToken: string): Promise<AuthResponse> {
    return this.client.post<AuthResponse>('/auth/refresh', { refreshToken });
  }

  async logout(): Promise<void> {
    return this.client.post<void>('/auth/logout');
  }

  async forgotPassword(email: string): Promise<void> {
    return this.client.post<void>('/auth/forgot-password', { email });
  }

  async resetPassword(token: string, newPassword: string): Promise<void> {
    return this.client.post<void>('/auth/reset-password', { token, newPassword });
  }

  async verifyEmail(token: string): Promise<void> {
    return this.client.post<void>('/auth/verify-email', { token });
  }
}

export class BarService {
  constructor(private client: ApiClient) {}

  async getBars(filters?: BarSearchFilters, pagination?: PaginationInfo): Promise<ApiResponse<Bar[]>> {
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
    
    return this.client.get<ApiResponse<Bar[]>>(`/bars?${params.toString()}`);
  }

  async getBar(id: string): Promise<Bar> {
    return this.client.get<Bar>(`/bars/${id}`);
  }

  async createBar(data: Partial<Bar>): Promise<Bar> {
    return this.client.post<Bar>('/bars', data);
  }

  async updateBar(id: string, data: Partial<Bar>): Promise<Bar> {
    return this.client.put<Bar>(`/bars/${id}`, data);
  }

  async deleteBar(id: string): Promise<void> {
    return this.client.delete<void>(`/bars/${id}`);
  }

  async uploadBarImages(id: string, files: File[]): Promise<Bar> {
    return this.client.uploadMultiple<Bar>(`/bars/${id}/images`, files);
  }
}

export class EventService {
  constructor(private client: ApiClient) {}

  async getEvents(filters?: EventSearchFilters, pagination?: PaginationInfo): Promise<ApiResponse<Event[]>> {
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
    
    return this.client.get<ApiResponse<Event[]>>(`/events?${params.toString()}`);
  }

  async getEvent(id: string): Promise<Event> {
    return this.client.get<Event>(`/events/${id}`);
  }

  async createEvent(data: Partial<Event>): Promise<Event> {
    return this.client.post<Event>('/events', data);
  }

  async updateEvent(id: string, data: Partial<Event>): Promise<Event> {
    return this.client.put<Event>(`/events/${id}`, data);
  }

  async deleteEvent(id: string): Promise<void> {
    return this.client.delete<void>(`/events/${id}`);
  }

  async registerForEvent(eventId: string): Promise<void> {
    return this.client.post<void>(`/events/${eventId}/register`);
  }

  async cancelEventRegistration(eventId: string): Promise<void> {
    return this.client.delete<void>(`/events/${eventId}/register`);
  }
}

export class UserService {
  constructor(private client: ApiClient) {}

  async getProfile(): Promise<User> {
    return this.client.get<User>('/users/profile');
  }

  async updateProfile(data: Partial<User>): Promise<User> {
    return this.client.put<User>('/users/profile', data);
  }

  async changePassword(currentPassword: string, newPassword: string): Promise<void> {
    return this.client.post<void>('/users/change-password', { currentPassword, newPassword });
  }

  async uploadAvatar(file: File): Promise<User> {
    return this.client.upload<User>('/users/avatar', file);
  }

  async deleteAccount(): Promise<void> {
    return this.client.delete<void>('/users/account');
  }
}

export class DrinkService {
  constructor(private client: ApiClient) {}

  async getDrinks(barId?: string, pagination?: PaginationInfo): Promise<ApiResponse<Drink[]>> {
    const params = new URLSearchParams();
    if (barId) {
      params.append('barId', barId);
    }
    if (pagination) {
      params.append('page', String(pagination.page));
      params.append('limit', String(pagination.limit));
    }
    
    return this.client.get<ApiResponse<Drink[]>>(`/drinks?${params.toString()}`);
  }

  async getDrink(id: string): Promise<Drink> {
    return this.client.get<Drink>(`/drinks/${id}`);
  }

  async createDrink(data: Partial<Drink>): Promise<Drink> {
    return this.client.post<Drink>('/drinks', data);
  }

  async updateDrink(id: string, data: Partial<Drink>): Promise<Drink> {
    return this.client.put<Drink>(`/drinks/${id}`, data);
  }

  async deleteDrink(id: string): Promise<void> {
    return this.client.delete<void>(`/drinks/${id}`);
  }
}

export class PaymentService {
  constructor(private client: ApiClient) {}

  async createPayment(data: Partial<Payment>): Promise<Payment> {
    return this.client.post<Payment>('/payments', data);
  }

  async getPayment(id: string): Promise<Payment> {
    return this.client.get<Payment>(`/payments/${id}`);
  }

  async getPayments(pagination?: PaginationInfo): Promise<ApiResponse<Payment[]>> {
    const params = new URLSearchParams();
    if (pagination) {
      params.append('page', String(pagination.page));
      params.append('limit', String(pagination.limit));
    }
    
    return this.client.get<ApiResponse<Payment[]>>(`/payments?${params.toString()}`);
  }

  async createSubscription(planId: string): Promise<Subscription> {
    return this.client.post<Subscription>('/subscriptions', { planId });
  }

  async getSubscription(id: string): Promise<Subscription> {
    return this.client.get<Subscription>(`/subscriptions/${id}`);
  }

  async cancelSubscription(id: string): Promise<Subscription> {
    return this.client.patch<Subscription>(`/subscriptions/${id}/cancel`);
  }
}

// Service factory
export class ApiServices {
  public auth: AuthService;
  public bars: BarService;
  public events: EventService;
  public users: UserService;
  public drinks: DrinkService;
  public payments: PaymentService;

  constructor(client: ApiClient) {
    this.auth = new AuthService(client);
    this.bars = new BarService(client);
    this.events = new EventService(client);
    this.users = new UserService(client);
    this.drinks = new DrinkService(client);
    this.payments = new PaymentService(client);
  }
}
