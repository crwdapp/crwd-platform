import AsyncStorage from '@react-native-async-storage/async-storage';

const TOKEN_KEY = 'auth_token';
const REFRESH_TOKEN_KEY = 'refresh_token';
const USER_KEY = 'user_data';

export interface AuthTokens {
  token: string;
  refreshToken: string;
  expiresAt: string;
}

export interface UserData {
  id: string;
  email: string;
  role: string;
  isVerified: boolean;
  isActive: boolean;
  firstName?: string;
  lastName?: string;
}

export class TokenService {
  // Store authentication tokens
  static async storeTokens(tokens: AuthTokens): Promise<void> {
    try {
      await AsyncStorage.setItem(TOKEN_KEY, tokens.token);
      await AsyncStorage.setItem(REFRESH_TOKEN_KEY, tokens.refreshToken);
      await AsyncStorage.setItem('token_expires_at', tokens.expiresAt);
    } catch (error) {
      console.error('Error storing tokens:', error);
    }
  }

  // Get stored access token
  static async getToken(): Promise<string | null> {
    try {
      return await AsyncStorage.getItem(TOKEN_KEY);
    } catch (error) {
      console.error('Error getting token:', error);
      return null;
    }
  }

  // Get stored refresh token
  static async getRefreshToken(): Promise<string | null> {
    try {
      return await AsyncStorage.getItem(REFRESH_TOKEN_KEY);
    } catch (error) {
      console.error('Error getting refresh token:', error);
      return null;
    }
  }

  // Check if token is expired
  static async isTokenExpired(): Promise<boolean> {
    try {
      const expiresAt = await AsyncStorage.getItem('token_expires_at');
      if (!expiresAt) return true;
      
      const expirationDate = new Date(expiresAt);
      return new Date() > expirationDate;
    } catch (error) {
      console.error('Error checking token expiration:', error);
      return true;
    }
  }

  // Store user data
  static async storeUser(user: UserData): Promise<void> {
    try {
      await AsyncStorage.setItem(USER_KEY, JSON.stringify(user));
    } catch (error) {
      console.error('Error storing user data:', error);
    }
  }

  // Get stored user data
  static async getUser(): Promise<UserData | null> {
    try {
      const userData = await AsyncStorage.getItem(USER_KEY);
      return userData ? JSON.parse(userData) : null;
    } catch (error) {
      console.error('Error getting user data:', error);
      return null;
    }
  }

  // Clear all authentication data
  static async clearAuthData(): Promise<void> {
    try {
      await AsyncStorage.multiRemove([
        TOKEN_KEY,
        REFRESH_TOKEN_KEY,
        'token_expires_at',
        USER_KEY,
      ]);
    } catch (error) {
      console.error('Error clearing auth data:', error);
    }
  }

  // Check if user is authenticated
  static async isAuthenticated(): Promise<boolean> {
    try {
      const token = await this.getToken();
      const isExpired = await this.isTokenExpired();
      return !!(token && !isExpired);
    } catch (error) {
      console.error('Error checking authentication:', error);
      return false;
    }
  }
}
