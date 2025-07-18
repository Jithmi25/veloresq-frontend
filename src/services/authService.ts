import { apiService } from './api';
import { User, LoginRequest, RegisterRequest, ApiResponse } from '../types';

export class AuthService {
  async login(credentials: LoginRequest): Promise<{ user: User; token: string }> {
    try {
      // TODO: BACKEND INTEGRATION - Replace with actual API call
      // const response = await apiService.post<{ user: User; token: string }>('/auth/login', credentials);
      
      // HARDCODED DATA FOR TESTING - Remove when backend is connected
      const mockUsers = [
        {
          id: '1',
          email: 'admin@veloresq.com',
          firstName: 'Admin',
          lastName: 'User',
          phoneNumber: '+94 77 123 4567',
          role: 'admin' as const,
          isVerified: true,
          createdAt: '2024-01-01T00:00:00Z',
          updatedAt: '2024-01-01T00:00:00Z'
        },
        {
          id: '2',
          email: 'customer@test.com',
          firstName: 'John',
          lastName: 'Doe',
          phoneNumber: '+94 77 234 5678',
          role: 'customer' as const,
          isVerified: true,
          createdAt: '2024-01-01T00:00:00Z',
          updatedAt: '2024-01-01T00:00:00Z'
        },
        {
          id: '3',
          email: 'garage@test.com',
          firstName: 'Garage',
          lastName: 'Owner',
          phoneNumber: '+94 77 345 6789',
          role: 'garage_owner' as const,
          isVerified: true,
          garageName: 'Test Garage',
          garageAddress: 'Test Address',
          createdAt: '2024-01-01T00:00:00Z',
          updatedAt: '2024-01-01T00:00:00Z'
        },
        {
          id: '4',
          email: 'battery@test.com',
          firstName: 'Rajesh',
          lastName: 'Kumar',
          phoneNumber: '+94 77 456 7890',
          role: 'garage_owner' as const,
          isVerified: true,
          garageName: 'PowerTech Solutions',
          garageAddress: 'No. 123, Galle Road, Colombo 03',
          businessLicense: 'BCO-2024-001',
          createdAt: '2024-01-01T00:00:00Z',
          updatedAt: '2024-01-01T00:00:00Z'
        }
      ];

      // Simulate login validation
      const user = mockUsers.find(u => u.email === credentials.email);
      if (!user || credentials.password !== 'password123') {
        throw new Error('Invalid email or password');
      }

      const mockToken = 'mock-jwt-token-' + user.id;
      const result = { user, token: mockToken };

      localStorage.setItem('authToken', result.token);
      localStorage.setItem('user', JSON.stringify(result.user));
      return result;
    } catch (error: any) {
      throw new Error(error.message || 'Login failed');
    }
  }

  async register(userData: RegisterRequest): Promise<{ user: User; token: string }> {
    try {
      // TODO: BACKEND INTEGRATION - Replace with actual API call
      // const response = await apiService.post<{ user: User; token: string }>('/auth/register', userData);
      
      // HARDCODED DATA FOR TESTING - Remove when backend is connected
      const newUser: User = {
        id: 'new-user-' + Date.now(),
        email: userData.email,
        firstName: userData.firstName,
        lastName: userData.lastName,
        phoneNumber: userData.phoneNumber,
        role: userData.role,
        isVerified: false,
        garageName: userData.garageName,
        garageAddress: userData.garageAddress,
        businessLicense: userData.businessLicense,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      const mockToken = 'mock-jwt-token-' + newUser.id;
      const result = { user: newUser, token: mockToken };

      localStorage.setItem('authToken', result.token);
      localStorage.setItem('user', JSON.stringify(result.user));
      return result;
    } catch (error: any) {
      throw new Error(error.message || 'Registration failed');
    }
  }

  async logout(): Promise<void> {
    try {
      // TODO: BACKEND INTEGRATION - Add actual logout API call
      // await apiService.post('/auth/logout');
      console.log('Logout - Backend integration needed');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
    }
  }

  async getCurrentUser(): Promise<User | null> {
    try {
      // TODO: BACKEND INTEGRATION - Replace with actual API call
      // const response = await apiService.get<User>('/auth/me');
      
      // HARDCODED DATA FOR TESTING - Use stored user data
      const storedUser = this.getStoredUser();
      if (storedUser && this.isAuthenticated()) {
        return storedUser;
      }
      return null;
    } catch (error) {
      console.error('Get current user error:', error);
      this.logout();
      return null;
    }
  }

  async forgotPassword(email: string): Promise<void> {
    // TODO: BACKEND INTEGRATION - Add forgot password API call
    // const response = await apiService.post('/auth/forgot-password', { email });
    console.log('Forgot password for:', email, '- Backend integration needed');
    
    // Simulate API delay for testing
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // For testing, we'll just log the action
    // In real implementation, this would send an email with reset link
  }

  async resetPassword(token: string, newPassword: string): Promise<void> {
    // TODO: BACKEND INTEGRATION - Add reset password API call
    // const response = await apiService.post('/auth/reset-password', { token, password: newPassword });
    console.log('Reset password - Backend integration needed');
    
    // Simulate API delay for testing
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // For testing, we'll just log the action
    // In real implementation, this would update the user's password
  }

  async verifyEmail(token: string): Promise<void> {
    // TODO: BACKEND INTEGRATION - Add email verification API call
    // const response = await apiService.post('/auth/verify-email', { token });
    console.log('Verify email - Backend integration needed');
  }

  getStoredUser(): User | null {
    try {
      const userStr = localStorage.getItem('user');
      return userStr ? JSON.parse(userStr) : null;
    } catch {
      return null;
    }
  }

  getStoredToken(): string | null {
    return localStorage.getItem('authToken');
  }

  isAuthenticated(): boolean {
    return !!this.getStoredToken();
  }
}

export const authService = new AuthService();