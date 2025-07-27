// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  error?: string;
}

// User Types
export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  role: 'customer' | 'garage_owner' | 'admin';
  isVerified: boolean;
  createdAt: string;
  updatedAt: string;
  // Garage owner specific fields
  garageName?: string;
  garageAddress?: string;
  businessLicense?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
  role?: 'customer' | 'garage_owner' | 'admin';
}

export interface RegisterRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  role: 'customer' | 'garage_owner';
  // Garage owner specific fields
  garageName?: string;
  garageAddress?: string;
  businessLicense?: string;
}

// Garage Types
export interface Garage {
  id: string;
  name: string;
  description: string;
  address: string;
  city: string;
  phoneNumber: string;
  email: string;
  latitude: number;
  longitude: number;
  rating: number;
  reviewCount: number;
  isActive: boolean;
  openingHours: OpeningHours;
  services: GarageService[];
  ownerId: string;
  createdAt: string;
  updatedAt: string;
}

export interface OpeningHours {
  monday: DayHours;
  tuesday: DayHours;
  wednesday: DayHours;
  thursday: DayHours;
  friday: DayHours;
  saturday: DayHours;
  sunday: DayHours;
}

export interface DayHours {
  isOpen: boolean;
  openTime?: string;
  closeTime?: string;
}

export interface GarageService {
  id: string;
  name: string;
  description: string;
  price: number;
  estimatedDuration: number; // in minutes
  isActive: boolean;
}

// Booking Types
export interface Booking {
  id: string;
  customerId: string;
  garageId: string;
  serviceId: string;
  scheduledDateTime: string;
  status: 'pending' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled';
  vehicleInfo: VehicleInfo;
  specialRequests?: string;
  totalAmount: number;
  paymentStatus: 'pending' | 'paid' | 'failed';
  createdAt: string;
  updatedAt: string;
  garage?: Garage;
  service?: GarageService;
}

export interface VehicleInfo {
  make: string;
  model: string;
  year: number;
  licensePlate: string;
  color?: string;
}

export interface CreateBookingRequest {
  garageId: string;
  serviceId: string;
  scheduledDateTime: string;
  vehicleInfo: VehicleInfo;
  specialRequests?: string;
}

// Emergency Types
export interface EmergencyRequest {
  id: string;
  customerId: string;
  type: 'breakdown' | 'accident' | 'flat_tire' | 'battery' | 'fuel' | 'lockout';
  description: string;
  location: {
    latitude: number;
    longitude: number;
    address: string;
  };
  status: 'pending' | 'dispatched' | 'in_progress' | 'completed' | 'cancelled';
  priority: 'low' | 'medium' | 'high' | 'critical';
  assignedTeamId?: string;
  estimatedArrival?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateEmergencyRequest {
  type: EmergencyRequest['type'];
  description: string;
  location: {
    latitude: number;
    longitude: number;
    address: string;
  };
}

// AI Diagnosis Types
export interface DiagnosisRequest {
  audioFile: File;
  vehicleInfo?: {
    make?: string;
    model?: string;
    year?: number;
  };
  symptoms?: string;
}

export interface DiagnosisResult {
  id: string;
  confidence: number;
  issue: string;
  severity: 'low' | 'medium' | 'high';
  description: string;
  recommendations: string[];
  estimatedCost: {
    min: number;
    max: number;
  };
  createdAt: string;
}

// Queue Types
export interface QueueStatus {
  garageId: string;
  currentQueue: number;
  estimatedWaitTime: number; // in minutes
  lastUpdated: string;
}

// Review Types
export interface Review {
  id: string;
  customerId: string;
  garageId: string;
  bookingId: string;
  rating: number;
  comment: string;
  createdAt: string;
  customer?: {
    firstName: string;
    lastName: string;
  };
}

// Subscription Types
export interface Subscription {
  id: string;
  userId: string;
  planType: 'basic' | 'premium' | 'pro' | 'garage_basic' | 'garage_pro';
  status: 'active' | 'cancelled' | 'expired';
  startDate: string;
  endDate: string;
  autoRenew: boolean;
  paymentMethod: string;
}

// Search Types
export interface SearchFilters {
  location?: {
    latitude: number;
    longitude: number;
    radius: number; // in km
  };
  services?: string[];
  rating?: number;
  priceRange?: {
    min: number;
    max: number;
  };
  availability?: 'now' | 'today' | 'this_week';
}

export interface SearchResult {
  garages: Garage[];
  total: number;
  page: number;
  limit: number;
}

// Facility Types
export interface Facility {
  id: string;
  name: string;
  description: string;
  isActive: boolean;
  garageId: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateFacilityRequest {
  name: string;
  description: string;
}