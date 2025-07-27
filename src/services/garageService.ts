import { apiService } from './api';
import { Garage, SearchFilters, SearchResult, QueueStatus } from '../types';

export class GarageService {
  async searchGarages(filters: SearchFilters, page = 1, limit = 10): Promise<SearchResult> {
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
      });

      if (filters.location) {
        params.append('latitude', filters.location.latitude.toString());
        params.append('longitude', filters.location.longitude.toString());
        params.append('radius', filters.location.radius.toString());
      }

      if (filters.services?.length) {
        params.append('services', filters.services.join(','));
      }

      if (filters.rating) {
        params.append('minRating', filters.rating.toString());
      }

      if (filters.priceRange) {
        params.append('minPrice', filters.priceRange.min.toString());
        params.append('maxPrice', filters.priceRange.max.toString());
      }

      if (filters.availability) {
        params.append('availability', filters.availability);
      }

      const response = await apiService.get<SearchResult>(`/garages?${params}`);
      
      if (response.success && response.data) {
        return response.data;
      }
      
      throw new Error(response.message || 'Failed to search garages');
    } catch (error: any) {
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw new Error(error.message || 'Failed to search garages');
    }
  }

  async getGarageById(id: string): Promise<Garage> {
    try {
      const response = await apiService.get<{ garage: Garage }>(`/garages/${id}`);
      
      if (response.success && response.data) {
        return response.data.garage;
      }
      
      throw new Error(response.message || 'Garage not found');
    } catch (error: any) {
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw new Error(error.message || 'Failed to get garage');
    }
  }

  async getFeaturedGarages(): Promise<Garage[]> {
    try {
      const response = await apiService.get<{ garages: Garage[] }>('/garages/featured');
      
      if (response.success && response.data) {
        return response.data.garages;
      }
      
      throw new Error(response.message || 'Failed to get featured garages');
    } catch (error: any) {
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw new Error(error.message || 'Failed to get featured garages');
    }
  }

  async getAllGarages(): Promise<Garage[]> {
    try {
      const response = await apiService.get<{ garages: Garage[] }>('/garages/all');
      
      if (response.success && response.data) {
        return response.data.garages;
      }
      
      throw new Error(response.message || 'Failed to get all garages');
    } catch (error: any) {
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw new Error(error.message || 'Failed to get all garages');
    }
  }

  async getNearbyGarages(latitude: number, longitude: number, radius = 10): Promise<Garage[]> {
    try {
      const params = new URLSearchParams({
        latitude: latitude.toString(),
        longitude: longitude.toString(),
        radius: radius.toString(),
      });

      const response = await apiService.get<{ garages: Garage[] }>(`/garages/nearby?${params}`);
      
      if (response.success && response.data) {
        return response.data.garages;
      }
      
      throw new Error(response.message || 'Failed to get nearby garages');
    } catch (error: any) {
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw new Error(error.message || 'Failed to get nearby garages');
    }
  }

  async getGarageQueue(garageId: string): Promise<QueueStatus> {
    try {
      const response = await apiService.get<QueueStatus>(`/garages/${garageId}/queue`);
      
      if (response.success && response.data) {
        return response.data;
      }
      
      throw new Error(response.message || 'Failed to get queue status');
    } catch (error: any) {
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw new Error(error.message || 'Failed to get queue status');
    }
  }

  async getGarageServices(garageId: string) {
    try {
      const garage = await this.getGarageById(garageId);
      return garage.services;
    } catch (error: any) {
      throw new Error(error.message || 'Failed to get garage services');
    }
  }

  async getGarageReviews(garageId: string, page = 1, limit = 10) {
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
      });

      const response = await apiService.get(`/garages/${garageId}/reviews?${params}`);
      
      if (response.success && response.data) {
        return response.data;
      }
      
      throw new Error(response.message || 'Failed to get garage reviews');
    } catch (error: any) {
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw new Error(error.message || 'Failed to get garage reviews');
    }
  }

  // Garage owner methods
  async createGarage(garageData: Partial<Garage>): Promise<Garage> {
    try {
      const response = await apiService.post<{ garage: Garage }>('/garages', garageData);
      
      if (response.success && response.data) {
        return response.data.garage;
      }
      
      throw new Error(response.message || 'Failed to create garage');
    } catch (error: any) {
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw new Error(error.message || 'Failed to create garage');
    }
  }

  async updateGarage(id: string, garageData: Partial<Garage>): Promise<Garage> {
    try {
      const response = await apiService.put<{ garage: Garage }>(`/garages/${id}`, garageData);
      
      if (response.success && response.data) {
        return response.data.garage;
      }
      
      throw new Error(response.message || 'Failed to update garage');
    } catch (error: any) {
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw new Error(error.message || 'Failed to update garage');
    }
  }

  async deleteGarage(id: string): Promise<void> {
    try {
      const response = await apiService.delete(`/garages/${id}`);
      
      if (!response.success) {
        throw new Error(response.message || 'Failed to delete garage');
      }
    } catch (error: any) {
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw new Error(error.message || 'Failed to delete garage');
    }
  }

  async updateQueueStatus(garageId: string, queueData: Partial<QueueStatus>): Promise<QueueStatus> {
    try {
      const response = await apiService.put<QueueStatus>(`/garages/${garageId}/queue`, queueData);
      
      if (response.success && response.data) {
        return response.data;
      }
      
      throw new Error(response.message || 'Failed to update queue status');
    } catch (error: any) {
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw new Error(error.message || 'Failed to update queue status');
    }
  }
}

export const garageService = new GarageService();