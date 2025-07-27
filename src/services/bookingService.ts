import { apiService } from './api';
import { Booking, CreateBookingRequest } from '../types';

export class BookingService {
  async createBooking(bookingData: CreateBookingRequest): Promise<Booking> {
    try {
      const response = await apiService.post<{ booking: Booking }>('/bookings', bookingData);
      
      if (response.success && response.data) {
        return response.data.booking;
      }
      
      throw new Error(response.message || 'Failed to create booking');
    } catch (error: any) {
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw new Error(error.message || 'Failed to create booking');
    }
  }

  async getBookingById(id: string): Promise<Booking> {
    try {
      const response = await apiService.get<{ booking: Booking }>(`/bookings/${id}`);
      
      if (response.success && response.data) {
        return response.data.booking;
      }
      
      throw new Error(response.message || 'Booking not found');
    } catch (error: any) {
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw new Error(error.message || 'Failed to get booking');
    }
  }

  async getUserBookings(page = 1, limit = 10): Promise<{ bookings: Booking[]; pagination: any }> {
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
      });

      console.log('Fetching user bookings with params:', { page, limit });
      const response = await apiService.get<{ bookings: Booking[]; pagination: any }>(`/bookings?${params}`);
      
      console.log('Bookings API response:', response);
      
      if (response.success && response.data) {
        return response.data;
      }
      
      throw new Error(response.message || 'Failed to get user bookings');
    } catch (error: any) {
      console.error('getUserBookings error details:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
        url: error.config?.url
      });
      
      // Check if this is a network connectivity issue (backend not available)
      if (error.code === 'ECONNREFUSED' || error.code === 'ERR_NETWORK' ||
          error.message?.includes('Network Error') || !error.response) {
        console.warn('Backend server is not available, returning mock data for development');
        return this.getMockUserBookings(page, limit);
      }
      
      if (error.response?.status === 404) {
        throw new Error('Bookings endpoint not found. The API may not be running or the endpoint may not exist.');
      }
      
      if (error.response?.status === 401) {
        throw new Error('Authentication failed. Please log in again.');
      }
      
      if (error.response?.status === 500) {
        throw new Error('Server error occurred while fetching bookings.');
      }
      
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      
      throw new Error(error.message || 'Failed to get user bookings');
    }
  }

  private getMockUserBookings(page = 1, limit = 10): { bookings: Booking[]; pagination: any } {
    // Mock data for development when backend is not available
    const mockBookings: Booking[] = [
      {
        id: 'booking-001',
        customerId: 'customer-001',
        garageId: 'garage-001',
        serviceId: 'service-001',
        scheduledDateTime: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
        status: 'completed',
        vehicleInfo: {
          make: 'Toyota',
          model: 'Camry',
          year: 2020,
          licensePlate: 'ABC-1234',
          color: 'Silver'
        },
        specialRequests: 'Please check the air conditioning system',
        totalAmount: 15000,
        paymentStatus: 'paid',
        createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        garage: {
          id: 'garage-001',
          name: 'AutoCare Pro',
          description: 'Professional automotive service center',
          address: '123 Main Street, Colombo',
          city: 'Colombo',
          phoneNumber: '+94 11 234 5678',
          email: 'info@autocarepr.com',
          latitude: 6.9271,
          longitude: 79.8612,
          rating: 4.5,
          reviewCount: 128,
          isActive: true,
          openingHours: {} as any,
          services: [],
          ownerId: 'owner-001',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        },
        service: {
          id: 'service-001',
          name: 'Full Service & Oil Change',
          description: 'Complete vehicle inspection and oil change',
          price: 15000,
          estimatedDuration: 120,
          isActive: true
        }
      },
      {
        id: 'booking-002',
        customerId: 'customer-001',
        garageId: 'garage-002',
        serviceId: 'service-002',
        scheduledDateTime: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString(), // Tomorrow
        status: 'confirmed',
        vehicleInfo: {
          make: 'Honda',
          model: 'Civic',
          year: 2019,
          licensePlate: 'XYZ-5678',
          color: 'Blue'
        },
        totalAmount: 8500,
        paymentStatus: 'pending',
        createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        garage: {
          id: 'garage-002',
          name: 'Quick Fix Garage',
          description: 'Fast and reliable car repairs',
          address: '456 Galle Road, Mount Lavinia',
          city: 'Mount Lavinia',
          phoneNumber: '+94 11 987 6543',
          email: 'contact@quickfix.lk',
          latitude: 6.8344,
          longitude: 79.8633,
          rating: 4.2,
          reviewCount: 89,
          isActive: true,
          openingHours: {} as any,
          services: [],
          ownerId: 'owner-002',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        },
        service: {
          id: 'service-002',
          name: 'Brake Inspection',
          description: 'Complete brake system check and maintenance',
          price: 8500,
          estimatedDuration: 90,
          isActive: true
        }
      }
    ];

    return {
      bookings: mockBookings.slice(0, limit),
      pagination: {
        page,
        limit,
        total: mockBookings.length,
        totalPages: Math.ceil(mockBookings.length / limit)
      }
    };
  }

  async getGarageBookings(garageId: string, page = 1, limit = 10): Promise<{ bookings: Booking[]; pagination: any }> {
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
      });

      const response = await apiService.get<{ bookings: Booking[]; pagination: any }>(`/bookings?${params}`);
      
      if (response.success && response.data) {
        return response.data;
      }
      
      throw new Error(response.message || 'Failed to get garage bookings');
    } catch (error: any) {
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw new Error(error.message || 'Failed to get garage bookings');
    }
  }

  async updateBookingStatus(id: string, status: Booking['status'], garageNotes?: string): Promise<Booking> {
    try {
      const response = await apiService.put<{ booking: Booking }>(`/bookings/${id}/status`, {
        status,
        garageNotes
      });
      
      if (response.success && response.data) {
        return response.data.booking;
      }
      
      throw new Error(response.message || 'Failed to update booking status');
    } catch (error: any) {
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw new Error(error.message || 'Failed to update booking status');
    }
  }

  async cancelBooking(id: string, reason?: string): Promise<Booking> {
    try {
      const response = await apiService.put<{ booking: Booking }>(`/bookings/${id}/cancel`, {
        reason
      });
      
      if (response.success && response.data) {
        return response.data.booking;
      }
      
      throw new Error(response.message || 'Failed to cancel booking');
    } catch (error: any) {
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw new Error(error.message || 'Failed to cancel booking');
    }
  }

  async addReview(id: string, rating: number, review?: string): Promise<Booking> {
    try {
      const response = await apiService.put<{ booking: Booking }>(`/bookings/${id}/review`, {
        rating,
        review
      });
      
      if (response.success && response.data) {
        return response.data.booking;
      }
      
      throw new Error(response.message || 'Failed to add review');
    } catch (error: any) {
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw new Error(error.message || 'Failed to add review');
    }
  }

  async getAvailableTimeSlots(garageId: string, serviceId: string, date: string): Promise<string[]> {
    try {
      return [
        '08:00', '08:30', '09:00', '09:30', '10:00', '10:30',
        '11:00', '11:30', '14:00', '14:30', '15:00', '15:30'
      ];
    } catch (error: any) {
      throw new Error(error.message || 'Failed to get available time slots');
    }
  }
}

export const bookingService = new BookingService();