import React, { createContext, useContext, useEffect, ReactNode } from 'react';
import { useAuthStore } from '../store/authStore';

interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: any;
  checkAuthStatus: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const { isAuthenticated, isLoading, user, checkAuthStatus } = useAuthStore();

  useEffect(() => {
    // Check authentication status when app starts
    checkAuthStatus();
  }, [checkAuthStatus]);

  const value: AuthContextType = {
    isAuthenticated,
    isLoading,
    user,
    checkAuthStatus,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

