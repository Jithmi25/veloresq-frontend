import { apiService } from './api';
import { DiagnosisRequest, DiagnosisResult, ApiResponse } from '../types';

export class DiagnosisService {
  async uploadAudioForDiagnosis(audioFile: File, vehicleInfo?: any, symptoms?: string): Promise<{ diagnosisId: string }> {
    // TODO: BACKEND INTEGRATION - Replace with actual AI service call
    /*
    const formData = new FormData();
    formData.append('audio', audioFile);
    
    if (vehicleInfo) {
      formData.append('vehicleInfo', JSON.stringify(vehicleInfo));
    }
    
    if (symptoms) {
      formData.append('symptoms', symptoms);
    }

    const response = await apiService.getAiApiInstance().post('/diagnose', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    
    return response.data;
    */
    
    console.log('Upload audio for diagnosis - Backend integration needed:', audioFile.name, vehicleInfo, symptoms);
    
    // HARDCODED DATA FOR TESTING
    return {
      diagnosisId: 'mock-diagnosis-' + Date.now()
    };
  }

  async getDiagnosisResult(diagnosisId: string): Promise<DiagnosisResult> {
    // TODO: BACKEND INTEGRATION - Replace with actual AI service call
    // const response = await apiService.getAiApiInstance().get(`/diagnosis/${diagnosisId}`);
    console.log('Get diagnosis result - Backend integration needed:', diagnosisId);
    
    // HARDCODED DATA FOR TESTING
    return {
      id: diagnosisId,
      confidence: 87,
      issue: 'Engine Belt Issues',
      severity: 'medium',
      description: 'Based on the audio analysis, your vehicle likely has a worn or loose serpentine belt. This is causing the squealing sound you recorded.',
      recommendations: [
        'Inspect serpentine belt for cracks or fraying',
        'Check belt tension and alignment',
        'Replace belt if necessary',
        'Inspect belt pulleys for wear'
      ],
      estimatedCost: { min: 3500, max: 8500 },
      createdAt: new Date().toISOString()
    };
  }

  async getUserDiagnoses(page = 1, limit = 10): Promise<{ diagnoses: DiagnosisResult[]; total: number }> {
    // TODO: BACKEND INTEGRATION - Replace with actual API call
    console.log('Get user diagnoses - Backend integration needed');
    
    // HARDCODED DATA FOR TESTING
    return {
      diagnoses: [],
      total: 0
    };
  }

  async saveDiagnosisResult(diagnosisData: Partial<DiagnosisResult>): Promise<DiagnosisResult> {
    // TODO: BACKEND INTEGRATION - Replace with actual API call
    console.log('Save diagnosis result - Backend integration needed:', diagnosisData);
    throw new Error('Backend integration needed for diagnosis saving');
  }

  async deleteDiagnosis(id: string): Promise<void> {
    // TODO: BACKEND INTEGRATION - Replace with actual API call
    console.log('Delete diagnosis - Backend integration needed:', id);
    throw new Error('Backend integration needed for diagnosis deletion');
  }

  // Check AI service health
  async checkAiServiceHealth(): Promise<boolean> {
    // TODO: BACKEND INTEGRATION - Replace with actual AI service health check
    // const response = await apiService.getAiApiInstance().get('/health');
    console.log('Check AI service health - Backend integration needed');
    
    // HARDCODED DATA FOR TESTING
    return true;
  }
}

export const diagnosisService = new DiagnosisService();