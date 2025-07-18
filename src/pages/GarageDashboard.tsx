import React, { useState } from 'react';
import { Car, Users, Calendar, DollarSign, TrendingUp, Clock, Star, Settings, Plus, Edit, Trash2, Battery, Wrench, Zap, X, Save, User, Mail, Phone, MapPin, Building } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

const GarageDashboard: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [showAddServiceModal, setShowAddServiceModal] = useState(false);
  const [editingService, setEditingService] = useState<string | null>(null);
  const [showBatteryOwnerProfile, setShowBatteryOwnerProfile] = useState(false);
  
  // Check if this is a battery charge owner
  const isBatteryChargeOwner = user?.email === 'battery@test.com';
  
  const [services, setServices] = useState([
    { id: '1', name: 'Oil Change', price: 2500, duration: 30, isActive: true },
    { id: '2', name: 'Brake Service', price: 8500, duration: 90, isActive: true },
    { id: '3', name: 'Engine Diagnostic', price: 5000, duration: 45, isActive: true },
    { id: '4', name: 'Battery Service', price: 4500, duration: 60, isActive: true },
    { id: '5', name: 'AC Service', price: 6500, duration: 120, isActive: true },
    { id: '6', name: 'Tire Service', price: 3500, duration: 20, isActive: true },
    { id: '7', name: 'Full Service', price: 15000, duration: 180, isActive: true },
    { id: '8', name: 'Battery Replacement', price: 8500, duration: 45, isActive: true },
    { id: '9', name: 'Battery Testing', price: 1500, duration: 15, isActive: true },
    { id: '10', name: 'Battery Charging', price: 500, duration: 60, isActive: true }
  ]);

  const [newService, setNewService] = useState({
    name: '',
    price: '',
    duration: '',
    isActive: true
  });

  // Battery Charge Owner Profile Data
  const [batteryOwnerProfile, setBatteryOwnerProfile] = useState({
    businessName: 'PowerTech Solutions',
    ownerName: 'Rajesh Kumar',
    email: 'rajesh@powertech.lk',
    phone: '+94 77 123 4567',
    address: 'No. 123, Galle Road, Colombo 03',
    businessLicense: 'BCO-2024-001',
    totalStations: 3,
    totalPorts: 18,
    monthlyRevenue: 125000,
    chargingStations: [
      { id: 'CS001', name: 'PowerHub Colombo', location: 'Colombo 03', ports: 8, activeCharging: 5 },
      { id: 'CS002', name: 'PowerHub Kandy', location: 'Kandy', ports: 6, activeCharging: 3 },
      { id: 'CS003', name: 'PowerHub Galle', location: 'Galle', ports: 4, activeCharging: 2 }
    ]
  });

  // HARDCODED DATA - Replace with backend integration
  const garageStats = isBatteryChargeOwner ? {
    todayBookings: 8,
    totalBookings: 89,
    monthlyRevenue: 125000,
    averageRating: 4.9,
    queueLength: 2,
    completedServices: 78,
    batteryServices: 89,
    chargingRevenue: 125000
  } : {
    todayBookings: 12,
    totalBookings: 156,
    monthlyRevenue: 485000,
    averageRating: 4.8,
    queueLength: 5,
    completedServices: 142,
    batteryServices: 45,
    chargingRevenue: 25000
  };

  const recentBookings = isBatteryChargeOwner ? [
    {
      id: 'B001',
      customerName: 'Priya Sharma',
      service: 'Fast Charging',
      time: '10:00 AM',
      status: 'in_progress',
      vehicle: '2022 Tesla Model 3',
      amount: 1500
    },
    {
      id: 'B002',
      customerName: 'Anil Fernando',
      service: 'Standard Charging',
      time: '11:30 AM',
      status: 'confirmed',
      vehicle: '2021 Nissan Leaf',
      amount: 800
    },
    {
      id: 'B003',
      customerName: 'Kavitha Perera',
      service: 'Super Fast Charging',
      time: '2:00 PM',
      status: 'pending',
      vehicle: '2023 BMW iX',
      amount: 2000
    }
  ] : [
    {
      id: 'B001',
      customerName: 'John Silva',
      service: 'Oil Change',
      time: '10:00 AM',
      status: 'in_progress',
      vehicle: '2020 Toyota Corolla',
      amount: 2500
    },
    {
      id: 'B002',
      customerName: 'Maya Perera',
      service: 'Battery Charging',
      time: '11:30 AM',
      status: 'confirmed',
      vehicle: '2021 Nissan Leaf',
      amount: 500
    },
    {
      id: 'B003',
      customerName: 'Ravi Kumar',
      service: 'Battery Service',
      time: '2:00 PM',
      status: 'pending',
      vehicle: '2021 Nissan Sentra',
      amount: 4500
    },
    {
      id: 'B004',
      customerName: 'Sara Fernando',
      service: 'Engine Diagnostic',
      time: '3:30 PM',
      status: 'confirmed',
      vehicle: '2018 Suzuki Swift',
      amount: 5000
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-green-600 bg-green-100';
      case 'in_progress': return 'text-blue-600 bg-blue-100';
      case 'confirmed': return 'text-yellow-600 bg-yellow-100';
      case 'pending': return 'text-orange-600 bg-orange-100';
      case 'cancelled': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const isBatteryService = (serviceName: string) => {
    return serviceName.toLowerCase().includes('battery') || serviceName.toLowerCase().includes('charging');
  };

  const getServiceIcon = (serviceName: string) => {
    if (serviceName.toLowerCase().includes('battery') || serviceName.toLowerCase().includes('charging')) {
      return <Battery className="h-5 w-5 text-secondary" />;
    } else if (serviceName.toLowerCase().includes('engine')) {
      return <Zap className="h-5 w-5 text-secondary" />;
    } else {
      return <Wrench className="h-5 w-5 text-secondary" />;
    }
  };

  const handleAddService = () => {
    if (newService.name && newService.price && newService.duration) {
      const service = {
        id: Date.now().toString(),
        name: newService.name,
        price: parseInt(newService.price),
        duration: parseInt(newService.duration),
        isActive: newService.isActive
      };
      setServices([...services, service]);
      setNewService({ name: '', price: '', duration: '', isActive: true });
      setShowAddServiceModal(false);
      // TODO: BACKEND INTEGRATION - Save service to backend
      console.log('Add service:', service);
    }
  };

  const handleEditService = (serviceId: string) => {
    setEditingService(serviceId);
  };

  const handleSaveService = (serviceId: string) => {
    setEditingService(null);
    // TODO: BACKEND INTEGRATION - Update service in backend
    console.log('Save service:', serviceId);
  };

  const handleDeleteService = (serviceId: string) => {
    if (confirm('Are you sure you want to delete this service?')) {
      setServices(services.filter(s => s.id !== serviceId));
      // TODO: BACKEND INTEGRATION - Delete service from backend
      console.log('Delete service:', serviceId);
    }
  };

  const toggleServiceStatus = (serviceId: string) => {
    setServices(services.map(s => 
      s.id === serviceId ? { ...s, isActive: !s.isActive } : s
    ));
    // TODO: BACKEND INTEGRATION - Update service status
    console.log('Toggle service status:', serviceId);
  };

  const updateServiceField = (serviceId: string, field: string, value: any) => {
    setServices(services.map(s => 
      s.id === serviceId ? { ...s, [field]: value } : s
    ));
  };

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Today's {isBatteryChargeOwner ? 'Charging Sessions' : 'Bookings'}</p>
              <p className="text-2xl font-bold text-secondary mt-1">{garageStats.todayBookings}</p>
              <p className="text-sm text-green-600 mt-1">+3 from yesterday</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-full">
              <Calendar className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">{isBatteryChargeOwner ? 'Charging Sessions' : 'Battery Services'}</p>
              <p className="text-2xl font-bold text-secondary mt-1">{garageStats.batteryServices}</p>
              <p className="text-sm text-green-600 mt-1">+18% this month</p>
            </div>
            <div className="p-3 bg-yellow-100 rounded-full">
              <Battery className="h-6 w-6 text-yellow-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Monthly Revenue</p>
              <p className="text-2xl font-bold text-secondary mt-1">Rs. {garageStats.monthlyRevenue.toLocaleString()}</p>
              <p className="text-sm text-green-600 mt-1">+8% from last month</p>
            </div>
            <div className="p-3 bg-primary rounded-full">
              <DollarSign className="h-6 w-6 text-secondary" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Average Rating</p>
              <p className="text-2xl font-bold text-secondary mt-1">{garageStats.averageRating}</p>
              <p className="text-sm text-green-600 mt-1">+0.2 this month</p>
            </div>
            <div className="p-3 bg-yellow-100 rounded-full">
              <Star className="h-6 w-6 text-yellow-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Current Queue */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-xl font-bold text-secondary mb-4 flex items-center">
          <Clock className="h-5 w-5 mr-2" />
          Current Queue Status
        </h3>
        <div className="flex items-center justify-between bg-gray-50 rounded-lg p-4">
          <div>
            <p className="text-2xl font-bold text-secondary">{garageStats.queueLength} {isBatteryChargeOwner ? 'vehicles charging' : 'vehicles'}</p>
            <p className="text-gray-600">{isBatteryChargeOwner ? 'Currently charging' : 'Currently in queue'}</p>
          </div>
          <div>
            <p className="text-lg font-semibold text-primary">{isBatteryChargeOwner ? '~2 hours' : '~45 mins'}</p>
            <p className="text-gray-600">{isBatteryChargeOwner ? 'Average charging time' : 'Estimated wait time'}</p>
          </div>
          <button className="bg-primary text-secondary px-4 py-2 rounded-lg hover:bg-primary-dark transition-colors duration-200">
            Update Queue
          </button>
        </div>
      </div>

      {/* Recent Bookings */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-xl font-bold text-secondary mb-4">Today's {isBatteryChargeOwner ? 'Charging Sessions' : 'Bookings'}</h3>
        <div className="space-y-4">
          {recentBookings.map((booking) => (
            <div key={booking.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors duration-200">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-3">
                  <span className="font-semibold text-secondary">#{booking.id}</span>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(booking.status)}`}>
                    {booking.status.replace('_', ' ').toUpperCase()}
                  </span>
                  {isBatteryService(booking.service) && (
                    <span className="px-2 py-1 text-xs font-medium rounded-full bg-yellow-100 text-yellow-600">
                      <Battery className="h-3 w-3 inline mr-1" />
                      BATTERY
                    </span>
                  )}
                </div>
                <span className="text-sm text-gray-500">{booking.time}</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <span className="font-medium text-gray-600">Customer:</span>
                  <p className="text-secondary">{booking.customerName}</p>
                </div>
                <div>
                  <span className="font-medium text-gray-600">Service:</span>
                  <p className="text-secondary">{booking.service}</p>
                </div>
                <div>
                  <span className="font-medium text-gray-600">Vehicle:</span>
                  <p className="text-secondary">{booking.vehicle}</p>
                </div>
                <div>
                  <span className="font-medium text-gray-600">Amount:</span>
                  <p className="text-secondary font-semibold">Rs. {booking.amount.toLocaleString()}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderServices = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-2xl font-bold text-secondary">Manage Services</h3>
        <button 
          onClick={() => setShowAddServiceModal(true)}
          className="bg-primary text-secondary px-4 py-2 rounded-lg hover:bg-primary-dark transition-colors duration-200 flex items-center"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Service
        </button>
      </div>

      {/* Battery Services Highlight */}
      <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border-2 border-yellow-200 rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-xl font-bold text-secondary flex items-center">
            <Battery className="h-6 w-6 mr-2 text-yellow-600" />
            {isBatteryChargeOwner ? 'Charging Services - Featured' : 'Battery & Charging Services - Featured'}
          </h4>
          {!isBatteryChargeOwner && (
            <button
              onClick={() => setShowBatteryOwnerProfile(true)}
              className="bg-yellow-500 text-white px-4 py-2 rounded-lg hover:bg-yellow-600 transition-colors duration-200 flex items-center"
            >
              <User className="h-4 w-4 mr-2" />
              Battery Owner Profile
            </button>
          )}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {services.filter(service => isBatteryService(service.name)).map((service) => (
            <div key={service.id} className="bg-white rounded-lg shadow-md p-4 border-2 border-yellow-300">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-2">
                  <div className="p-2 bg-yellow-100 rounded-lg">
                    <Battery className="h-5 w-5 text-yellow-600" />
                  </div>
                  <div>
                    {editingService === service.id ? (
                      <input
                        type="text"
                        value={service.name}
                        onChange={(e) => updateServiceField(service.id, 'name', e.target.value)}
                        className="font-semibold text-secondary bg-gray-100 px-2 py-1 rounded"
                      />
                    ) : (
                      <h5 className="font-semibold text-secondary">{service.name}</h5>
                    )}
                    {editingService === service.id ? (
                      <input
                        type="number"
                        value={service.duration}
                        onChange={(e) => updateServiceField(service.id, 'duration', parseInt(e.target.value))}
                        className="text-sm text-gray-600 bg-gray-100 px-2 py-1 rounded w-20"
                      />
                    ) : (
                      <p className="text-sm text-gray-600">{service.duration} minutes</p>
                    )}
                  </div>
                </div>
                <div className="flex space-x-1">
                  {editingService === service.id ? (
                    <button
                      onClick={() => handleSaveService(service.id)}
                      className="p-1 text-green-600 hover:text-green-800 transition-colors duration-200"
                    >
                      <Save className="h-4 w-4" />
                    </button>
                  ) : (
                    <button
                      onClick={() => handleEditService(service.id)}
                      className="p-1 text-gray-600 hover:text-primary transition-colors duration-200"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                  )}
                  <button
                    onClick={() => handleDeleteService(service.id)}
                    className="p-1 text-gray-600 hover:text-red-600 transition-colors duration-200"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Price:</span>
                  {editingService === service.id ? (
                    <input
                      type="number"
                      value={service.price}
                      onChange={(e) => updateServiceField(service.id, 'price', parseInt(e.target.value))}
                      className="font-semibold text-secondary bg-gray-100 px-2 py-1 rounded w-24 text-right"
                    />
                  ) : (
                    <span className="font-semibold text-secondary">Rs. {service.price.toLocaleString()}</span>
                  )}
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Status:</span>
                  <button
                    onClick={() => toggleServiceStatus(service.id)}
                    className={`px-2 py-1 text-xs font-medium rounded-full transition-colors duration-200 ${
                      service.isActive 
                        ? 'text-green-600 bg-green-100 hover:bg-green-200' 
                        : 'text-red-600 bg-red-100 hover:bg-red-200'
                    }`}
                  >
                    {service.isActive ? 'Active' : 'Inactive'}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* All Services */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {services.filter(service => !isBatteryService(service.name)).map((service) => (
          <div key={service.id} className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-primary rounded-lg">
                  {getServiceIcon(service.name)}
                </div>
                <div>
                  {editingService === service.id ? (
                    <input
                      type="text"
                      value={service.name}
                      onChange={(e) => updateServiceField(service.id, 'name', e.target.value)}
                      className="font-semibold text-secondary bg-gray-100 px-2 py-1 rounded"
                    />
                  ) : (
                    <h4 className="font-semibold text-secondary">{service.name}</h4>
                  )}
                  {editingService === service.id ? (
                    <input
                      type="number"
                      value={service.duration}
                      onChange={(e) => updateServiceField(service.id, 'duration', parseInt(e.target.value))}
                      className="text-sm text-gray-600 bg-gray-100 px-2 py-1 rounded w-20"
                    />
                  ) : (
                    <p className="text-sm text-gray-600">{service.duration} minutes</p>
                  )}
                </div>
              </div>
              <div className="flex space-x-2">
                {editingService === service.id ? (
                  <button
                    onClick={() => handleSaveService(service.id)}
                    className="p-2 text-green-600 hover:text-green-800 transition-colors duration-200"
                  >
                    <Save className="h-4 w-4" />
                  </button>
                ) : (
                  <button
                    onClick={() => handleEditService(service.id)}
                    className="p-2 text-gray-600 hover:text-primary transition-colors duration-200"
                  >
                    <Edit className="h-4 w-4" />
                  </button>
                )}
                <button
                  onClick={() => handleDeleteService(service.id)}
                  className="p-2 text-gray-600 hover:text-red-600 transition-colors duration-200"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Price:</span>
                {editingService === service.id ? (
                  <input
                    type="number"
                    value={service.price}
                    onChange={(e) => updateServiceField(service.id, 'price', parseInt(e.target.value))}
                    className="font-semibold text-secondary bg-gray-100 px-2 py-1 rounded w-24 text-right"
                  />
                ) : (
                  <span className="font-semibold text-secondary">Rs. {service.price.toLocaleString()}</span>
                )}
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Status:</span>
                <button
                  onClick={() => toggleServiceStatus(service.id)}
                  className={`px-2 py-1 text-xs font-medium rounded-full transition-colors duration-200 ${
                    service.isActive 
                      ? 'text-green-600 bg-green-100 hover:bg-green-200' 
                      : 'text-red-600 bg-red-100 hover:bg-red-200'
                  }`}
                >
                  {service.isActive ? 'Active' : 'Inactive'}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add Service Modal */}
      {showAddServiceModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-8 max-w-md w-full mx-4">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-secondary">Add New Service</h3>
              <button
                onClick={() => setShowAddServiceModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-secondary mb-2">Service Name</label>
                <input
                  type="text"
                  value={newService.name}
                  onChange={(e) => setNewService(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="e.g., Oil Change"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-secondary mb-2">Price (Rs.)</label>
                <input
                  type="number"
                  value={newService.price}
                  onChange={(e) => setNewService(prev => ({ ...prev, price: e.target.value }))}
                  placeholder="2500"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-secondary mb-2">Duration (minutes)</label>
                <input
                  type="number"
                  value={newService.duration}
                  onChange={(e) => setNewService(prev => ({ ...prev, duration: e.target.value }))}
                  placeholder="30"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>
              
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="isActive"
                  checked={newService.isActive}
                  onChange={(e) => setNewService(prev => ({ ...prev, isActive: e.target.checked }))}
                  className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                />
                <label htmlFor="isActive" className="ml-2 text-sm text-secondary">
                  Service is active
                </label>
              </div>
            </div>
            
            <div className="flex space-x-3 mt-6">
              <button
                onClick={handleAddService}
                className="flex-1 bg-primary text-secondary py-3 rounded-lg hover:bg-primary-dark transition-colors duration-200"
              >
                Add Service
              </button>
              <button
                onClick={() => setShowAddServiceModal(false)}
                className="flex-1 border border-gray-300 text-gray-700 py-3 rounded-lg hover:bg-gray-50 transition-colors duration-200"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Battery Charge Owner Profile Modal */}
      {showBatteryOwnerProfile && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-8 max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-secondary flex items-center">
                <Battery className="h-6 w-6 mr-2 text-yellow-600" />
                Battery Charge Owner Profile
              </h3>
              <button
                onClick={() => setShowBatteryOwnerProfile(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            
            {/* Profile Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-secondary mb-2">Business Name</label>
                  <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                    <Building className="h-5 w-5 text-gray-400 mr-3" />
                    <span className="text-secondary">{batteryOwnerProfile.businessName}</span>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-secondary mb-2">Owner Name</label>
                  <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                    <User className="h-5 w-5 text-gray-400 mr-3" />
                    <span className="text-secondary">{batteryOwnerProfile.ownerName}</span>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-secondary mb-2">Email</label>
                  <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                    <Mail className="h-5 w-5 text-gray-400 mr-3" />
                    <span className="text-secondary">{batteryOwnerProfile.email}</span>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-secondary mb-2">Phone</label>
                  <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                    <Phone className="h-5 w-5 text-gray-400 mr-3" />
                    <span className="text-secondary">{batteryOwnerProfile.phone}</span>
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-secondary mb-2">Business License</label>
                  <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                    <Settings className="h-5 w-5 text-gray-400 mr-3" />
                    <span className="text-secondary">{batteryOwnerProfile.businessLicense}</span>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-secondary mb-2">Address</label>
                  <div className="flex items-start p-3 bg-gray-50 rounded-lg">
                    <MapPin className="h-5 w-5 text-gray-400 mr-3 mt-0.5" />
                    <span className="text-secondary">{batteryOwnerProfile.address}</span>
                  </div>
                </div>
                
                {/* Stats */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-3 bg-yellow-50 rounded-lg">
                    <div className="text-2xl font-bold text-yellow-600">{batteryOwnerProfile.totalStations}</div>
                    <div className="text-sm text-gray-600">Stations</div>
                  </div>
                  <div className="text-center p-3 bg-green-50 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">{batteryOwnerProfile.totalPorts}</div>
                    <div className="text-sm text-gray-600">Total Ports</div>
                  </div>
                </div>
                
                <div className="text-center p-3 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">Rs. {batteryOwnerProfile.monthlyRevenue.toLocaleString()}</div>
                  <div className="text-sm text-gray-600">Monthly Revenue</div>
                </div>
              </div>
            </div>
            
            {/* Charging Stations */}
            <div>
              <h4 className="text-xl font-bold text-secondary mb-4">Charging Stations</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {batteryOwnerProfile.chargingStations.map((station) => (
                  <div key={station.id} className="border border-gray-200 rounded-lg p-4">
                    <h5 className="font-semibold text-secondary mb-2">{station.name}</h5>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Location:</span>
                        <span className="text-secondary">{station.location}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Ports:</span>
                        <span className="text-secondary">{station.ports}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Active:</span>
                        <span className="text-secondary">{station.activeCharging}/{station.ports}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  const renderAnalytics = () => (
    <div className="space-y-6">
      <h3 className="text-2xl font-bold text-secondary">Analytics & Reports</h3>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h4 className="text-xl font-bold text-secondary mb-4">Revenue Trends</h4>
          <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
            <div className="text-center text-gray-500">
              <TrendingUp className="h-12 w-12 mx-auto mb-2" />
              <p>Revenue chart would appear here</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h4 className="text-xl font-bold text-secondary mb-4">{isBatteryChargeOwner ? 'Charging Analytics' : 'Battery Service Distribution'}</h4>
          <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
            <div className="text-center text-gray-500">
              <Battery className="h-12 w-12 mx-auto mb-2" />
              <p>{isBatteryChargeOwner ? 'Charging analytics' : 'Battery service analytics'} would appear here</p>
            </div>
          </div>
        </div>
      </div>
      
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h4 className="text-xl font-bold text-secondary mb-4">Monthly Performance</h4>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <p className="text-2xl font-bold text-secondary">{garageStats.completedServices}</p>
            <p className="text-gray-600">Total Services</p>
          </div>
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <p className="text-2xl font-bold text-secondary">Rs. {garageStats.monthlyRevenue.toLocaleString()}</p>
            <p className="text-gray-600">Revenue</p>
          </div>
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <p className="text-2xl font-bold text-secondary">{garageStats.averageRating}★</p>
            <p className="text-gray-600">Avg Rating</p>
          </div>
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <p className="text-2xl font-bold text-secondary">98%</p>
            <p className="text-gray-600">Completion Rate</p>
          </div>
        </div>
      </div>
    </div>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return renderOverview();
      case 'services':
        return renderServices();
      case 'analytics':
        return renderAnalytics();
      default:
        return renderOverview();
    }
  };

  return (
    <div className="min-h-screen bg-gray-light py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-secondary mb-2">
            {isBatteryChargeOwner ? 'Battery Charging Dashboard' : 'Garage Dashboard'}
          </h1>
          <p className="text-xl text-gray-600">
            {isBatteryChargeOwner 
              ? 'Manage your charging stations and monitor performance' 
              : 'Manage your garage operations and track performance'
            }
          </p>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-white rounded-xl shadow-lg mb-8">
          <div className="flex overflow-x-auto">
            {[
              { id: 'overview', label: 'Overview', icon: Car },
              { id: 'services', label: isBatteryChargeOwner ? 'Charging Services' : 'Services', icon: Wrench },
              { id: 'analytics', label: 'Analytics', icon: TrendingUp },
              { id: 'settings', label: 'Settings', icon: Settings },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-6 py-4 text-sm font-medium transition-colors duration-200 ${
                  activeTab === tab.id
                    ? 'text-primary border-b-2 border-primary bg-yellow-50'
                    : 'text-gray-600 hover:text-secondary hover:bg-gray-50'
                }`}
              >
                <tab.icon className="h-4 w-4" />
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <div className="animate-fade-in">
          {renderTabContent()}
        </div>
      </div>
    </div>
  );
};

export default GarageDashboard;