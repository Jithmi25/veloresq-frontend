import axios, { AxiosInstance, AxiosResponse } from 'axios';
import { ApiResponse } from '../types';

class ApiService {
  private api: AxiosInstance;
  private aiApi: AxiosInstance;

  constructor() {
    // TODO: BACKEND INTEGRATION - Update these URLs to match your actual backend
    // Main backend API
    this.api = axios.create({
      baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api',
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // AI Audio Service API
    this.aiApi = axios.create({
      baseURL: import.meta.env.VITE_AI_API_BASE_URL || 'http://localhost:5000',
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
        // TODO: BACKEND INTEGRATION - Handle actual error responses
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
    // TODO: BACKEND INTEGRATION - Remove this when backend is connected
    console.log('API GET call to:', endpoint, '- Backend integration needed');
    throw new Error('Backend integration needed');
    
    // Uncomment when backend is ready:
    // const response: AxiosResponse<ApiResponse<T>> = await this.api.get(endpoint);
    // return response.data;
  }

  async post<T>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
    // TODO: BACKEND INTEGRATION - Remove this when backend is connected
    console.log('API POST call to:', endpoint, 'with data:', data, '- Backend integration needed');
    throw new Error('Backend integration needed');
    
    // Uncomment when backend is ready:
    // const response: AxiosResponse<ApiResponse<T>> = await this.api.post(endpoint, data);
    // return response.data;
  }

  async put<T>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
    // TODO: BACKEND INTEGRATION - Remove this when backend is connected
    console.log('API PUT call to:', endpoint, 'with data:', data, '- Backend integration needed');
    throw new Error('Backend integration needed');
    
    // Uncomment when backend is ready:
    // const response: AxiosResponse<ApiResponse<T>> = await this.api.put(endpoint, data);
    // return response.data;
  }

  async delete<T>(endpoint: string): Promise<ApiResponse<T>> {
    // TODO: BACKEND INTEGRATION - Remove this when backend is connected
    console.log('API DELETE call to:', endpoint, '- Backend integration needed');
    throw new Error('Backend integration needed');
    
    // Uncomment when backend is ready:
    // const response: AxiosResponse<ApiResponse<T>> = await this.api.delete(endpoint);
    // return response.data;
  }

  // File upload method
  async uploadFile<T>(endpoint: string, file: File, additionalData?: any): Promise<ApiResponse<T>> {
    // TODO: BACKEND INTEGRATION - Remove this when backend is connected
    console.log('API FILE UPLOAD call to:', endpoint, 'with file:', file.name, '- Backend integration needed');
    throw new Error('Backend integration needed');
    
    // Uncomment when backend is ready:
    /*
    const formData = new FormData();
    formData.append('file', file);
    
    if (additionalData) {
      Object.keys(additionalData).forEach(key => {
        formData.append(key, JSON.stringify(additionalData[key]));
      });
    }

    const response: AxiosResponse<ApiResponse<T>> = await this.api.post(endpoint, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
    */
  }

  // AI Audio Service methods
  async uploadAudioForDiagnosis(file: File, vehicleInfo?: any): Promise<any> {
    // TODO: BACKEND INTEGRATION - Remove this when AI service is connected
    console.log('AI Audio upload:', file.name, vehicleInfo, '- Backend integration needed');
    throw new Error('AI service backend integration needed');
    
    // Uncomment when AI service is ready:
    /*
    const formData = new FormData();
    formData.append('audio', file);
    
    if (vehicleInfo) {
      formData.append('vehicleInfo', JSON.stringify(vehicleInfo));
    }

    const response = await this.aiApi.post('/diagnose', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
    */
  }

  async getDiagnosisResult(diagnosisId: string): Promise<any> {
    // TODO: BACKEND INTEGRATION - Remove this when AI service is connected
    console.log('Get AI diagnosis result:', diagnosisId, '- Backend integration needed');
    throw new Error('AI service backend integration needed');
    
    // Uncomment when AI service is ready:
    // const response = await this.aiApi.get(`/diagnosis/${diagnosisId}`);
    // return response.data;
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