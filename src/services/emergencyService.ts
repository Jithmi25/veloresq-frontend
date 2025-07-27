import { apiService } from './api';
import { EmergencyRequest, CreateEmergencyRequest } from '../types';

export class EmergencyService {
  async createEmergencyRequest(requestData: CreateEmergencyRequest): Promise<EmergencyRequest> {
    try {
      const response = await apiService.post<{ emergency: EmergencyRequest }>('/emergency', requestData);
      
      if (response.success && response.data) {
        return response.data.emergency;
      }
      
      throw new Error(response.message || 'Failed to create emergency request');
    } catch (error: any) {
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw new Error(error.message || 'Failed to create emergency request');
    }
  }

  async getEmergencyRequest(id: string): Promise<EmergencyRequest> {
    try {
      const response = await apiService.get<{ emergency: EmergencyRequest }>(`/emergency/${id}`);
      
      if (response.success && response.data) {
        return response.data.emergency;
      }
      
      throw new Error(response.message || 'Emergency request not found');
    } catch (error: any) {
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw new Error(error.message || 'Failed to get emergency request');
    }
  }

  async getUserEmergencyRequests(): Promise<EmergencyRequest[]> {
    try {
      const response = await apiService.get<{ emergencies: EmergencyRequest[] }>('/emergency');
      
      if (response.success && response.data) {
        return response.data.emergencies;
      }
      
      throw new Error(response.message || 'Failed to get emergency requests');
    } catch (error: any) {
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw new Error(error.message || 'Failed to get emergency requests');
    }
  }

  async updateEmergencyStatus(id: string, status: EmergencyRequest['status']): Promise<EmergencyRequest> {
    try {
      const response = await apiService.put<{ emergency: EmergencyRequest }>(`/emergency/${id}/status`, {
        status
      });
      
      if (response.success && response.data) {
        return response.data.emergency;
      }
      
      throw new Error(response.message || 'Failed to update emergency status');
    } catch (error: any) {
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw new Error(error.message || 'Failed to update emergency status');
    }
  }

  async cancelEmergencyRequest(id: string, reason?: string): Promise<EmergencyRequest> {
    try {
      const response = await apiService.put<{ emergency: EmergencyRequest }>(`/emergency/${id}/cancel`, {
        reason
      });
      
      if (response.success && response.data) {
        return response.data.emergency;
      }
      
      throw new Error(response.message || 'Failed to cancel emergency request');
    } catch (error: any) {
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw new Error(error.message || 'Failed to cancel emergency request');
    }
  }

  async getEmergencyTeamLocation(requestId: string): Promise<{ latitude: number; longitude: number; estimatedArrival: string }> {
    try {
      return {
        latitude: 6.9271,
        longitude: 79.8612,
        estimatedArrival: '15 minutes'
      };
    } catch (error: any) {
      throw new Error(error.message || 'Failed to get team location');
    }
  }

  async getNearbyEmergencyTeams(latitude: number, longitude: number): Promise<any[]> {
    try {
      const params = new URLSearchParams({
        latitude: latitude.toString(),
        longitude: longitude.toString(),
      });

      const response = await apiService.get<{ teams: any[] }>(`/emergency/nearby?${params}`);
      
      if (response.success && response.data) {
        return response.data.teams;
      }
      
      return [];
    } catch (error: any) {
      console.error('Failed to get nearby emergency teams:', error);
      return [];
    }
  }
}

export const emergencyService = new EmergencyService();