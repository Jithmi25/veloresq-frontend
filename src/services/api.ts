import axios, { AxiosInstance, AxiosResponse } from 'axios';
import { ApiResponse } from '../types';

class ApiService {
  private api: AxiosInstance;
  private aiApi: AxiosInstance;

  constructor() {
    // Main backend API
    this.api = axios.create({
      baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5008/api',
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // AI Audio Service API (can be same backend for now)
    this.aiApi = axios.create({
      baseURL: import.meta.env.VITE_AI_API_BASE_URL || 'http://localhost:5008/api',
      timeout: 30000, // Longer timeout for AI processing
    });

    // Request interceptor to add auth token
    this.api.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem('authToken');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response interceptor for error handling
    this.api.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          localStorage.removeItem('authToken');
          localStorage.removeItem('user');
          window.location.href = '/login';
        }
        return Promise.reject(error);
      }
    );

    // AI API request interceptor
    this.aiApi.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem('authToken');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );
  }

  // Generic API methods
  async get<T>(endpoint: string): Promise<ApiResponse<T>> {
    const response: AxiosResponse<ApiResponse<T>> = await this.api.get(endpoint);
    return response.data;
  }

  async post<T>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
    const response: AxiosResponse<ApiResponse<T>> = await this.api.post(endpoint, data);
    return response.data;
  }

  async put<T>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
    const response: AxiosResponse<ApiResponse<T>> = await this.api.put(endpoint, data);
    return response.data;
  }

  async delete<T>(endpoint: string): Promise<ApiResponse<T>> {
    const response: AxiosResponse<ApiResponse<T>> = await this.api.delete(endpoint);
    return response.data;
  }

  // File upload method
  async uploadFile<T>(endpoint: string, file: File, additionalData?: any): Promise<ApiResponse<T>> {
    const formData = new FormData();
    formData.append('audio', file);
    
    if (additionalData) {
      Object.keys(additionalData).forEach(key => {
        if (typeof additionalData[key] === 'object') {
          formData.append(key, JSON.stringify(additionalData[key]));
        } else {
          formData.append(key, additionalData[key]);
        }
      });
    }

    const response: AxiosResponse<ApiResponse<T>> = await this.api.post(endpoint, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  }

  // AI Audio Service methods
  async uploadAudioForDiagnosis(file: File, vehicleInfo?: any, symptoms?: string): Promise<any> {
    const formData = new FormData();
    formData.append('audio', file);
    
    if (vehicleInfo) {
      formData.append('vehicleInfo', JSON.stringify(vehicleInfo));
    }
    
    if (symptoms) {
      formData.append('symptoms', symptoms);
    }

    const response = await this.aiApi.post('/diagnosis/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  }

  async getDiagnosisResult(diagnosisId: string): Promise<any> {
    const response = await this.aiApi.get(`/diagnosis/${diagnosisId}/result`);
    return response.data;
  }

  // Get API instance for direct use if needed
  getApiInstance(): AxiosInstance {
    return this.api;
  }

  getAiApiInstance(): AxiosInstance {
    return this.aiApi;
  }
}

export const apiService = new ApiService();
export default apiService;