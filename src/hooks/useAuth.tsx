import { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import { User } from '../types';
import { authService } from '../services/authService';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string, expectedRole?: string) => Promise<void>;
  register: (userData: any) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    initializeAuth();
  }, []);

  const initializeAuth = async () => {
    try {
      const storedUser = authService.getStoredUser();
      if (storedUser && authService.isAuthenticated()) {
        // Verify token is still valid
        const currentUser = await authService.getCurrentUser();
        setUser(currentUser);
      }
    } catch (error) {
      console.error('Auth initialization error:', error);
      await authService.logout();
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string, expectedRole?: string) => {
    try {
      const { user: loggedInUser } = await authService.login({ email, password });
      
      // Verify role matches expected role if provided
      if (expectedRole && loggedInUser.role !== expectedRole) {
        throw new Error(`Access denied. This account is registered as ${loggedInUser.role.replace('_', ' ')}, not ${expectedRole.replace('_', ' ')}.`);
      }
      
      setUser(loggedInUser);
    } catch (error) {
      throw error;
    }
  };

  const register = async (userData: any) => {
    try {
      const { user: registeredUser } = await authService.register(userData);
      setUser(registeredUser);
    } catch (error) {
      throw error;
    }
  };

  const logout = async () => {
    try {
      await authService.logout();
      setUser(null);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const refreshUser = async () => {
    try {
      const currentUser = await authService.getCurrentUser();
      setUser(currentUser);
    } catch (error) {
      console.error('Refresh user error:', error);
      await logout();
    }
  };

  const value: AuthContextType = {
    user,
    isLoading,
    isAuthenticated: !!user,
    login,
    register,
    logout,
    refreshUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};