import { apiService } from './api';

export class AdminService {
  async getDashboardStats(): Promise<any> {
    try {
      const response = await apiService.get('/admin/dashboard');
      
      if (response.success && response.data) {
        return response.data;
      }
      
      throw new Error(response.message || 'Failed to get dashboard stats');
    } catch (error: any) {
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw new Error(error.message || 'Failed to get dashboard stats');
    }
  }

  async getAnalytics(startDate?: string, endDate?: string, period = 'daily'): Promise<any> {
    try {
      const params = new URLSearchParams({ period });
      
      if (startDate) params.append('startDate', startDate);
      if (endDate) params.append('endDate', endDate);

      const response = await apiService.get(`/admin/analytics?${params}`);
      
      if (response.success && response.data) {
        return response.data;
      }
      
      throw new Error(response.message || 'Failed to get analytics');
    } catch (error: any) {
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw new Error(error.message || 'Failed to get analytics');
    }
  }

  async getSystemHealth(): Promise<any> {
    try {
      const response = await apiService.get('/admin/health');
      
      if (response.success && response.data) {
        return response.data;
      }
      
      throw new Error(response.message || 'Failed to get system health');
    } catch (error: any) {
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw new Error(error.message || 'Failed to get system health');
    }
  }

  async getRecentActivities(limit = 20): Promise<any> {
    try {
      const params = new URLSearchParams({ limit: limit.toString() });
      const response = await apiService.get(`/admin/activities?${params}`);
      
      if (response.success && response.data) {
        return response.data;
      }
      
      throw new Error(response.message || 'Failed to get recent activities');
    } catch (error: any) {
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw new Error(error.message || 'Failed to get recent activities');
    }
  }

  async getAllUsers(page = 1, limit = 10, filters?: any): Promise<any> {
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
      });

      if (filters) {
        Object.keys(filters).forEach(key => {
          if (filters[key]) {
            params.append(key, filters[key]);
          }
        });
      }

      const response = await apiService.get(`/users?${params}`);
      
      if (response.success && response.data) {
        return response.data;
      }
      
      throw new Error(response.message || 'Failed to get users');
    } catch (error: any) {
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw new Error(error.message || 'Failed to get users');
    }
  }

  async updateUser(userId: string, userData: any): Promise<any> {
    try {
      const response = await apiService.put(`/users/${userId}`, userData);
      
      if (response.success && response.data) {
        return response.data;
      }
      
      throw new Error(response.message || 'Failed to update user');
    } catch (error: any) {
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw new Error(error.message || 'Failed to update user');
    }
  }

  async deleteUser(userId: string): Promise<void> {
    try {
      const response = await apiService.delete(`/users/${userId}`);
      
      if (!response.success) {
        throw new Error(response.message || 'Failed to delete user');
      }
    } catch (error: any) {
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw new Error(error.message || 'Failed to delete user');
    }
  }
}

export const adminService = new AdminService();