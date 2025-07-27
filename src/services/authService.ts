import { apiService } from './api';
import { User, LoginRequest, RegisterRequest, Facility, CreateFacilityRequest } from '../types';

export class AuthService {
  async login(credentials: LoginRequest): Promise<{ user: User; token: string }> {
    try {
      const response = await apiService.post<{ user: User; token: string }>('/auth/login', {
        email: credentials.email,
        password: credentials.password,
        role: credentials.role
      });
      
      if (response.success && response.data) {
        localStorage.setItem('authToken', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
        return response.data;
      }
      
      throw new Error(response.message || 'Login failed');
    } catch (error: any) {
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw new Error(error.message || 'Login failed');
    }
  }

  async register(userData: RegisterRequest): Promise<{ user: User; token: string }> {
    try {
      const response = await apiService.post<{ user: User; token: string }>('/auth/register', userData);
      
      if (response.success && response.data) {
        localStorage.setItem('authToken', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
        return response.data;
      }
      
      throw new Error(response.message || 'Registration failed');
    } catch (error: any) {
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw new Error(error.message || 'Registration failed');
    }
  }

  async logout(): Promise<void> {
    try {
      await apiService.post('/auth/logout');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
    }
  }

  async getCurrentUser(): Promise<User | null> {
    try {
      const response = await apiService.get<{ user: User }>('/auth/me');
      
      if (response.success && response.data) {
        localStorage.setItem('user', JSON.stringify(response.data.user));
        return response.data.user;
      }
      
      return null;
    } catch (error) {
      console.error('Get current user error:', error);
      this.logout();
      return null;
    }
  }

  async forgotPassword(email: string): Promise<void> {
    try {
      const response = await apiService.post('/auth/forgot-password', { email });
      
      if (!response.success) {
        throw new Error(response.message || 'Failed to send reset email');
      }
    } catch (error: any) {
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw new Error(error.message || 'Failed to send reset email');
    }
  }

  async resetPassword(token: string, newPassword: string): Promise<void> {
    try {
      const response = await apiService.post('/auth/reset-password', { 
        token, 
        password: newPassword 
      });
      
      if (!response.success) {
        throw new Error(response.message || 'Failed to reset password');
      }
    } catch (error: any) {
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw new Error(error.message || 'Failed to reset password');
    }
  }

  async verifyEmail(token: string): Promise<void> {
    try {
      const response = await apiService.post('/auth/verify-email', { token });
      
      if (!response.success) {
        throw new Error(response.message || 'Email verification failed');
      }
    } catch (error: any) {
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw new Error(error.message || 'Email verification failed');
    }
  }

  async updateProfile(profileData: Partial<User>): Promise<User> {
    try {
      const response = await apiService.put<{ user: User }>('/users/profile', profileData);
      
      if (response.success && response.data) {
        localStorage.setItem('user', JSON.stringify(response.data.user));
        return response.data.user;
      }
      
      throw new Error(response.message || 'Failed to update profile');
    } catch (error: any) {
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw new Error(error.message || 'Failed to update profile');
    }
  }

  async changePassword(currentPassword: string, newPassword: string): Promise<void> {
    try {
      const response = await apiService.put('/users/change-password', {
        currentPassword,
        newPassword
      });
      
      if (!response.success) {
        throw new Error(response.message || 'Failed to change password');
      }
    } catch (error: any) {
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw new Error(error.message || 'Failed to change password');
    }
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

export class FacilityService {
  async getGarageFacilities(): Promise<{ facilities: Facility[] }> {
    try {
      const response = await apiService.get<{ facilities: Facility[] }>('/facilities');
      
      if (response.success && response.data) {
        return response.data;
      }
      
      throw new Error(response.message || 'Failed to get facilities');
    } catch (error: any) {
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw new Error(error.message || 'Failed to get facilities');
    }
  }

  async addFacility(facilityData: CreateFacilityRequest): Promise<{ facility: Facility }> {
    try {
      const response = await apiService.post<{ facility: Facility }>('/facilities', facilityData);
      
      if (response.success && response.data) {
        return response.data;
      }
      
      throw new Error(response.message || 'Failed to add facility');
    } catch (error: any) {
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw new Error(error.message || 'Failed to add facility');
    }
  }

  async deleteFacility(id: string): Promise<void> {
    try {
      const response = await apiService.delete(`/facilities/${id}`);
      
      if (!response.success) {
        throw new Error(response.message || 'Failed to delete facility');
      }
    } catch (error: any) {
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw new Error(error.message || 'Failed to delete facility');
    }
  }

  async updateFacilityStatus(id: string, isActive: boolean): Promise<Facility> {
    try {
      const response = await apiService.put<{ facility: Facility }>(`/facilities/${id}`, { isActive });
      
      if (response.success && response.data) {
        return response.data.facility;
      }
      
      throw new Error(response.message || 'Failed to update facility status');
    } catch (error: any) {
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw new Error(error.message || 'Failed to update facility status');
    }
  }
}

export class UserService {
  async updateUserProfile(profileData: Partial<User>): Promise<User> {
    try {
      const response = await apiService.put<{ user: User }>('/users/profile', profileData);
      
      if (response.success && response.data) {
        localStorage.setItem('user', JSON.stringify(response.data.user));
        return response.data.user;
      }
      
      throw new Error(response.message || 'Failed to update profile');
    } catch (error: any) {
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw new Error(error.message || 'Failed to update profile');
    }
  }
}

export const authService = new AuthService();
export const facilityService = new FacilityService();
export const userService = new UserService();