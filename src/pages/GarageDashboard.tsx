import React, { useState, useEffect } from 'react';
import { Car, Users, Calendar, DollarSign, TrendingUp, Clock, Star, Settings, Plus, Edit, Trash2, Battery, Wrench, Zap, X, Save, User, Mail, Phone, MapPin, Building } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import axios from 'axios';
import { toast } from 'react-toastify';

interface Service {
  id: string;
  name: string;
  price: number;
  duration: number;
  isActive: boolean;
}

interface Booking {
  id: string;
  customerName: string;
  service: string;
  time: string;
  status: string;
  vehicle: string;
  amount: number;
}

interface ChargingStation {
  id: string;
  name: string;
  location: string;
  ports: number;
  activeCharging: number;
}

interface BatteryOwnerProfile {
  businessName: string;
  ownerName: string;
  email: string;
  phone: string;
  address: string;
  businessLicense: string;
  totalStations: number;
  totalPorts: number;
  monthlyRevenue: number;
  chargingStations: ChargingStation[];
}

interface GarageStats {
  todayBookings: number;
  totalBookings: number;
  monthlyRevenue: number;
  averageRating: number;
  queueLength: number;
  completedServices: number;
  batteryServices: number;
  chargingRevenue: number;
}

const GarageDashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [showAddServiceModal, setShowAddServiceModal] = useState(false);
  const [editingService, setEditingService] = useState<string | null>(null);
  const [showBatteryOwnerProfile, setShowBatteryOwnerProfile] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  // Check if this is a battery charge owner
  const isBatteryChargeOwner = user?.role === 'battery_owner';
  
  // State for all data
  const [services, setServices] = useState<Service[]>([]);
  const [batteryOwnerProfile, setBatteryOwnerProfile] = useState<BatteryOwnerProfile | null>(null);
  const [garageStats, setGarageStats] = useState<GarageStats | null>(null);
  const [recentBookings, setRecentBookings] = useState<Booking[]>([]);

  const [newService, setNewService] = useState({
    name: '',
    price: '',
    duration: '',
    isActive: true
  });

  // API base URL
  const API_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5008/api';

  // Fetch all dashboard data
  const fetchDashboardData = async () => {
    try {
      setIsLoading(true);
      
      // Fetch garage stats
      const statsResponse = await axios.get(`${API_URL}/garages/stats`, {
        headers: { Authorization: `Bearer ${user?.token}` }
      });
      setGarageStats(statsResponse.data);

      // Fetch services
      const servicesResponse = await axios.get(`${API_URL}/garages/services`, {
        headers: { Authorization: `Bearer ${user?.token}` }
      });
      setServices(servicesResponse.data);

      // Fetch recent bookings
      const bookingsResponse = await axios.get(`${API_URL}/bookings/recent`, {
        headers: { Authorization: `Bearer ${user?.token}` }
      });
      setRecentBookings(bookingsResponse.data);

      // If battery owner, fetch profile
      if (isBatteryChargeOwner) {
        const profileResponse = await axios.get(`${API_URL}/users/profile`, {
          headers: { Authorization: `Bearer ${user?.token}` }
        });
        setBatteryOwnerProfile(profileResponse.data);
      }

    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      toast.error('Failed to load dashboard data');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, [user]);

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

  const handleAddService = async () => {
    if (newService.name && newService.price && newService.duration) {
      try {
        const serviceData = {
          name: newService.name,
          price: parseInt(newService.price),
          duration: parseInt(newService.duration),
          isActive: newService.isActive,
          garageId: user?.garageId
        };

        const response = await axios.post(`${API_URL}/garages/services`, serviceData, {
          headers: { Authorization: `Bearer ${user?.token}` }
        });

        setServices([...services, response.data]);
        setNewService({ name: '', price: '', duration: '', isActive: true });
        setShowAddServiceModal(false);
        toast.success('Service added successfully');
      } catch (error) {
        console.error('Error adding service:', error);
        toast.error('Failed to add service');
      }
    }
  };

  const handleEditService = (serviceId: string) => {
    setEditingService(serviceId);
  };

  const handleSaveService = async (serviceId: string) => {
    try {
      const serviceToUpdate = services.find(s => s.id === serviceId);
      if (!serviceToUpdate) return;

      await axios.put(`${API_URL}/garages/services/${serviceId}`, serviceToUpdate, {
        headers: { Authorization: `Bearer ${user?.token}` }
      });

      setEditingService(null);
      toast.success('Service updated successfully');
    } catch (error) {
      console.error('Error updating service:', error);
      toast.error('Failed to update service');
    }
  };

  const handleDeleteService = async (serviceId: string) => {
    if (confirm('Are you sure you want to delete this service?')) {
      try {
        await axios.delete(`${API_URL}/garages/services/${serviceId}`, {
          headers: { Authorization: `Bearer ${user?.token}` }
        });

        setServices(services.filter(s => s.id !== serviceId));
        toast.success('Service deleted successfully');
      } catch (error) {
        console.error('Error deleting service:', error);
        toast.error('Failed to delete service');
      }
    }
  };

  const toggleServiceStatus = async (serviceId: string) => {
    try {
      const service = services.find(s => s.id === serviceId);
      if (!service) return;

      const updatedStatus = !service.isActive;
      
      await axios.patch(`${API_URL}/garages/services/${serviceId}/status`, 
        { isActive: updatedStatus },
        { headers: { Authorization: `Bearer ${user?.token}` } }
      );

      setServices(services.map(s => 
        s.id === serviceId ? { ...s, isActive: updatedStatus } : s
      ));
      toast.success(`Service ${updatedStatus ? 'activated' : 'deactivated'}`);
    } catch (error) {
      console.error('Error toggling service status:', error);
      toast.error('Failed to update service status');
    }
  };

  const updateServiceField = (serviceId: string, field: string, value: any) => {
    setServices(services.map(s => 
      s.id === serviceId ? { ...s, [field]: value } : s
    ));
  };

  const updateBookingStatus = async (bookingId: string, status: string) => {
    try {
      await axios.put(`${API_URL}/bookings/${bookingId}/status`, 
        { status },
        { headers: { Authorization: `Bearer ${user?.token}` } }
      );

      setRecentBookings(recentBookings.map(booking => 
        booking.id === bookingId ? { ...booking, status } : booking
      ));
      toast.success('Booking status updated');
    } catch (error) {
      console.error('Error updating booking status:', error);
      toast.error('Failed to update booking status');
    }
  };

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Today's {isBatteryChargeOwner ? 'Charging Sessions' : 'Bookings'}</p>
              <p className="text-2xl font-bold text-secondary mt-1">{garageStats?.todayBookings || 0}</p>
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
              <p className="text-2xl font-bold text-secondary mt-1">{garageStats?.batteryServices || 0}</p>
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
              <p className="text-2xl font-bold text-secondary mt-1">Rs. {garageStats?.monthlyRevenue?.toLocaleString() || 0}</p>
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
              <p className="text-2xl font-bold text-secondary mt-1">{garageStats?.averageRating || 0}</p>
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
            <p className="text-2xl font-bold text-secondary">{garageStats?.queueLength || 0} {isBatteryChargeOwner ? 'vehicles charging' : 'vehicles'}</p>
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
              <div className="flex space-x-2 mt-3">
                {booking.status !== 'completed' && booking.status !== 'cancelled' && (
                  <>
                    <button 
                      onClick={() => updateBookingStatus(booking.id, 'in_progress')}
                      className="text-xs bg-blue-100 text-blue-600 px-3 py-1 rounded hover:bg-blue-200"
                    >
                      Start
                    </button>
                    <button 
                      onClick={() => updateBookingStatus(booking.id, 'completed')}
                      className="text-xs bg-green-100 text-green-600 px-3 py-1 rounded hover:bg-green-200"
                    >
                      Complete
                    </button>
                    <button 
                      onClick={() => updateBookingStatus(booking.id, 'cancelled')}
                      className="text-xs bg-red-100 text-red-600 px-3 py-1 rounded hover:bg-red-200"
                    >
                      Cancel
                    </button>
                  </>
                )}
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
          {!isBatteryChargeOwner && batteryOwnerProfile && (
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
      {showBatteryOwnerProfile && batteryOwnerProfile && (
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
            <p className="text-2xl font-bold text-secondary">{garageStats?.completedServices || 0}</p>
            <p className="text-gray-600">Total Services</p>
          </div>
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <p className="text-2xl font-bold text-secondary">Rs. {garageStats?.monthlyRevenue?.toLocaleString() || 0}</p>
            <p className="text-gray-600">Revenue</p>
          </div>
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <p className="text-2xl font-bold text-secondary">{garageStats?.averageRating || 0}★</p>
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
    if (isLoading) {
      return (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      );
    }

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