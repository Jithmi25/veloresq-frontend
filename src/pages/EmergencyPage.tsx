import React, { useState, useEffect } from 'react';
import { Phone, MapPin, Clock, AlertTriangle, CheckCircle, Car, Wrench, Zap } from 'lucide-react';

const EmergencyPage: React.FC = () => {
  const [emergencyStatus, setEmergencyStatus] = useState<'idle' | 'requesting' | 'dispatched' | 'arrived'>('idle');
  const [location, setLocation] = useState<string>('');
  const [emergencyType, setEmergencyType] = useState<string>('');
  const [estimatedTime, setEstimatedTime] = useState<number>(0);
  const [countdown, setCountdown] = useState<number>(0);

  const emergencyTypes = [
    { id: 'breakdown', label: 'Vehicle Breakdown', icon: Car, description: 'Engine won\'t start, overheating, etc.' },
    { id: 'accident', label: 'Accident Support', icon: AlertTriangle, description: 'Minor accident, need towing' },
    { id: 'flat-tire', label: 'Flat Tire', icon: Wrench, description: 'Tire puncture or replacement' },
    { id: 'battery', label: 'Battery Issues', icon: Zap, description: 'Jump start, battery replacement' },
    { id: 'fuel', label: 'Out of Fuel', icon: Car, description: 'Emergency fuel delivery' },
    { id: 'lockout', label: 'Vehicle Lockout', icon: Car, description: 'Keys locked inside vehicle' },
  ];

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const handleEmergencyRequest = () => {
    if (!emergencyType || !location) return;
    
    setEmergencyStatus('requesting');
    
    // Simulate emergency request process
    setTimeout(() => {
      setEmergencyStatus('dispatched');
      setEstimatedTime(25);
      setCountdown(25 * 60); // 25 minutes in seconds
    }, 3000);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getStatusColor = () => {
    switch (emergencyStatus) {
      case 'requesting': return 'text-yellow-600';
      case 'dispatched': return 'text-blue-600';
      case 'arrived': return 'text-green-600';
      default: return 'text-gray-600';
    }
  };

  const getStatusMessage = () => {
    switch (emergencyStatus) {
      case 'requesting': return 'Finding nearest emergency service...';
      case 'dispatched': return 'Emergency team is on the way!';
      case 'arrived': return 'Emergency team has arrived!';
      default: return 'Ready to help in case of emergency';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <div className="bg-red-500 p-4 rounded-full animate-pulse">
              <AlertTriangle className="h-8 w-8 text-white" />
            </div>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-secondary mb-2">Emergency Service</h1>
          <p className="text-xl text-gray-600">24/7 roadside assistance at your fingertips</p>
        </div>

        {emergencyStatus === 'idle' && (
          <div className="bg-white rounded-xl shadow-lg p-8 animate-fade-in">
            <h2 className="text-2xl font-bold text-secondary mb-6">What's your emergency?</h2>
            
            {/* Emergency Type Selection */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              {emergencyTypes.map((type) => (
                <label
                  key={type.id}
                  className={`block p-4 border-2 rounded-lg cursor-pointer transition-all duration-200 ${
                    emergencyType === type.id
                      ? 'border-red-500 bg-red-50'
                      : 'border-gray-200 hover:border-red-300'
                  }`}
                >
                  <input
                    type="radio"
                    name="emergencyType"
                    value={type.id}
                    checked={emergencyType === type.id}
                    onChange={(e) => setEmergencyType(e.target.value)}
                    className="sr-only"
                  />
                  <div className="flex items-start space-x-3">
                    <div className="p-2 bg-red-100 rounded-lg">
                      <type.icon className="h-6 w-6 text-red-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-secondary">{type.label}</h3>
                      <p className="text-sm text-gray-600 mt-1">{type.description}</p>
                    </div>
                  </div>
                </label>
              ))}
            </div>

            {/* Location Input */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-secondary mb-2">
                <MapPin className="inline h-4 w-4 mr-2" />
                Your Current Location
              </label>
              <div className="flex space-x-3">
                <input
                  type="text"
                  placeholder="Enter your location or use GPS..."
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                />
                <button className="bg-gray-200 text-gray-700 px-4 py-3 rounded-lg hover:bg-gray-300 transition-colors duration-200 flex items-center">
                  <MapPin className="h-5 w-5" />
                </button>
              </div>
              <p className="text-sm text-gray-500 mt-2">
                We'll use your location to dispatch the nearest emergency team
              </p>
            </div>

            {/* Emergency Button */}
            <button
              onClick={handleEmergencyRequest}
              disabled={!emergencyType || !location}
              className="w-full bg-red-500 text-white py-4 rounded-xl font-bold text-xl hover:bg-red-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-105 animate-pulse"
            >
              🚨 REQUEST EMERGENCY HELP
            </button>

            {/* Important Info */}
            <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <div className="flex items-start space-x-2">
                <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-yellow-800">Important Information</h4>
                  <ul className="text-sm text-yellow-700 mt-2 space-y-1">
                    <li>• For life-threatening emergencies, call 119 immediately</li>
                    <li>• Our service is for vehicle-related emergencies only</li>
                    <li>• Stay with your vehicle and keep your phone charged</li>
                    <li>• Turn on hazard lights if safe to do so</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}

        {emergencyStatus === 'requesting' && (
          <div className="bg-white rounded-xl shadow-lg p-8 text-center animate-fade-in">
            <div className="animate-spin mx-auto mb-6 w-16 h-16 border-4 border-yellow-200 border-t-yellow-600 rounded-full"></div>
            <h2 className="text-2xl font-bold text-secondary mb-4">Processing Emergency Request</h2>
            <p className="text-gray-600 mb-6">
              We're finding the nearest available emergency team for your location...
            </p>
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-sm text-gray-600">
                <strong>Emergency Type:</strong> {emergencyTypes.find(t => t.id === emergencyType)?.label}
              </p>
              <p className="text-sm text-gray-600 mt-1">
                <strong>Location:</strong> {location}
              </p>
            </div>
          </div>
        )}

        {(emergencyStatus === 'dispatched' || emergencyStatus === 'arrived') && (
          <div className="space-y-6">
            {/* Status Card */}
            <div className="bg-white rounded-xl shadow-lg p-8 text-center animate-fade-in">
              <div className={`mx-auto mb-6 w-16 h-16 rounded-full flex items-center justify-center ${
                emergencyStatus === 'arrived' ? 'bg-green-100' : 'bg-blue-100'
              }`}>
                {emergencyStatus === 'arrived' ? (
                  <CheckCircle className="h-8 w-8 text-green-600" />
                ) : (
                  <Car className="h-8 w-8 text-blue-600" />
                )}
              </div>
              <h2 className={`text-2xl font-bold mb-2 ${getStatusColor()}`}>
                {getStatusMessage()}
              </h2>
              {emergencyStatus === 'dispatched' && (
                <div className="text-center">
                  <div className="text-4xl font-bold text-secondary mb-2">
                    {formatTime(countdown)}
                  </div>
                  <p className="text-gray-600">Estimated arrival time</p>
                </div>
              )}
            </div>

            {/* Emergency Team Details */}
            <div className="bg-white rounded-xl shadow-lg p-6 animate-fade-in">
              <h3 className="text-xl font-bold text-secondary mb-4">Emergency Team Details</h3>
              <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center">
                  <span className="font-bold text-secondary">RT</span>
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-secondary">Rescue Team Alpha</h4>
                  <p className="text-sm text-gray-600">Professional Emergency Response</p>
                  <div className="flex items-center mt-1">
                    <span className="text-yellow-500">★★★★★</span>
                    <span className="text-sm text-gray-600 ml-2">4.9 (247 reviews)</span>
                  </div>
                </div>
                <div className="text-right">
                  <button className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors duration-200 flex items-center">
                    <Phone className="h-4 w-4 mr-2" />
                    Call
                  </button>
                </div>
              </div>
            </div>

            {/* Live Tracking */}
            <div className="bg-white rounded-xl shadow-lg p-6 animate-fade-in">
              <h3 className="text-xl font-bold text-secondary mb-4 flex items-center">
                <MapPin className="h-5 w-5 mr-2" />
                Live Tracking
              </h3>
              <div className="bg-gray-100 h-48 rounded-lg flex items-center justify-center">
                <div className="text-center text-gray-500">
                  <MapPin className="h-12 w-12 mx-auto mb-2" />
                  <p>Live map view would appear here</p>
                  <p className="text-sm">Showing real-time location of emergency team</p>
                </div>
              </div>
              <div className="mt-4 flex justify-between text-sm text-gray-600">
                <span>Current Location: {location}</span>
                <span>Team Location: 2.3km away</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-4">
              <button className="flex-1 bg-secondary text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-dark transition-colors duration-200 flex items-center justify-center">
                <Phone className="h-5 w-5 mr-2" />
                Call Emergency Team
              </button>
              <button 
                onClick={() => setEmergencyStatus('idle')}
                className="border border-red-500 text-red-500 px-6 py-3 rounded-lg font-semibold hover:bg-red-50 transition-colors duration-200"
              >
                Cancel Request
              </button>
            </div>
          </div>
        )}

        {/* Emergency Contacts */}
        <div className="mt-8 bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-xl font-bold text-secondary mb-4">Emergency Contacts</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-red-50 rounded-lg">
              <h4 className="font-semibold text-red-800">Police Emergency</h4>
              <p className="text-2xl font-bold text-red-600">119</p>
            </div>
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <h4 className="font-semibold text-blue-800">Medical Emergency</h4>
              <p className="text-2xl font-bold text-blue-600">1990</p>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <h4 className="font-semibold text-green-800">Veloresq Hotline</h4>
              <p className="text-2xl font-bold text-green-600">*123#</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmergencyPage;