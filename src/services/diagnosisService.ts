import { apiService } from './api';
import { DiagnosisResult } from '../types';

export class DiagnosisService {
  async uploadAudioForDiagnosis(audioFile: File, vehicleInfo?: any, symptoms?: string): Promise<{ diagnosisId: string }> {
    try {
      const response = await apiService.uploadFile<{ diagnosisId: string }>('/diagnosis/upload', audioFile, {
        vehicleInfo,
        symptoms
      });
      
      if (response.success && response.data) {
        return response.data;
      }
      
      throw new Error(response.message || 'Failed to upload audio for diagnosis');
    } catch (error: any) {
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw new Error(error.message || 'Failed to upload audio for diagnosis');
    }
  }

  async getDiagnosisResult(diagnosisId: string): Promise<DiagnosisResult> {
    try {
      const response = await apiService.get<{ diagnosis: DiagnosisResult }>(`/diagnosis/${diagnosisId}/result`);
      
      if (response.success && response.data) {
        return response.data.diagnosis;
      }
      
      throw new Error(response.message || 'Failed to get diagnosis result');
    } catch (error: any) {
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw new Error(error.message || 'Failed to get diagnosis result');
    }
  }

  async getUserDiagnoses(page = 1, limit = 10): Promise<{ diagnoses: DiagnosisResult[]; pagination: any }> {
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
      });

      const response = await apiService.get<{ diagnoses: DiagnosisResult[]; pagination: any }>(`/diagnosis?${params}`);
      
      if (response.success && response.data) {
        return response.data;
      }
      
      throw new Error(response.message || 'Failed to get user diagnoses');
    } catch (error: any) {
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw new Error(error.message || 'Failed to get user diagnoses');
    }
  }

  async addDiagnosisFeedback(id: string, wasAccurate: boolean, rating?: number, comments?: string): Promise<DiagnosisResult> {
    try {
      const response = await apiService.put<{ diagnosis: DiagnosisResult }>(`/diagnosis/${id}/feedback`, {
        wasAccurate,
        rating,
        comments
      });
      
      if (response.success && response.data) {
        return response.data.diagnosis;
      }
      
      throw new Error(response.message || 'Failed to add feedback');
    } catch (error: any) {
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw new Error(error.message || 'Failed to add feedback');
    }
  }

  async deleteDiagnosis(id: string): Promise<void> {
    try {
      const response = await apiService.delete(`/diagnosis/${id}`);
      
      if (!response.success) {
        throw new Error(response.message || 'Failed to delete diagnosis');
      }
    } catch (error: any) {
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw new Error(error.message || 'Failed to delete diagnosis');
    }
  }

  // Check AI service health
  async checkAiServiceHealth(): Promise<boolean> {
    try {
      const response = await apiService.get('/diagnosis/health');
      return response.success;
    } catch (error) {
      console.error('AI service health check failed:', error);
      return false;
    }
  }
}

export const diagnosisService = new DiagnosisService();