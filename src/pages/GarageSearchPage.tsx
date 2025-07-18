import React, { useState, useEffect } from 'react';
import { Search, MapPin, Filter, Star, Clock, Zap, Map, List, SlidersHorizontal } from 'lucide-react';
import { useLocation } from '../hooks/useLocation';
import { garageService } from '../services/garageService';
import { Garage, SearchFilters } from '../types';
import GarageCard from '../components/GarageCard';

const GarageSearchPage: React.FC = () => {
  const [garages, setGarages] = useState<Garage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<'list' | 'map'>('list');
  const [showFilters, setShowFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalResults, setTotalResults] = useState(0);
  
  const { latitude, longitude, getCurrentLocation, isLoading: locationLoading, error: locationError } = useLocation();

  const [filters, setFilters] = useState<SearchFilters & {
    district: string;
    city: string;
    sortBy: 'distance' | 'rating' | 'price' | 'availability';
    openNow: boolean;
  }>({
    location: undefined,
    services: [],
    rating: 0,
    priceRange: { min: 0, max: 50000 },
    availability: undefined,
    district: '',
    city: '',
    sortBy: 'distance',
    openNow: false,
  });

  // Sri Lankan districts
  const districts = [
    'Colombo', 'Gampaha', 'Kalutara', 'Kandy', 'Matale', 'Nuwara Eliya',
    'Galle', 'Matara', 'Hambantota', 'Jaffna', 'Kilinochchi', 'Mannar',
    'Vavuniya', 'Mullaitivu', 'Batticaloa', 'Ampara', 'Trincomalee',
    'Kurunegala', 'Puttalam', 'Anuradhapura', 'Polonnaruwa', 'Badulla',
    'Moneragala', 'Ratnapura', 'Kegalle'
  ];

  const serviceTypes = [
    'Oil Change', 'Brake Service', 'Engine Diagnostic', 'AC Service',
    'Tire Service', 'Battery Service', 'Transmission', 'Electrical',
    'Body Work', 'Paint Service', 'Full Service', 'Quick Service'
  ];

  useEffect(() => {
    searchGarages();
  }, [filters, currentPage]);

  useEffect(() => {
    if (latitude && longitude) {
      setFilters(prev => ({
        ...prev,
        location: {
          latitude,
          longitude,
          radius: 25 // 25km radius
        }
      }));
    }
  }, [latitude, longitude]);

  const searchGarages = async () => {
    setIsLoading(true);
    try {
      const searchFilters: SearchFilters = {
        location: filters.location,
        services: filters.services.length > 0 ? filters.services : undefined,
        rating: filters.rating > 0 ? filters.rating : undefined,
        priceRange: filters.priceRange.min > 0 || filters.priceRange.max < 50000 ? filters.priceRange : undefined,
        availability: filters.availability,
      };

      // Add text search and location filters
      const result = await garageService.searchGarages(searchFilters, currentPage, 12);
      
      // Filter by district/city if specified
      let filteredGarages = result.garages;
      if (filters.district) {
        filteredGarages = filteredGarages.filter(garage => 
          garage.city.toLowerCase().includes(filters.district.toLowerCase()) ||
          garage.address.toLowerCase().includes(filters.district.toLowerCase())
        );
      }
      if (filters.city) {
        filteredGarages = filteredGarages.filter(garage => 
          garage.city.toLowerCase().includes(filters.city.toLowerCase())
        );
      }
      if (searchTerm) {
        filteredGarages = filteredGarages.filter(garage =>
          garage.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          garage.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
          garage.address.toLowerCase().includes(searchTerm.toLowerCase())
        );
      }

      // Sort results
      filteredGarages = sortGarages(filteredGarages);

      setGarages(filteredGarages);
      setTotalResults(filteredGarages.length);
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const sortGarages = (garages: Garage[]) => {
    return [...garages].sort((a, b) => {
      switch (filters.sortBy) {
        case 'rating':
          return b.rating - a.rating;
        case 'distance':
          // This would need actual distance calculation
          return 0;
        case 'price':
          // This would need average price calculation
          return 0;
        case 'availability':
          return a.isActive === b.isActive ? 0 : a.isActive ? -1 : 1;
        default:
          return 0;
      }
    });
  };

  const handleFilterChange = (key: string, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setCurrentPage(1);
  };

  const handleServiceToggle = (service: string) => {
    setFilters(prev => ({
      ...prev,
      services: prev.services.includes(service)
        ? prev.services.filter(s => s !== service)
        : [...prev.services, service]
    }));
  };

  const clearFilters = () => {
    setFilters({
      location: latitude && longitude ? {
        latitude,
        longitude,
        radius: 25
      } : undefined,
      services: [],
      rating: 0,
      priceRange: { min: 0, max: 50000 },
      availability: undefined,
      district: '',
      city: '',
      sortBy: 'distance',
      openNow: false,
    });
    setSearchTerm('');
    setCurrentPage(1);
  };

  const handleUseCurrentLocation = () => {
    getCurrentLocation();
  };

  return (
    <div className="min-h-screen bg-gray-light py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-secondary mb-2">Find Garages</h1>
          <p className="text-xl text-gray-600">Discover trusted automotive service centers near you</p>
        </div>

        {/* Search Bar */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Text Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Search garages, services, or locations..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>

            {/* District Filter */}
            <div className="lg:w-48">
              <select
                value={filters.district}
                onChange={(e) => handleFilterChange('district', e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              >
                <option value="">All Districts</option>
                {districts.map(district => (
                  <option key={district} value={district}>{district}</option>
                ))}
              </select>
            </div>

            {/* Location Button */}
            <button
              onClick={handleUseCurrentLocation}
              disabled={locationLoading}
              className="lg:w-auto px-6 py-3 bg-primary text-secondary rounded-lg font-semibold hover:bg-primary-dark transition-all duration-200 flex items-center justify-center"
            >
              <MapPin className="h-5 w-5 mr-2" />
              {locationLoading ? 'Getting Location...' : 'Use My Location'}
            </button>

            {/* Filter Toggle */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="lg:w-auto px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200 flex items-center justify-center"
            >
              <SlidersHorizontal className="h-5 w-5 mr-2" />
              Filters
            </button>
          </div>

          {/* Location Status */}
          {locationError && (
            <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
              {locationError}
            </div>
          )}
          {latitude && longitude && (
            <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg text-green-700 text-sm">
              ✓ Using your current location for nearby results
            </div>
          )}
        </div>

        {/* Advanced Filters */}
        {showFilters && (
          <div className="bg-white rounded-xl shadow-lg p-6 mb-8 animate-fade-in">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-secondary">Advanced Filters</h3>
              <button
                onClick={clearFilters}
                className="text-primary hover:text-primary-dark font-semibold"
              >
                Clear All
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* City Filter */}
              <div>
                <label className="block text-sm font-medium text-secondary mb-2">City</label>
                <input
                  type="text"
                  placeholder="Enter city name"
                  value={filters.city}
                  onChange={(e) => handleFilterChange('city', e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>

              {/* Rating Filter */}
              <div>
                <label className="block text-sm font-medium text-secondary mb-2">Minimum Rating</label>
                <select
                  value={filters.rating}
                  onChange={(e) => handleFilterChange('rating', Number(e.target.value))}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                >
                  <option value={0}>Any Rating</option>
                  <option value={4.5}>4.5+ Stars</option>
                  <option value={4.0}>4.0+ Stars</option>
                  <option value={3.5}>3.5+ Stars</option>
                  <option value={3.0}>3.0+ Stars</option>
                </select>
              </div>

              {/* Sort By */}
              <div>
                <label className="block text-sm font-medium text-secondary mb-2">Sort By</label>
                <select
                  value={filters.sortBy}
                  onChange={(e) => handleFilterChange('sortBy', e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                >
                  <option value="distance">Distance</option>
                  <option value="rating">Rating</option>
                  <option value="price">Price</option>
                  <option value="availability">Availability</option>
                </select>
              </div>

              {/* Availability */}
              <div>
                <label className="block text-sm font-medium text-secondary mb-2">Availability</label>
                <select
                  value={filters.availability || ''}
                  onChange={(e) => handleFilterChange('availability', e.target.value || undefined)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                >
                  <option value="">Any Time</option>
                  <option value="now">Available Now</option>
                  <option value="today">Available Today</option>
                  <option value="this_week">This Week</option>
                </select>
              </div>
            </div>

            {/* Price Range */}
            <div className="mt-6">
              <label className="block text-sm font-medium text-secondary mb-2">
                Price Range: Rs. {filters.priceRange.min.toLocaleString()} - Rs. {filters.priceRange.max.toLocaleString()}
              </label>
              <div className="flex items-center space-x-4">
                <input
                  type="range"
                  min="0"
                  max="50000"
                  step="1000"
                  value={filters.priceRange.min}
                  onChange={(e) => handleFilterChange('priceRange', {
                    ...filters.priceRange,
                    min: Number(e.target.value)
                  })}
                  className="flex-1"
                />
                <input
                  type="range"
                  min="0"
                  max="50000"
                  step="1000"
                  value={filters.priceRange.max}
                  onChange={(e) => handleFilterChange('priceRange', {
                    ...filters.priceRange,
                    max: Number(e.target.value)
                  })}
                  className="flex-1"
                />
              </div>
            </div>

            {/* Services Filter */}
            <div className="mt-6">
              <label className="block text-sm font-medium text-secondary mb-3">Services</label>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                {serviceTypes.map(service => (
                  <label
                    key={service}
                    className={`flex items-center p-3 border rounded-lg cursor-pointer transition-all duration-200 ${
                      filters.services.includes(service)
                        ? 'border-primary bg-yellow-50 text-secondary'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={filters.services.includes(service)}
                      onChange={() => handleServiceToggle(service)}
                      className="sr-only"
                    />
                    <span className="text-sm">{service}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Open Now Toggle */}
            <div className="mt-6">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={filters.openNow}
                  onChange={(e) => handleFilterChange('openNow', e.target.checked)}
                  className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                />
                <span className="ml-2 text-sm font-medium text-secondary">Show only garages open now</span>
              </label>
            </div>
          </div>
        )}

        {/* Results Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold text-secondary">
              {totalResults} Garage{totalResults !== 1 ? 's' : ''} Found
            </h2>
            {filters.district && (
              <p className="text-gray-600">in {filters.district} District</p>
            )}
          </div>
          
          <div className="flex items-center space-x-4">
            {/* View Mode Toggle */}
            <div className="flex border border-gray-300 rounded-lg overflow-hidden">
              <button
                onClick={() => setViewMode('list')}
                className={`px-4 py-2 flex items-center space-x-2 ${
                  viewMode === 'list' ? 'bg-primary text-secondary' : 'bg-white text-gray-700'
                }`}
              >
                <List className="h-4 w-4" />
                <span>List</span>
              </button>
              <button
                onClick={() => setViewMode('map')}
                className={`px-4 py-2 flex items-center space-x-2 ${
                  viewMode === 'map' ? 'bg-primary text-secondary' : 'bg-white text-gray-700'
                }`}
              >
                <Map className="h-4 w-4" />
                <span>Map</span>
              </button>
            </div>
          </div>
        </div>

        {/* Results */}
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        ) : viewMode === 'list' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {garages.map((garage, index) => (
              <div key={garage.id} style={{ animationDelay: `${index * 0.1}s` }}>
                <GarageCard
                  id={garage.id}
                  name={garage.name}
                  location={garage.address}
                  distance={2.5} // This would be calculated based on user location
                  rating={garage.rating}
                  reviewCount={garage.reviewCount}
                  queueLength={Math.floor(Math.random() * 10)} // Mock data
                  estimatedWait={`${Math.floor(Math.random() * 120) + 15} mins`} // Mock data
                  services={garage.services.map(service => ({
                    name: service.name,
                    price: service.price,
                    duration: `${service.estimatedDuration} mins`
                  }))}
                  status={garage.isActive ? 'open' : 'closed'}
                />
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="h-96 bg-gray-100 rounded-lg flex items-center justify-center">
              <div className="text-center text-gray-500">
                <Map className="h-12 w-12 mx-auto mb-4" />
                <p className="text-lg font-semibold">Map View</p>
                <p>Interactive map showing garage locations would appear here</p>
                <p className="text-sm mt-2">Integration with Google Maps or similar service required</p>
              </div>
            </div>
          </div>
        )}

        {/* No Results */}
        {!isLoading && garages.length === 0 && (
          <div className="text-center py-12">
            <Search className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-secondary mb-2">No garages found</h3>
            <p className="text-gray-600 mb-6">
              Try adjusting your search criteria or expanding your search area
            </p>
            <button
              onClick={clearFilters}
              className="bg-primary text-secondary px-6 py-3 rounded-lg font-semibold hover:bg-primary-dark transition-colors duration-200"
            >
              Clear Filters
            </button>
          </div>
        )}

        {/* Pagination */}
        {garages.length > 0 && totalResults > 12 && (
          <div className="flex justify-center mt-12">
            <div className="flex space-x-2">
              <button
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              
              {[...Array(Math.ceil(totalResults / 12))].map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentPage(index + 1)}
                  className={`px-4 py-2 border rounded-lg ${
                    currentPage === index + 1
                      ? 'bg-primary text-secondary border-primary'
                      : 'border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  {index + 1}
                </button>
              ))}
              
              <button
                onClick={() => setCurrentPage(prev => Math.min(Math.ceil(totalResults / 12), prev + 1))}
                disabled={currentPage === Math.ceil(totalResults / 12)}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default GarageSearchPage;