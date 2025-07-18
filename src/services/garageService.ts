import { apiService } from './api';
import { Garage, SearchFilters, SearchResult, QueueStatus, ApiResponse } from '../types';

export class GarageService {
  async searchGarages(filters: SearchFilters, page = 1, limit = 10): Promise<SearchResult> {
    // TODO: BACKEND INTEGRATION - Replace with actual API call
    /*
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

    const response = await apiService.get<SearchResult>(`/garages/search?${params}`);
    
    if (response.success && response.data) {
      return response.data;
    }
    
    throw new Error(response.message || 'Failed to search garages');
    */

    // HARDCODED DATA FOR TESTING - Remove when backend is connected
    console.log('Search garages with filters:', filters, '- Backend integration needed');
    return this.getMockGarages(filters, page, limit);
  }

  private getMockGarages(filters: SearchFilters, page: number, limit: number): SearchResult {
    // HARDCODED MOCK DATA - Replace with backend data
    const mockGarages: Garage[] = [
      {
        id: '1',
        name: 'AutoCare Pro',
        description: 'Professional automotive service center with modern equipment',
        address: 'No. 123, Galle Road, Colombo 03',
        city: 'Colombo',
        phoneNumber: '+94 11 234 5678',
        email: 'info@autocareprro.lk',
        latitude: 6.9271,
        longitude: 79.8612,
        rating: 4.8,
        reviewCount: 127,
        isActive: true,
        openingHours: {
          monday: { isOpen: true, openTime: '08:00', closeTime: '18:00' },
          tuesday: { isOpen: true, openTime: '08:00', closeTime: '18:00' },
          wednesday: { isOpen: true, openTime: '08:00', closeTime: '18:00' },
          thursday: { isOpen: true, openTime: '08:00', closeTime: '18:00' },
          friday: { isOpen: true, openTime: '08:00', closeTime: '18:00' },
          saturday: { isOpen: true, openTime: '08:00', closeTime: '16:00' },
          sunday: { isOpen: false }
        },
        services: [
          { id: '1', name: 'Oil Change', description: 'Engine oil and filter replacement', price: 2500, estimatedDuration: 30, isActive: true },
          { id: '2', name: 'Brake Service', description: 'Brake pad and disc service', price: 8500, estimatedDuration: 90, isActive: true },
          { id: '3', name: 'Engine Diagnostic', description: 'Computer diagnostic scan', price: 5000, estimatedDuration: 45, isActive: true }
        ],
        ownerId: 'owner1',
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z'
      },
      {
        id: '2',
        name: 'QuickFix Garage',
        description: 'Fast and reliable automotive repairs',
        address: 'No. 456, Kandy Road, Kelaniya',
        city: 'Gampaha',
        phoneNumber: '+94 11 345 6789',
        email: 'contact@quickfix.lk',
        latitude: 6.9553,
        longitude: 79.9220,
        rating: 4.6,
        reviewCount: 89,
        isActive: true,
        openingHours: {
          monday: { isOpen: true, openTime: '07:30', closeTime: '19:00' },
          tuesday: { isOpen: true, openTime: '07:30', closeTime: '19:00' },
          wednesday: { isOpen: true, openTime: '07:30', closeTime: '19:00' },
          thursday: { isOpen: true, openTime: '07:30', closeTime: '19:00' },
          friday: { isOpen: true, openTime: '07:30', closeTime: '19:00' },
          saturday: { isOpen: true, openTime: '07:30', closeTime: '17:00' },
          sunday: { isOpen: true, openTime: '09:00', closeTime: '15:00' }
        },
        services: [
          { id: '4', name: 'Quick Service', description: 'Basic maintenance check', price: 1500, estimatedDuration: 15, isActive: true },
          { id: '5', name: 'Battery Check', description: 'Battery testing and replacement', price: 1000, estimatedDuration: 10, isActive: true },
          { id: '6', name: 'AC Service', description: 'Air conditioning service and repair', price: 6500, estimatedDuration: 120, isActive: true }
        ],
        ownerId: 'owner2',
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z'
      },
      {
        id: '3',
        name: 'Elite Motors',
        description: 'Premium automotive service center',
        address: 'No. 789, Galle Road, Dehiwala',
        city: 'Colombo',
        phoneNumber: '+94 11 456 7890',
        email: 'service@elitemotors.lk',
        latitude: 6.8344,
        longitude: 79.8707,
        rating: 4.9,
        reviewCount: 203,
        isActive: true,
        openingHours: {
          monday: { isOpen: true, openTime: '08:00', closeTime: '17:00' },
          tuesday: { isOpen: true, openTime: '08:00', closeTime: '17:00' },
          wednesday: { isOpen: true, openTime: '08:00', closeTime: '17:00' },
          thursday: { isOpen: true, openTime: '08:00', closeTime: '17:00' },
          friday: { isOpen: true, openTime: '08:00', closeTime: '17:00' },
          saturday: { isOpen: true, openTime: '08:00', closeTime: '15:00' },
          sunday: { isOpen: false }
        },
        services: [
          { id: '7', name: 'Full Service', description: 'Comprehensive vehicle service', price: 15000, estimatedDuration: 180, isActive: true },
          { id: '8', name: 'Paint Touch-up', description: 'Professional paint repair', price: 12000, estimatedDuration: 240, isActive: true },
          { id: '9', name: 'Engine Tune-up', description: 'Complete engine optimization', price: 18000, estimatedDuration: 150, isActive: true }
        ],
        ownerId: 'owner3',
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z'
      },
      {
        id: '4',
        name: 'Metro Service Center',
        description: 'Affordable automotive solutions',
        address: 'No. 321, High Level Road, Nugegoda',
        city: 'Colombo',
        phoneNumber: '+94 11 567 8901',
        email: 'info@metroservice.lk',
        latitude: 6.8649,
        longitude: 79.8997,
        rating: 4.5,
        reviewCount: 156,
        isActive: true,
        openingHours: {
          monday: { isOpen: true, openTime: '08:30', closeTime: '18:30' },
          tuesday: { isOpen: true, openTime: '08:30', closeTime: '18:30' },
          wednesday: { isOpen: true, openTime: '08:30', closeTime: '18:30' },
          thursday: { isOpen: true, openTime: '08:30', closeTime: '18:30' },
          friday: { isOpen: true, openTime: '08:30', closeTime: '18:30' },
          saturday: { isOpen: true, openTime: '08:30', closeTime: '16:30' },
          sunday: { isOpen: false }
        },
        services: [
          { id: '10', name: 'Tire Service', description: 'Tire repair and replacement', price: 3500, estimatedDuration: 20, isActive: true },
          { id: '11', name: 'Electrical Service', description: 'Automotive electrical repairs', price: 4500, estimatedDuration: 60, isActive: true }
        ],
        ownerId: 'owner4',
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z'
      },
      {
        id: '5',
        name: 'Kandy Auto Works',
        description: 'Trusted garage in the hill capital',
        address: 'No. 654, Peradeniya Road, Kandy',
        city: 'Kandy',
        phoneNumber: '+94 81 234 5678',
        email: 'service@kandyauto.lk',
        latitude: 7.2906,
        longitude: 80.6337,
        rating: 4.7,
        reviewCount: 98,
        isActive: true,
        openingHours: {
          monday: { isOpen: true, openTime: '08:00', closeTime: '17:30' },
          tuesday: { isOpen: true, openTime: '08:00', closeTime: '17:30' },
          wednesday: { isOpen: true, openTime: '08:00', closeTime: '17:30' },
          thursday: { isOpen: true, openTime: '08:00', closeTime: '17:30' },
          friday: { isOpen: true, openTime: '08:00', closeTime: '17:30' },
          saturday: { isOpen: true, openTime: '08:00', closeTime: '16:00' },
          sunday: { isOpen: false }
        },
        services: [
          { id: '12', name: 'Transmission Service', description: 'Gearbox repair and maintenance', price: 12000, estimatedDuration: 180, isActive: true },
          { id: '13', name: 'Suspension Service', description: 'Shock absorber and spring service', price: 8000, estimatedDuration: 120, isActive: true }
        ],
        ownerId: 'owner5',
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z'
      }
    ];

    // Apply basic filtering
    let filteredGarages = mockGarages;

    if (filters.rating && filters.rating > 0) {
      filteredGarages = filteredGarages.filter(garage => garage.rating >= filters.rating!);
    }

    if (filters.services && filters.services.length > 0) {
      filteredGarages = filteredGarages.filter(garage =>
        garage.services.some(service =>
          filters.services!.some(filterService =>
            service.name.toLowerCase().includes(filterService.toLowerCase())
          )
        )
      );
    }

    // Pagination
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedGarages = filteredGarages.slice(startIndex, endIndex);

    return {
      garages: paginatedGarages,
      total: filteredGarages.length,
      page,
      limit
    };
  }

