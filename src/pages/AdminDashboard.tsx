import React, { useState } from 'react';
import { Users, Car, Settings, BarChart3, AlertTriangle, CheckCircle, Clock, MapPin, Shield, Database, Bell, Key, Globe, Mail, Battery, Zap } from 'lucide-react';

const AdminDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');

  const stats = [
    { label: 'Total Users', value: '12,847', change: '+12%', icon: Users, color: 'text-blue-600', bg: 'bg-blue-100' },
    { label: 'Active Garages', value: '524', change: '+8%', icon: Car, color: 'text-green-600', bg: 'bg-green-100' },
    { label: 'Charging Stations', value: '89', change: '+25%', icon: Battery, color: 'text-yellow-600', bg: 'bg-yellow-100' },
    { label: 'Emergency Calls', value: '23', change: '-5%', icon: AlertTriangle, color: 'text-red-600', bg: 'bg-red-100' },
  ];

  const recentBookings = [
    { id: 'B001', user: 'John Silva', garage: 'AutoCare Pro', service: 'Oil Change', status: 'completed', time: '2 hours ago' },
    { id: 'B002', user: 'Maya Perera', garage: 'QuickFix Garage', service: 'Brake Service', status: 'in-progress', time: '45 minutes ago' },
    { id: 'B003', user: 'Ravi Kumar', garage: 'Elite Motors', service: 'Engine Diagnostic', status: 'scheduled', time: '1 hour ago' },
    { id: 'B004', user: 'Sara Fernando', garage: 'AutoCare Pro', service: 'Full Service', status: 'completed', time: '3 hours ago' },
  ];

  const chargingStations = [
    { id: 'C001', name: 'PowerHub Colombo', location: 'Colombo 03', ports: 8, activeCharging: 5, revenue: 45000, status: 'active' },
    { id: 'C002', name: 'EcoCharge Kandy', location: 'Kandy', ports: 6, activeCharging: 3, revenue: 32000, status: 'active' },
    { id: 'C003', name: 'QuickCharge Galle', location: 'Galle', ports: 4, activeCharging: 2, revenue: 28000, status: 'active' },
    { id: 'C004', name: 'GreenPower Negombo', location: 'Negombo', ports: 6, activeCharging: 0, revenue: 15000, status: 'maintenance' },
  ];

  const batteryChargeOwners = [
    { id: 'BCO001', name: 'PowerTech Solutions', email: 'contact@powertech.lk', stations: 3, totalPorts: 18, monthlyRevenue: 125000, status: 'active' },
    { id: 'BCO002', name: 'EcoEnergy Lanka', email: 'info@ecoenergy.lk', stations: 2, totalPorts: 12, monthlyRevenue: 85000, status: 'active' },
    { id: 'BCO003', name: 'GreenCharge Network', email: 'support@greencharge.lk', stations: 4, totalPorts: 24, monthlyRevenue: 156000, status: 'active' },
  ];

  const emergencyRequests = [
    { id: 'E001', user: 'David Wilson', location: 'Galle Road, Colombo 3', type: 'Vehicle Breakdown', status: 'dispatched', time: '10 minutes ago' },
    { id: 'E002', user: 'Lisa Chen', location: 'Kandy Road, Kelaniya', type: 'Flat Tire', status: 'completed', time: '2 hours ago' },
    { id: 'E003', user: 'Ahmed Hassan', location: 'Nugegoda Junction', type: 'Battery Issues', status: 'in-progress', time: '35 minutes ago' },
  ];

  const garages = [
    { id: 'G001', name: 'AutoCare Pro', location: 'Colombo 03', rating: 4.8, bookings: 45, status: 'active' },
    { id: 'G002', name: 'QuickFix Garage', location: 'Kandy Road', rating: 4.6, bookings: 32, status: 'active' },
    { id: 'G003', name: 'Elite Motors', location: 'Galle Road', rating: 4.9, bookings: 28, status: 'active' },
    { id: 'G004', name: 'Metro Service', location: 'Nugegoda', rating: 4.5, bookings: 18, status: 'inactive' },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-green-600 bg-green-100';
      case 'in-progress': return 'text-blue-600 bg-blue-100';
      case 'scheduled': return 'text-yellow-600 bg-yellow-100';
      case 'dispatched': return 'text-purple-600 bg-purple-100';
      case 'active': return 'text-green-600 bg-green-100';
      case 'inactive': return 'text-red-600 bg-red-100';
      case 'maintenance': return 'text-orange-600 bg-orange-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <div className="space-y-6">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {stats.map((stat, index) => (
                <div key={index} className="bg-white rounded-xl shadow-lg p-6 animate-fade-in">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-600 text-sm font-medium">{stat.label}</p>
                      <p className="text-2xl font-bold text-secondary mt-1">{stat.value}</p>
                      <p className={`text-sm mt-1 ${stat.change.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
                        {stat.change} from last month
                      </p>
                    </div>
                    <div className={`p-3 rounded-full ${stat.bg}`}>
                      <stat.icon className={`h-6 w-6 ${stat.color}`} />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-xl font-bold text-secondary mb-4">Booking Trends</h3>
                <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
                  <div className="text-center text-gray-500">
                    <BarChart3 className="h-12 w-12 mx-auto mb-2" />
                    <p>Chart visualization would appear here</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-xl font-bold text-secondary mb-4">Charging Station Usage</h3>
                <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
                  <div className="text-center text-gray-500">
                    <Battery className="h-12 w-12 mx-auto mb-2" />
                    <p>Charging analytics would appear here</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 'bookings':
        return (
          <div className="bg-white rounded-xl shadow-lg">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-xl font-bold text-secondary">Recent Bookings</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Booking ID</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Garage</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Service</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {recentBookings.map((booking) => (
                    <tr key={booking.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-secondary">{booking.id}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{booking.user}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{booking.garage}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{booking.service}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(booking.status)}`}>
                          {booking.status.toUpperCase()}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{booking.time}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );

      case 'charging':
        return (
          <div className="space-y-6">
            {/* Charging Stations Overview */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-xl font-bold text-secondary mb-4 flex items-center">
                <Battery className="h-5 w-5 mr-2 text-green-600" />
                Charging Stations Management
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Station ID</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ports</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Active</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Revenue</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {chargingStations.map((station) => (
                      <tr key={station.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-secondary">{station.id}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{station.name}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{station.location}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{station.ports}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{station.activeCharging}/{station.ports}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">Rs. {station.revenue.toLocaleString()}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(station.status)}`}>
                            {station.status.toUpperCase()}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Battery Charge Owners */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-xl font-bold text-secondary mb-4 flex items-center">
                <Zap className="h-5 w-5 mr-2 text-yellow-600" />
                Battery Charge Owners
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {batteryChargeOwners.map((owner) => (
                  <div key={owner.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors duration-200">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-semibold text-secondary">{owner.name}</h4>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(owner.status)}`}>
                        {owner.status.toUpperCase()}
                      </span>
                    </div>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Email:</span>
                        <span className="text-secondary">{owner.email}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Stations:</span>
                        <span className="text-secondary">{owner.stations}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Total Ports:</span>
                        <span className="text-secondary">{owner.totalPorts}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Monthly Revenue:</span>
                        <span className="text-secondary font-semibold">Rs. {owner.monthlyRevenue.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case 'emergency':
        return (
          <div className="bg-white rounded-xl shadow-lg">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-xl font-bold text-secondary flex items-center">
                <AlertTriangle className="h-5 w-5 mr-2 text-red-600" />
                Emergency Requests
              </h3>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {emergencyRequests.map((request) => (
                  <div key={request.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-3">
                        <span className="font-medium text-secondary">{request.id}</span>
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(request.status)}`}>
                          {request.status.toUpperCase()}
                        </span>
                      </div>
                      <span className="text-sm text-gray-500">{request.time}</span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                      <div>
                        <span className="font-medium text-gray-600">User:</span>
                        <p className="text-secondary">{request.user}</p>
                      </div>
                      <div>
                        <span className="font-medium text-gray-600">Location:</span>
                        <p className="text-secondary flex items-center">
                          <MapPin className="h-4 w-4 mr-1" />
                          {request.location}
                        </p>
                      </div>
                      <div>
                        <span className="font-medium text-gray-600">Type:</span>
                        <p className="text-secondary">{request.type}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case 'garages':
        return (
          <div className="bg-white rounded-xl shadow-lg">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-xl font-bold text-secondary">Garage Management</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Garage ID</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rating</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Bookings</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {garages.map((garage) => (
                    <tr key={garage.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-secondary">{garage.id}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{garage.name}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{garage.location}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                        <div className="flex items-center">
                          <span className="text-yellow-400">★</span>
                          <span className="ml-1">{garage.rating}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{garage.bookings}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(garage.status)}`}>
                          {garage.status.toUpperCase()}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );

      case 'settings':
        return (
          <div className="space-y-6">
            <h3 className="text-2xl font-bold text-secondary">Platform Settings</h3>
            
            {/* System Configuration */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h4 className="text-xl font-bold text-secondary mb-4 flex items-center">
                <Database className="h-5 w-5 mr-2" />
                System Configuration
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-secondary mb-2">Platform Name</label>
                  <input
                    type="text"
                    defaultValue="Veloresq"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-secondary mb-2">Support Email</label>
                  <input
                    type="email"
                    defaultValue="support@veloresq.com"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-secondary mb-2">Emergency Hotline</label>
                  <input
                    type="tel"
                    defaultValue="+94 77 911 0000"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-secondary mb-2">Charging Rate (Rs/kWh)</label>
                  <input
                    type="number"
                    defaultValue="35"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>
              </div>
            </div>

            {/* Save Settings */}
            <div className="flex justify-end space-x-4">
              <button className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200">
                Reset to Defaults
              </button>
              <button className="px-6 py-3 bg-primary text-secondary rounded-lg hover:bg-primary-dark transition-colors duration-200">
                Save All Settings
              </button>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-light py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-secondary mb-2">Admin Dashboard</h1>
          <p className="text-xl text-gray-600">Manage your Veloresq platform</p>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-white rounded-xl shadow-lg mb-8">
          <div className="flex overflow-x-auto">
            {[
              { id: 'overview', label: 'Overview', icon: BarChart3 },
              { id: 'bookings', label: 'Bookings', icon: Clock },
              { id: 'charging', label: 'Charging Stations', icon: Battery },
              { id: 'emergency', label: 'Emergency', icon: AlertTriangle },
              { id: 'garages', label: 'Garages', icon: Car },
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

export default AdminDashboard;