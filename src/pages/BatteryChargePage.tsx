import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Search, MapPin, Battery, Zap, Clock, Star, Navigation, Phone, Filter, Map, List } from 'lucide-react';
import { useLocation } from '../hooks/useLocation';

interface ChargingStation {
  id: string;
  name: string;
  address: string;
  city: string;
  latitude: number;
  longitude: number;
  distance: number;
  rating: number;
  reviewCount: number;
  isOpen: boolean;
  chargingPorts: ChargingPort[];
  amenities: string[];
  pricing: {
    fastCharge: number;
    standardCharge: number;
    currency: string;
  };
  operatingHours: string;
  phoneNumber: string;
  ownerId: string;
  ownerType: 'garage_owner' | 'battery_charge_owner';
}

interface ChargingPort {
  id: string;
  type: 'Type 1' | 'Type 2' | 'CCS' | 'CHAdeMO' | 'Tesla';
  power: string;
  status: 'available' | 'occupied' | 'maintenance';
  estimatedTime?: string;
}

const BatteryChargePage: React.FC = () => {
  const [stations, setStations] = useState<ChargingStation[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<'list' | 'map'>('list');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedChargerType, setSelectedChargerType] = useState('');
  const [maxDistance, setMaxDistance] = useState(25);
  const [sortBy, setSortBy] = useState<'distance' | 'rating' | 'price'>('distance');
  
  const { latitude, longitude, getCurrentLocation, isLoading: locationLoading, error: locationError } = useLocation();

  const chargerTypes = ['Type 1', 'Type 2', 'CCS', 'CHAdeMO', 'Tesla'];
  const amenities = ['WiFi', 'Restroom', 'Cafe', 'Shopping', 'Parking', '24/7 Access'];

  useEffect(() => {
    loadChargingStations();
  }, [latitude, longitude]);

  const loadChargingStations = async () => {
    setIsLoading(true);
    try {
      // Build query parameters
      const params: any = {};
      if (searchTerm) params.search = searchTerm;
      if (selectedChargerType) params.chargerType = selectedChargerType;
      if (maxDistance) params.maxDistance = maxDistance;
      if (sortBy) params.sortBy = sortBy;
      if (latitude && longitude) {
        params.latitude = latitude;
        params.longitude = longitude;
      }

      // Call backend API - update URL as needed
      const response = await axios.get('/api/battery-charging-stations', { params });

      // Ensure response.data is an array before setting stations
      const stationsData = response.data;
      if (Array.isArray(stationsData)) {
        setStations(stationsData);
      } else if (stationsData && Array.isArray(stationsData.stations)) {
        // Handle case where data is nested under a 'stations' property
        setStations(stationsData.stations);
      } else if (stationsData && Array.isArray(stationsData.data)) {
        // Handle case where data is nested under a 'data' property
        setStations(stationsData.data);
      } else {
        console.warn('API response is not in expected format:', stationsData);
        setStations([]);
      }
    } catch (error) {
      console.error('Failed to load charging stations:', error);
      setStations([]); // Clear stations on error
    } finally {
      setIsLoading(false);
    }
  };

  const getPortStatusColor = (status: string) => {
    switch (status) {
      case 'available': return 'text-green-600 bg-green-100';
      case 'occupied': return 'text-red-600 bg-red-100';
      case 'maintenance': return 'text-yellow-600 bg-yellow-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const handleSearch = () => {
    loadChargingStations();
  };

  const handleUseCurrentLocation = () => {
    getCurrentLocation();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <div className="bg-green-500 p-4 rounded-full">
              <Battery className="h-8 w-8 text-white" />
            </div>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-secondary mb-2">Battery Charging Stations</h1>
          <p className="text-xl text-gray-600">Find nearby electric vehicle charging points</p>
        </div>

        {/* Search Bar */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Search charging stations..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>

            <button
              onClick={handleUseCurrentLocation}
              disabled={locationLoading}
              className="lg:w-auto px-6 py-3 bg-green-500 text-white rounded-lg font-semibold hover:bg-green-600 transition-all duration-200 flex items-center justify-center"
            >
              <MapPin className="h-5 w-5 mr-2" />
              {locationLoading ? 'Getting Location...' : 'Use My Location'}
            </button>

            <button
              onClick={() => setShowFilters(!showFilters)}
              className="lg:w-auto px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200 flex items-center justify-center"
            >
              <Filter className="h-5 w-5 mr-2" />
              Filters
            </button>

            <button
              onClick={handleSearch}
              className="lg:w-auto px-6 py-3 bg-secondary text-white rounded-lg font-semibold hover:bg-gray-dark transition-colors duration-200 flex items-center justify-center"
            >
              <Search className="h-5 w-5 mr-2" />
              Search
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

        {/* Filters */}
        {showFilters && (
          <div className="bg-white rounded-xl shadow-lg p-6 mb-8 animate-fade-in">
            <h3 className="text-xl font-bold text-secondary mb-4">Filter Options</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-secondary mb-2">Charger Type</label>
                <select
                  value={selectedChargerType}
                  onChange={(e) => setSelectedChargerType(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  <option value="">All Types</option>
                  {chargerTypes.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-secondary mb-2">
                  Max Distance: {maxDistance}km
                </label>
                <input
                  type="range"
                  min="5"
                  max="50"
                  value={maxDistance}
                  onChange={(e) => setMaxDistance(Number(e.target.value))}
                  className="w-full"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-secondary mb-2">Sort By</label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  <option value="distance">Distance</option>
                  <option value="rating">Rating</option>
                  <option value="price">Price</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* Results Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-secondary">
            {stations.length} Charging Station{stations.length !== 1 ? 's' : ''} Found
          </h2>
          
          <div className="flex items-center space-x-4">
            <div className="flex border border-gray-300 rounded-lg overflow-hidden">
              <button
                onClick={() => setViewMode('list')}
                className={`px-4 py-2 flex items-center space-x-2 ${
                  viewMode === 'list' ? 'bg-green-500 text-white' : 'bg-white text-gray-700'
                }`}
              >
                <List className="h-4 w-4" />
                <span>List</span>
              </button>
              <button
                onClick={() => setViewMode('map')}
                className={`px-4 py-2 flex items-center space-x-2 ${
                  viewMode === 'map' ? 'bg-green-500 text-white' : 'bg-white text-gray-700'
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
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
          </div>
        ) : viewMode === 'list' ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {stations.map((station, index) => (
              <div key={station.id} className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 animate-fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
                {/* Station Header */}
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-secondary mb-1">{station.name}</h3>
                    <div className="flex items-center text-gray-600 mb-2">
                      <MapPin className="h-4 w-4 mr-1" />
                      <span className="text-sm">{station.address} • {station.distance}km away</span>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center">
                        <Star className="h-4 w-4 text-yellow-400 fill-current" />
                        <span className="text-sm font-semibold ml-1">{station.rating}</span>
                        <span className="text-sm text-gray-500 ml-1">({station.reviewCount})</span>
                      </div>
                      <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                        station.isOpen ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
                      }`}>
                        {station.isOpen ? 'OPEN' : 'CLOSED'}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-green-600">
                      Rs. {station.pricing.standardCharge}/kWh
                    </div>
                    <div className="text-sm text-gray-500">Standard</div>
                  </div>
                </div>

                {/* Charging Ports */}
                <div className="mb-4">
                  <h4 className="font-semibold text-secondary mb-2 flex items-center">
                    <Zap className="h-4 w-4 mr-2" />
                    Available Ports
                  </h4>
                  <div className="grid grid-cols-2 gap-2">
                    {station.chargingPorts.map((port) => (
                      <div key={port.id} className="border border-gray-200 rounded-lg p-2">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm font-medium">{port.type}</span>
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${getPortStatusColor(port.status)}`}>
                            {port.status.toUpperCase()}
                          </span>
                        </div>
                        <div className="text-xs text-gray-600">
                          {port.power}
                          {port.estimatedTime && (
                            <span className="ml-2">• {port.estimatedTime}</span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Amenities */}
                <div className="mb-4">
                  <h4 className="font-semibold text-secondary mb-2">Amenities</h4>
                  <div className="flex flex-wrap gap-2">
                    {station.amenities.map((amenity, idx) => (
                      <span key={idx} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
                        {amenity}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Station Info */}
                <div className="grid grid-cols-2 gap-4 text-sm text-gray-600 mb-4">
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-2" />
                    <span>{station.operatingHours}</span>
                  </div>
                  <div className="flex items-center">
                    <Phone className="h-4 w-4 mr-2" />
                    <span>{station.phoneNumber}</span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex space-x-3">
                  <button className="flex-1 bg-green-500 text-white px-4 py-2 rounded-lg font-semibold hover:bg-green-600 transition-all duration-200 transform hover:scale-105 flex items-center justify-center">
                    <Navigation className="h-4 w-4 mr-2" />
                    Navigate
                  </button>
                  <button className="flex-1 border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors duration-200">
                    Reserve Slot
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="h-96 bg-gray-100 rounded-lg flex items-center justify-center">
              <div className="text-center text-gray-500">
                <Map className="h-12 w-12 mx-auto mb-4" />
                <p className="text-lg font-semibold">Map View</p>
                <p>Interactive map showing charging station locations would appear here</p>
                <p className="text-sm mt-2">Integration with Google Maps or similar service required</p>
              </div>
            </div>
          </div>
        )}

        {/* No Results */}
        {!isLoading && stations.length === 0 && (
          <div className="text-center py-12">
            <Battery className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-secondary mb-2">No charging stations found</h3>
            <p className="text-gray-600 mb-6">
              Try adjusting your search criteria or expanding your search area
            </p>
            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedChargerType('');
                setMaxDistance(25);
                loadChargingStations();
              }}
              className="bg-green-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-600 transition-colors duration-200"
            >
              Clear Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default BatteryChargePage;