  async getGarageById(id: string): Promise<Garage> {
    // TODO: BACKEND INTEGRATION - Replace with actual API call
    // const response = await apiService.get<Garage>(`/garages/${id}`);
    console.log('Get garage by ID:', id, '- Backend integration needed');
    
    // HARDCODED DATA FOR TESTING
    const mockGarages = this.getMockGarages({}, 1, 10);
    const garage = mockGarages.garages.find(g => g.id === id);
    if (!garage) {
      throw new Error('Garage not found');
    }
    return garage;
  }

  async getFeaturedGarages(): Promise<Garage[]> {
    // TODO: BACKEND INTEGRATION - Replace with actual API call
    // const response = await apiService.get<Garage[]>('/garages/featured');
    console.log('Get featured garages - Backend integration needed');
    
    // HARDCODED DATA FOR TESTING
    const mockResult = this.getMockGarages({}, 1, 3);
    return mockResult.garages;
  }

  async getNearbyGarages(latitude: number, longitude: number, radius = 10): Promise<Garage[]> {
    // TODO: BACKEND INTEGRATION - Replace with actual API call
    /*
    const params = new URLSearchParams({
      latitude: latitude.toString(),
      longitude: longitude.toString(),
      radius: radius.toString(),
    });

    const response = await apiService.get<Garage[]>(`/garages/nearby?${params}`);
    
    if (response.success && response.data) {
      return response.data;
    }
    
    throw new Error(response.message || 'Failed to get nearby garages');
    */
    
    console.log('Get nearby garages - Backend integration needed');
    
    // HARDCODED DATA FOR TESTING
    const mockResult = this.getMockGarages({ location: { latitude, longitude, radius } }, 1, 10);
    return mockResult.garages;
  }

