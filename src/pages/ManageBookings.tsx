import React, { useState } from 'react';
import { Calendar, Clock, User, Car, Phone, Mail, CheckCircle, XCircle, AlertCircle, Filter, Search, Download } from 'lucide-react';

const ManageBookings: React.FC = () => {
  const [activeFilter, setActiveFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDate, setSelectedDate] = useState('');

  // HARDCODED DATA - Replace with backend integration
  const bookings = [
    {
      id: 'B001',
      customerName: 'John Silva',
      customerPhone: '+94 77 123 4567',
      customerEmail: 'john.silva@email.com',
      service: 'Oil Change',
      vehicle: '2020 Toyota Corolla - ABC-1234',
      scheduledDate: '2025-01-15',
      scheduledTime: '10:00 AM',
      status: 'confirmed',
      amount: 2500,
      specialRequests: 'Please check tire pressure as well',
      createdAt: '2025-01-10T08:30:00Z'
    },
    {
      id: 'B002',
      customerName: 'Maya Perera',
      customerPhone: '+94 77 234 5678',
      customerEmail: 'maya.perera@email.com',
      service: 'Brake Service',
      vehicle: '2019 Honda Civic - XYZ-5678',
      scheduledDate: '2025-01-15',
      scheduledTime: '11:30 AM',
      status: 'in_progress',
      amount: 8500,
      specialRequests: '',
      createdAt: '2025-01-12T14:20:00Z'
    },
    {
      id: 'B003',
      customerName: 'Ravi Kumar',
      customerPhone: '+94 77 345 6789',
      customerEmail: 'ravi.kumar@email.com',
      service: 'Battery Service',
      vehicle: '2021 Nissan Sentra - DEF-9012',
      scheduledDate: '2025-01-15',
      scheduledTime: '2:00 PM',
      status: 'pending',
      amount: 4500,
      specialRequests: 'Customer will bring own battery',
      createdAt: '2025-01-13T09:15:00Z'
    },
    {
      id: 'B004',
      customerName: 'Sara Fernando',
      customerPhone: '+94 77 456 7890',
      customerEmail: 'sara.fernando@email.com',
      service: 'Engine Diagnostic',
      vehicle: '2018 Suzuki Swift - GHI-3456',
      scheduledDate: '2025-01-15',
      scheduledTime: '3:30 PM',
      status: 'confirmed',
      amount: 5000,
      specialRequests: 'Engine making strange noise',
      createdAt: '2025-01-11T16:45:00Z'
    },
    {
      id: 'B005',
      customerName: 'David Wilson',
      customerPhone: '+94 77 567 8901',
      customerEmail: 'david.wilson@email.com',
      service: 'AC Service',
      vehicle: '2020 Hyundai i20 - JKL-7890',
      scheduledDate: '2025-01-16',
      scheduledTime: '9:00 AM',
      status: 'completed',
      amount: 6500,
      specialRequests: 'AC not cooling properly',
      createdAt: '2025-01-09T11:30:00Z'
    },
    {
      id: 'B006',
      customerName: 'Lisa Chen',
      customerPhone: '+94 77 678 9012',
      customerEmail: 'lisa.chen@email.com',
      service: 'Full Service',
      vehicle: '2019 Mitsubishi Lancer - MNO-2345',
      scheduledDate: '2025-01-16',
      scheduledTime: '10:30 AM',
      status: 'cancelled',
      amount: 15000,
      specialRequests: 'Complete vehicle inspection needed',
      createdAt: '2025-01-08T13:20:00Z'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-green-600 bg-green-100 border-green-200';
      case 'in_progress': return 'text-blue-600 bg-blue-100 border-blue-200';
      case 'confirmed': return 'text-yellow-600 bg-yellow-100 border-yellow-200';
      case 'pending': return 'text-orange-600 bg-orange-100 border-orange-200';
      case 'cancelled': return 'text-red-600 bg-red-100 border-red-200';
      default: return 'text-gray-600 bg-gray-100 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="h-4 w-4" />;
      case 'in_progress': return <Clock className="h-4 w-4" />;
      case 'confirmed': return <CheckCircle className="h-4 w-4" />;
      case 'pending': return <AlertCircle className="h-4 w-4" />;
      case 'cancelled': return <XCircle className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  const filteredBookings = bookings.filter(booking => {
    const matchesFilter = activeFilter === 'all' || booking.status === activeFilter;
    const matchesSearch = booking.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         booking.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         booking.service.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDate = !selectedDate || booking.scheduledDate === selectedDate;
    
    return matchesFilter && matchesSearch && matchesDate;
  });

  const updateBookingStatus = (bookingId: string, newStatus: string) => {
    // TODO: BACKEND INTEGRATION - Update booking status
    console.log('Update booking status:', bookingId, newStatus);
    alert(`Booking ${bookingId} status updated to ${newStatus}`);
  };

  const exportBookings = () => {
    // TODO: BACKEND INTEGRATION - Export bookings data
    console.log('Export bookings data');
    alert('Export functionality - Backend integration needed');
  };

  const filterOptions = [
    { value: 'all', label: 'All Bookings', count: bookings.length },
    { value: 'pending', label: 'Pending', count: bookings.filter(b => b.status === 'pending').length },
    { value: 'confirmed', label: 'Confirmed', count: bookings.filter(b => b.status === 'confirmed').length },
    { value: 'in_progress', label: 'In Progress', count: bookings.filter(b => b.status === 'in_progress').length },
    { value: 'completed', label: 'Completed', count: bookings.filter(b => b.status === 'completed').length },
    { value: 'cancelled', label: 'Cancelled', count: bookings.filter(b => b.status === 'cancelled').length }
  ];

  return (
    <div className="min-h-screen bg-gray-light py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-secondary mb-2">Manage Bookings</h1>
            <p className="text-xl text-gray-600">Track and manage all your garage bookings</p>
          </div>
          <button
            onClick={exportBookings}
            className="bg-primary text-secondary px-4 py-2 rounded-lg hover:bg-primary-dark transition-colors duration-200 flex items-center"
          >
            <Download className="h-4 w-4 mr-2" />
            Export
          </button>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Search by customer name, booking ID, or service..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>

            {/* Date Filter */}
            <div className="lg:w-48">
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>

            {/* Clear Filters */}
            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedDate('');
                setActiveFilter('all');
              }}
              className="px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200"
            >
              Clear
            </button>
          </div>

          {/* Status Filters */}
          <div className="flex flex-wrap gap-2 mt-4">
            {filterOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => setActiveFilter(option.value)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
                  activeFilter === option.value
                    ? 'bg-primary text-secondary'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {option.label} ({option.count})
              </button>
            ))}
          </div>
        </div>

        {/* Bookings List */}
        <div className="space-y-4">
          {filteredBookings.length > 0 ? (
            filteredBookings.map((booking) => (
              <div key={booking.id} className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-200">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <span className="text-lg font-bold text-secondary">#{booking.id}</span>
                    <div className={`flex items-center space-x-1 px-3 py-1 rounded-full border ${getStatusColor(booking.status)}`}>
                      {getStatusIcon(booking.status)}
                      <span className="text-sm font-medium capitalize">{booking.status.replace('_', ' ')}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-secondary">Rs. {booking.amount.toLocaleString()}</p>
                    <p className="text-sm text-gray-600">
                      {new Date(booking.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-4">
                  {/* Customer Info */}
                  <div>
                    <h4 className="font-semibold text-secondary mb-2 flex items-center">
                      <User className="h-4 w-4 mr-2" />
                      Customer
                    </h4>
                    <p className="text-gray-700 font-medium">{booking.customerName}</p>
                    <p className="text-sm text-gray-600 flex items-center mt-1">
                      <Phone className="h-3 w-3 mr-1" />
                      {booking.customerPhone}
                    </p>
                    <p className="text-sm text-gray-600 flex items-center mt-1">
                      <Mail className="h-3 w-3 mr-1" />
                      {booking.customerEmail}
                    </p>
                  </div>

                  {/* Service Info */}
                  <div>
                    <h4 className="font-semibold text-secondary mb-2 flex items-center">
                      <Car className="h-4 w-4 mr-2" />
                      Service
                    </h4>
                    <p className="text-gray-700 font-medium">{booking.service}</p>
                    <p className="text-sm text-gray-600 mt-1">{booking.vehicle}</p>
                  </div>

                  {/* Schedule Info */}
                  <div>
                    <h4 className="font-semibold text-secondary mb-2 flex items-center">
                      <Calendar className="h-4 w-4 mr-2" />
                      Schedule
                    </h4>
                    <p className="text-gray-700 font-medium">
                      {new Date(booking.scheduledDate).toLocaleDateString()}
                    </p>
                    <p className="text-sm text-gray-600 flex items-center mt-1">
                      <Clock className="h-3 w-3 mr-1" />
                      {booking.scheduledTime}
                    </p>
                  </div>

                  {/* Actions */}
                  <div>
                    <h4 className="font-semibold text-secondary mb-2">Actions</h4>
                    <div className="space-y-2">
                      {booking.status === 'pending' && (
                        <button
                          onClick={() => updateBookingStatus(booking.id, 'confirmed')}
                          className="w-full bg-green-500 text-white px-3 py-1 rounded text-sm hover:bg-green-600 transition-colors duration-200"
                        >
                          Confirm
                        </button>
                      )}
                      {booking.status === 'confirmed' && (
                        <button
                          onClick={() => updateBookingStatus(booking.id, 'in_progress')}
                          className="w-full bg-blue-500 text-white px-3 py-1 rounded text-sm hover:bg-blue-600 transition-colors duration-200"
                        >
                          Start Service
                        </button>
                      )}
                      {booking.status === 'in_progress' && (
                        <button
                          onClick={() => updateBookingStatus(booking.id, 'completed')}
                          className="w-full bg-primary text-secondary px-3 py-1 rounded text-sm hover:bg-primary-dark transition-colors duration-200"
                        >
                          Complete
                        </button>
                      )}
                      {(booking.status === 'pending' || booking.status === 'confirmed') && (
                        <button
                          onClick={() => updateBookingStatus(booking.id, 'cancelled')}
                          className="w-full bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600 transition-colors duration-200"
                        >
                          Cancel
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                {/* Special Requests */}
                {booking.specialRequests && (
                  <div className="bg-gray-50 rounded-lg p-3">
                    <h5 className="font-medium text-secondary mb-1">Special Requests:</h5>
                    <p className="text-sm text-gray-700">{booking.specialRequests}</p>
                  </div>
                )}
              </div>
            ))
          ) : (
            <div className="bg-white rounded-xl shadow-lg p-12 text-center">
              <Calendar className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-secondary mb-2">No bookings found</h3>
              <p className="text-gray-600">
                {searchTerm || selectedDate || activeFilter !== 'all'
                  ? 'Try adjusting your search criteria or filters'
                  : 'No bookings have been made yet'}
              </p>
            </div>
          )}
        </div>

        {/* Summary Stats */}
        <div className="mt-8 bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-xl font-bold text-secondary mb-4">Booking Summary</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <p className="text-2xl font-bold text-secondary">{filteredBookings.length}</p>
              <p className="text-gray-600">Total Bookings</p>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <p className="text-2xl font-bold text-secondary">
                Rs. {filteredBookings.reduce((sum, booking) => sum + booking.amount, 0).toLocaleString()}
              </p>
              <p className="text-gray-600">Total Revenue</p>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <p className="text-2xl font-bold text-secondary">
                {filteredBookings.filter(b => b.status === 'completed').length}
              </p>
              <p className="text-gray-600">Completed</p>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <p className="text-2xl font-bold text-secondary">
                {filteredBookings.filter(b => b.status === 'pending').length}
              </p>
              <p className="text-gray-600">Pending</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManageBookings;