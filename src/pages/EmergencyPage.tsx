import React, { useState, useEffect } from 'react';
import { Phone, MapPin, Clock, AlertTriangle, CheckCircle, Car, Wrench, Zap } from 'lucide-react';
import { emergencyService } from '../services/emergencyService';
import { EmergencyRequest, CreateEmergencyRequest } from '../types';

type EmergencyStatus = 'idle' | 'requesting' | 'dispatched' | 'arrived';

const EmergencyPage: React.FC = () => {
  const [emergencyStatus, setEmergencyStatus] = useState<EmergencyStatus>('idle');
  const [location, setLocation] = useState('');
  const [emergencyType, setEmergencyType] = useState<EmergencyRequest['type'] | ''>('');
  const [description, setDescription] = useState('');
  const [requestId, setRequestId] = useState<string | null>(null);
  const [estimatedTime, setEstimatedTime] = useState<number>(0);
  const [countdown, setCountdown] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);
  const [currentLocation, setCurrentLocation] = useState<{ latitude: number; longitude: number } | null>(null);

  const emergencyTypes = [
    { id: 'breakdown', label: 'Vehicle Breakdown', icon: Car },
    { id: 'accident', label: 'Accident Support', icon: AlertTriangle },
    { id: 'flat-tire', label: 'Flat Tire', icon: Wrench },
    { id: 'battery', label: 'Battery Issues', icon: Zap },
    { id: 'fuel', label: 'Out of Fuel', icon: Car },
    { id: 'lockout', label: 'Vehicle Lockout', icon: Car },
  ];

  useEffect(() => {
    if (countdown > 0 && emergencyStatus === 'dispatched') {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown, emergencyStatus]);

  useEffect(() => {
    let poll: number;
    if (requestId && emergencyStatus === 'dispatched') {
      poll = setInterval(async () => {
        try {
          const emergencyRequest = await emergencyService.getEmergencyRequest(requestId);
          if (emergencyRequest.status === 'completed') {
            setEmergencyStatus('arrived');
            clearInterval(poll);
          }
        } catch (err) {
          console.error('Failed to poll emergency status:', err);
        }
      }, 5000);
    }
    return () => clearInterval(poll);
  }, [requestId, emergencyStatus]);

  // Get user's current location
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCurrentLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          });
        },
        (error) => {
          console.error('Error getting location:', error);
        }
      );
    }
  }, []);

  const handleEmergencyRequest = async () => {
    if (!emergencyType || !location || !currentLocation) {
      setError('Please select emergency type and provide location');
      return;
    }
    
    setError(null);
    setEmergencyStatus('requesting');
    
    try {
      const requestData: CreateEmergencyRequest = {
        type: emergencyType as EmergencyRequest['type'],
        description: description || `${emergencyType} emergency`,
        location: {
          latitude: currentLocation.latitude,
          longitude: currentLocation.longitude,
          address: location
        }
      };

      const emergencyRequest = await emergencyService.createEmergencyRequest(requestData);
      setRequestId(emergencyRequest.id);
      
      // Simulate estimated time (in real app, this would come from the API)
      const etaMinutes = 15;
      setEstimatedTime(etaMinutes);
      setCountdown(etaMinutes * 60);
      setEmergencyStatus('dispatched');
    } catch (err: any) {
      console.error('Emergency request failed:', err);
      setError(err.message || 'Failed to send emergency request');
      setEmergencyStatus('idle');
    }
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  const statusColor = emergencyStatus === 'requesting'
    ? 'text-yellow-600'
    : emergencyStatus === 'dispatched'
      ? 'text-blue-600'
      : emergencyStatus === 'arrived'
        ? 'text-green-600'
        : 'text-gray-600';

  const statusMessage = emergencyStatus === 'requesting'
    ? 'Finding nearest emergency service...'
    : emergencyStatus === 'dispatched'
      ? 'Emergency team is on the way!'
      : emergencyStatus === 'arrived'
        ? 'Emergency team has arrived!'
        : 'Ready to help in case of emergency';

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="bg-red-500 p-4 rounded-full animate-pulse">
              <AlertTriangle className="h-8 w-8 text-white" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-secondary mb-2">Emergency Service</h1>
          <p className="text-xl text-gray-600">24/7 roadside assistance at your fingertips</p>
        </div>

        {error && <div className="mb-4 text-red-600 font-semibold">Error: {error}</div>}

        {emergencyStatus === 'idle' && (
          <div className="bg-white rounded-xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-secondary mb-6">What's your emergency?</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              {emergencyTypes.map(type => (
                <label key={type.id}
                  className={`block p-4 border-2 rounded-lg cursor-pointer ${
                    emergencyType === type.id ? 'border-red-500 bg-red-50' : 'border-gray-200'
                  }`}>
                  <input type="radio" name="emergencyType"
                    value={type.id}
                    checked={emergencyType === type.id}
                    onChange={e => setEmergencyType(e.target.value as EmergencyRequest['type'])}
                    className="sr-only" />
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-red-100 rounded-lg">
                      <type.icon className="h-6 w-6 text-red-600" />
                    </div>
                    <span>{type.label}</span>
                  </div>
                </label>
              ))}
            </div>
            <div className="mb-6">
              <label className="block mb-2"><MapPin className="inline h-4 w-4 mr-2" />Your Current Location</label>
              <div className="flex space-x-3">
                <input type="text" placeholder="Enter your location address"
                  value={location} onChange={e => setLocation(e.target.value)}
                  className="flex-1 p-3 border rounded-lg" />
                <button
                  type="button"
                  title="Get current location"
                  onClick={() => {
                    if (navigator.geolocation) {
                      navigator.geolocation.getCurrentPosition(
                        (position) => {
                          setCurrentLocation({
                            latitude: position.coords.latitude,
                            longitude: position.coords.longitude
                          });
                          setLocation(`${position.coords.latitude.toFixed(6)}, ${position.coords.longitude.toFixed(6)}`);
                        },
                        (error) => {
                          setError('Unable to get your location. Please enter manually.');
                        }
                      );
                    }
                  }}
                  className="bg-gray-200 px-3 rounded-lg hover:bg-gray-300">
                  <MapPin className="h-5 w-5" />
                </button>
              </div>
              {currentLocation && (
                <p className="text-sm text-gray-500 mt-1">
                  GPS: {currentLocation.latitude.toFixed(6)}, {currentLocation.longitude.toFixed(6)}
                </p>
              )}
            </div>
            
            <div className="mb-6">
              <label className="block mb-2">Additional Details (Optional)</label>
              <textarea
                placeholder="Describe your emergency situation..."
                value={description}
                onChange={e => setDescription(e.target.value)}
                className="w-full p-3 border rounded-lg h-20 resize-none"
              />
            </div>
            <button onClick={handleEmergencyRequest}
              disabled={!emergencyType || !location || !currentLocation}
              className="w-full bg-red-500 text-white py-4 rounded-xl font-bold hover:bg-red-600 disabled:bg-gray-300 disabled:cursor-not-allowed">
              🚨 REQUEST EMERGENCY HELP
            </button>
            {(!currentLocation) && (
              <p className="text-sm text-gray-500 mt-2 text-center">
                Please allow location access or enter your address manually
              </p>
            )}
          </div>
        )}

        {emergencyStatus === 'requesting' && (
          <div className="bg-white p-8 text-center rounded-xl shadow-lg">
            <div className="animate-spin mx-auto mb-6 w-16 h-16 border-4 border-yellow-200 border-t-yellow-600 rounded-full" />
            <h2 className="text-2xl font-bold text-secondary mb-4">Processing Emergency Request</h2>
            <p className="text-gray-600 mb-6">{statusMessage}</p>
          </div>
        )}

        {(emergencyStatus === 'dispatched' || emergencyStatus === 'arrived') && (
          <div className="space-y-6">
            <div className="bg-white p-8 text-center rounded-xl shadow-lg">
              <div className={`mx-auto mb-6 w-16 h-16 rounded-full flex items-center justify-center ${
                emergencyStatus === 'arrived' ? 'bg-green-100' : 'bg-blue-100'
              }`}>
                {emergencyStatus === 'arrived' ? <CheckCircle className="h-8 w-8 text-green-600" />
                  : <Car className="h-8 w-8 text-blue-600" />}
              </div>
              <h2 className={`text-2xl font-bold mb-2 ${statusColor}`}>{statusMessage}</h2>
              {emergencyStatus === 'dispatched' && (
                <div>
                  <div className="text-4xl font-bold text-secondary mb-2">{formatTime(countdown)}</div>
                  <p className="text-gray-600">Estimated arrival time</p>
                </div>
              )}
            </div>
            {/* Additional UI such as team details, map, buttons can go here */}
          </div>
        )}

        {/* Emergency Contacts */}
        <div className="mt-8 bg-white p-6 rounded-xl shadow-lg">
          <h3 className="text-xl font-bold text-secondary mb-4">Emergency Contacts</h3>
          <div className="grid grid-cols-3 gap-4">
            <div className="p-4 bg-red-50 text-center"><span className="font-semibold">Police Emergency</span><div className="text-2xl">119</div></div>
            <div className="p-4 bg-blue-50 text-center"><span className="font-semibold">Medical Emergency</span><div className="text-2xl">1990</div></div>
            <div className="p-4 bg-green-50 text-center"><span className="font-semibold">Veloresq Hotline</span><div className="text-2xl">*123#</div></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmergencyPage;
