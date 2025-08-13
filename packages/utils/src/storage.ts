export const storage = {
  // Local Storage
  setLocal: (key: string, value: any): void => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error('Error saving to localStorage:', error);
    }
  },

  getLocal: <T>(key: string, defaultValue?: T): T | null => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue || null;
    } catch (error) {
      console.error('Error reading from localStorage:', error);
      return defaultValue || null;
    }
  },

  removeLocal: (key: string): void => {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error('Error removing from localStorage:', error);
    }
  },

  clearLocal: (): void => {
    try {
      localStorage.clear();
    } catch (error) {
      console.error('Error clearing localStorage:', error);
    }
  },

  // Session Storage
  setSession: (key: string, value: any): void => {
    try {
      sessionStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error('Error saving to sessionStorage:', error);
    }
  },

  getSession: <T>(key: string, defaultValue?: T): T | null => {
    try {
      const item = sessionStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue || null;
    } catch (error) {
      console.error('Error reading from sessionStorage:', error);
      return defaultValue || null;
    }
  },

  removeSession: (key: string): void => {
    try {
      sessionStorage.removeItem(key);
    } catch (error) {
      console.error('Error removing from sessionStorage:', error);
    }
  },

  clearSession: (): void => {
    try {
      sessionStorage.clear();
    } catch (error) {
      console.error('Error clearing sessionStorage:', error);
    }
  }
};

// Auth storage helpers
export const authStorage = {
  setToken: (token: string): void => {
    storage.setLocal('auth_token', token);
  },

  getToken: (): string | null => {
    return storage.getLocal<string>('auth_token');
  },

  removeToken: (): void => {
    storage.removeLocal('auth_token');
  },

  setRefreshToken: (refreshToken: string): void => {
    storage.setLocal('refresh_token', refreshToken);
  },

  getRefreshToken: (): string | null => {
    return storage.getLocal<string>('refresh_token');
  },

  removeRefreshToken: (): void => {
    storage.removeLocal('refresh_token');
  },

  setUser: (user: any): void => {
    storage.setLocal('user', user);
  },

  getUser: (): any => {
    return storage.getLocal('user');
  },

  removeUser: (): void => {
    storage.removeLocal('user');
  },

  clearAuth: (): void => {
    storage.removeLocal('auth_token');
    storage.removeLocal('refresh_token');
    storage.removeLocal('user');
  }
};

// Settings storage helpers
export const settingsStorage = {
  setTheme: (theme: 'light' | 'dark'): void => {
    storage.setLocal('theme', theme);
  },

  getTheme: (): 'light' | 'dark' => {
    return storage.getLocal<'light' | 'dark'>('theme', 'light');
  },

  setLanguage: (language: string): void => {
    storage.setLocal('language', language);
  },

  getLanguage: (): string => {
    return storage.getLocal<string>('language', 'en');
  },

  setNotifications: (enabled: boolean): void => {
    storage.setLocal('notifications_enabled', enabled);
  },

  getNotifications: (): boolean => {
    return storage.getLocal<boolean>('notifications_enabled', true);
  }
};
