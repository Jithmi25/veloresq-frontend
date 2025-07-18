import React from 'react';
import { MapPin, Clock, Users, Star, Wrench, Zap } from 'lucide-react';

interface Service {
  name: string;
  price: number;
  duration: string;
}

interface GarageCardProps {
  id: string;
  name: string;
  location: string;
  distance: number;
  rating: number;
  reviewCount: number;
  queueLength: number;
  estimatedWait: string;
  services: Service[];
  status: 'open' | 'busy' | 'closed';
  isEmergency?: boolean;
}

const GarageCard: React.FC<GarageCardProps> = ({
  name,
  location,
  distance,
  rating,
  reviewCount,
  queueLength,
  estimatedWait,
  services,
  status,
  isEmergency = false,
}) => {
  const getStatusColor = () => {
    switch (status) {
      case 'open': return 'text-green-500';
      case 'busy': return 'text-yellow-500';
      case 'closed': return 'text-red-500';
      default: return 'text-gray-500';
    }
  };

  const getStatusBg = () => {
    switch (status) {
      case 'open': return 'bg-green-100 border-green-200';
      case 'busy': return 'bg-yellow-100 border-yellow-200';
      case 'closed': return 'bg-red-100 border-red-200';
      default: return 'bg-gray-100 border-gray-200';
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-200 overflow-hidden animate-fade-in">
      {/* Header */}
      <div className="p-6 border-b border-gray-100">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-xl font-bold text-secondary mb-1">{name}</h3>
            <div className="flex items-center text-gray-600 mb-2">
              <MapPin className="h-4 w-4 mr-1" />
              <span className="text-sm">{location} • {distance}km away</span>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center">
                <Star className="h-4 w-4 text-yellow-400 fill-current" />
                <span className="text-sm font-semibold ml-1">{rating}</span>
                <span className="text-sm text-gray-500 ml-1">({reviewCount})</span>
              </div>
              <div className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusBg()}`}>
                <span className={getStatusColor()}>{status.toUpperCase()}</span>
              </div>
            </div>
          </div>
          {isEmergency && (
            <div className="bg-red-500 text-white px-2 py-1 rounded-full text-xs font-bold animate-pulse">
              EMERGENCY
            </div>
          )}
        </div>

        {/* Queue Info */}
        <div className="flex items-center justify-between bg-gray-50 rounded-lg p-3">
          <div className="flex items-center">
            <Users className="h-4 w-4 text-gray-600 mr-2" />
            <span className="text-sm text-gray-700">
              <span className="font-semibold">{queueLength}</span> in queue
            </span>
          </div>
          <div className="flex items-center">
            <Clock className="h-4 w-4 text-gray-600 mr-2" />
            <span className="text-sm text-gray-700">~{estimatedWait}</span>
          </div>
        </div>
      </div>

      {/* Services */}
      <div className="p-6">
        <h4 className="font-semibold text-secondary mb-3 flex items-center">
          <Wrench className="h-4 w-4 mr-2" />
          Available Services
        </h4>
        <div className="space-y-2 mb-4">
          {services.slice(0, 3).map((service, index) => (
            <div key={index} className="flex justify-between items-center text-sm">
              <span className="text-gray-700">{service.name}</span>
              <div className="text-right">
                <span className="font-semibold text-secondary">Rs. {service.price}</span>
                <span className="text-gray-500 ml-2">({service.duration})</span>
              </div>
            </div>
          ))}
          {services.length > 3 && (
            <p className="text-xs text-gray-500">+{services.length - 3} more services</p>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-3">
          <button 
            className="flex-1 bg-primary text-secondary px-4 py-2 rounded-lg font-semibold hover:bg-primary-dark transition-all duration-200 transform hover:scale-105 flex items-center justify-center"
            disabled={status === 'closed'}
          >
            <Zap className="h-4 w-4 mr-2" />
            {isEmergency ? 'Request Emergency' : 'Book Now'}
          </button>
          <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200">
            Details
          </button>
        </div>
      </div>
    </div>
  );
};

export default GarageCard;