  async getGarageQueue(garageId: string): Promise<QueueStatus> {
    // TODO: BACKEND INTEGRATION - Replace with actual API call
    // const response = await apiService.get<QueueStatus>(`/garages/${garageId}/queue`);
    console.log('Get garage queue:', garageId, '- Backend integration needed');
    
    // HARDCODED DATA FOR TESTING
    return {
      garageId,
      currentQueue: Math.floor(Math.random() * 10),
      estimatedWaitTime: Math.floor(Math.random() * 120) + 15,
      lastUpdated: new Date().toISOString()
    };
  }

  async getGarageServices(garageId: string) {
    // TODO: BACKEND INTEGRATION - Replace with actual API call
    // const response = await apiService.get(`/garages/${garageId}/services`);
    console.log('Get garage services:', garageId, '- Backend integration needed');
    
    // HARDCODED DATA FOR TESTING
    const garage = await this.getGarageById(garageId);
    return garage.services;
  }

  async getGarageReviews(garageId: string, page = 1, limit = 10) {
    // TODO: BACKEND INTEGRATION - Replace with actual API call
    /*
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    });

    const response = await apiService.get(`/garages/${garageId}/reviews?${params}`);
    
    if (response.success && response.data) {
      return response.data;
    }
    
    throw new Error(response.message || 'Failed to get garage reviews');
    */
    
    console.log('Get garage reviews:', garageId, '- Backend integration needed');
    
    // HARDCODED DATA FOR TESTING
    return {
      reviews: [],
      total: 0,
      page,
      limit
    };
  }

  // Garage owner methods
  async createGarage(garageData: Partial<Garage>): Promise<Garage> {
    // TODO: BACKEND INTEGRATION - Replace with actual API call
    // const response = await apiService.post<Garage>('/garages', garageData);
    console.log('Create garage - Backend integration needed');
    throw new Error('Backend integration needed for garage creation');
  }

  async updateGarage(id: string, garageData: Partial<Garage>): Promise<Garage> {
    // TODO: BACKEND INTEGRATION - Replace with actual API call
    // const response = await apiService.put<Garage>(`/garages/${id}`, garageData);
    console.log('Update garage - Backend integration needed');
    throw new Error('Backend integration needed for garage update');
  }

  async deleteGarage(id: string): Promise<void> {
    // TODO: BACKEND INTEGRATION - Replace with actual API call
    // const response = await apiService.delete(`/garages/${id}`);
    console.log('Delete garage - Backend integration needed');
    throw new Error('Backend integration needed for garage deletion');
  }

  async updateQueueStatus(garageId: string, queueData: Partial<QueueStatus>): Promise<QueueStatus> {
    // TODO: BACKEND INTEGRATION - Replace with actual API call
    // const response = await apiService.put<QueueStatus>(`/garages/${garageId}/queue`, queueData);
    console.log('Update queue status - Backend integration needed');
    throw new Error('Backend integration needed for queue status update');
  }
}

export const garageService = new GarageService();