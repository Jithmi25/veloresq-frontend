import { apiService } from './api';
import { EmergencyRequest, CreateEmergencyRequest, ApiResponse } from '../types';

export class EmergencyService {
  async createEmergencyRequest(requestData: CreateEmergencyRequest): Promise<EmergencyRequest> {
    // TODO: BACKEND INTEGRATION - Replace with actual API call
    // const response = await apiService.post<EmergencyRequest>('/emergency', requestData);
    console.log('Create emergency request - Backend integration needed:', requestData);
    throw new Error('Backend integration needed for emergency request creation');
  }

  async getEmergencyRequest(id: string): Promise<EmergencyRequest> {
    // TODO: BACKEND INTEGRATION - Replace with actual API call
    // const response = await apiService.get<EmergencyRequest>(`/emergency/${id}`);
    console.log('Get emergency request - Backend integration needed:', id);
    throw new Error('Backend integration needed for emergency request retrieval');
  }

  async getUserEmergencyRequests(): Promise<EmergencyRequest[]> {
    // TODO: BACKEND INTEGRATION - Replace with actual API call
    // const response = await apiService.get<EmergencyRequest[]>('/emergency/user');
    console.log('Get user emergency requests - Backend integration needed');
    
    // HARDCODED DATA FOR TESTING
    return [];
  }

  async updateEmergencyStatus(id: string, status: EmergencyRequest['status']): Promise<EmergencyRequest> {
    // TODO: BACKEND INTEGRATION - Replace with actual API call
    console.log('Update emergency status - Backend integration needed:', id, status);
    throw new Error('Backend integration needed for emergency status update');
  }

  async cancelEmergencyRequest(id: string): Promise<EmergencyRequest> {
    // TODO: BACKEND INTEGRATION - Replace with actual API call
    console.log('Cancel emergency request - Backend integration needed:', id);
    throw new Error('Backend integration needed for emergency request cancellation');
  }

  async getEmergencyTeamLocation(requestId: string): Promise<{ latitude: number; longitude: number; estimatedArrival: string }> {
    // TODO: BACKEND INTEGRATION - Replace with actual API call
    console.log('Get emergency team location - Backend integration needed:', requestId);
    throw new Error('Backend integration needed for team location tracking');
  }

  async getNearbyEmergencyTeams(latitude: number, longitude: number): Promise<any[]> {
    // TODO: BACKEND INTEGRATION - Replace with actual API call
    console.log('Get nearby emergency teams - Backend integration needed:', latitude, longitude);
    
    // HARDCODED DATA FOR TESTING
    return [];
  }
}

export const emergencyService = new EmergencyService();