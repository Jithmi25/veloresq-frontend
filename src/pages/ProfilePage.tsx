import React, { useState, useEffect } from 'react';
import { User, Mail, Phone, Calendar, Car, Settings, LogOut, Edit2, Save, X, MapPin, Clock, Star, Plus, Trash2 } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { bookingService } from '../services/bookingService';
import { facilityService } from '../services/authService';
import { userService } from '../services/authService';
import { Booking, Facility } from '../types';

const ProfilePage: React.FC = () => {
  const { user, logout, refreshUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [recentBookings, setRecentBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isFacilitiesLoading, setIsFacilitiesLoading] = useState(false);
  const [editForm, setEditForm] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    phoneNumber: user?.phoneNumber || '',
    garageName: user?.garageName || '',
    garageAddress: user?.garageAddress || '',
    businessLicense: user?.businessLicense || '',
  });

  const [facilities, setFacilities] = useState<Facility[]>([]);
  const [newFacility, setNewFacility] = useState({ name: '', description: '' });
  const [showAddFacility, setShowAddFacility] = useState(false);

  useEffect(() => {
    if (user) {
      if (user.role === 'customer') {
        loadRecentBookings();
      } else if (user.role === 'garage_owner') {
        loadFacilities();
      }
    }
  }, [user]);

  const loadRecentBookings = async () => {
    try {
      setIsLoading(true);
      const response = await bookingService.getUserBookings(1, 5);
      setRecentBookings(response.bookings || []);
    } catch (error: any) {
      console.error('Failed to load bookings:', error);
      
      // Set empty array as fallback
      setRecentBookings([]);
      
      // Show more specific error message
      const errorMessage = error.message || 'Failed to load recent bookings. Please try again.';
      
      // Don't show alert for network errors, just log them
      if (error.message?.includes('connect to the server') || error.message?.includes('not found')) {
        console.warn('Bookings service unavailable:', errorMessage);
      } else {
        alert(errorMessage);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const loadFacilities = async () => {
    try {
      setIsFacilitiesLoading(true);
      const response = await facilityService.getGarageFacilities();
      setFacilities(response.facilities);
    } catch (error) {
      console.error('Failed to load facilities:', error);
      alert('Failed to load garage facilities. Please try again.');
    } finally {
      setIsFacilitiesLoading(false);
    }
  };

  const handleSaveProfile = async () => {
    try {
      setIsLoading(true);
      await userService.updateUserProfile(editForm);
      await refreshUser();
      setIsEditing(false);
      alert('Profile updated successfully!');
    } catch (error) {
      console.error('Failed to update profile:', error);
      alert('Failed to update profile. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      setIsLoading(true);
      await logout();
    } catch (error) {
      console.error('Failed to logout:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const addFacility = async () => {
    if (!newFacility.name.trim() || !newFacility.description.trim()) {
      alert('Please fill all fields');
      return;
    }

    try {
      setIsFacilitiesLoading(true);
      const response = await facilityService.addFacility(newFacility);
      setFacilities([...facilities, response.facility]);
      setNewFacility({ name: '', description: '' });
      setShowAddFacility(false);
      alert('Facility added successfully!');
    } catch (error) {
      console.error('Failed to add facility:', error);
      alert('Failed to add facility. Please try again.');
    } finally {
      setIsFacilitiesLoading(false);
    }
  };

  const removeFacility = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this facility?')) return;

    try {
      setIsFacilitiesLoading(true);
      await facilityService.deleteFacility(id);
      setFacilities(facilities.filter(f => f.id !== id));
      alert('Facility deleted successfully!');
    } catch (error) {
      console.error('Failed to delete facility:', error);
      alert('Failed to delete facility. Please try again.');
    } finally {
      setIsFacilitiesLoading(false);
    }
  };

  const toggleFacilityStatus = async (id: string) => {
    try {
      setIsFacilitiesLoading(true);
      const facility = facilities.find(f => f.id === id);
      if (!facility) return;
      
      const updatedFacility = await facilityService.updateFacilityStatus(id, !facility.isActive);
      setFacilities(facilities.map(f => 
        f.id === id ? updatedFacility : f
      ));
    } catch (error) {
      console.error('Failed to update facility status:', error);
      alert('Failed to update facility status. Please try again.');
    } finally {
      setIsFacilitiesLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-green-600 bg-green-100';
      case 'confirmed': return 'text-blue-600 bg-blue-100';
      case 'pending': return 'text-yellow-600 bg-yellow-100';
      case 'cancelled': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-light py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Profile Header */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <div className="w-20 h-20 bg-primary rounded-full flex items-center justify-center">
                <User className="h-10 w-10 text-secondary" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-secondary">
                  {user.firstName} {user.lastName}
                </h1>
                <p className="text-gray-600 capitalize">{user.role.replace('_', ' ')}</p>
                {user.role === 'garage_owner' && user.garageName && (
                  <p className="text-primary font-semibold">{user.garageName}</p>
                )}
                <div className="flex items-center mt-2">
                  <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                    user.isVerified ? 'bg-green-100 text-green-600' : 'bg-yellow-100 text-yellow-600'
                  }`}>
                    {user.isVerified ? 'Verified' : 'Pending Verification'}
                  </div>
                </div>
              </div>
            </div>
            <div className="flex space-x-3">
              <button
                onClick={() => setIsEditing(!isEditing)}
                disabled={isLoading}
                className="flex items-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200 disabled:opacity-50"
              >
                {isEditing ? <X className="h-4 w-4 mr-2" /> : <Edit2 className="h-4 w-4 mr-2" />}
                {isEditing ? 'Cancel' : 'Edit Profile'}
              </button>
              <button
                onClick={handleLogout}
                disabled={isLoading}
                className="flex items-center px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors duration-200 disabled:opacity-50"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </button>
            </div>
          </div>

          {/* Profile Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-secondary mb-2">First Name</label>
              {isEditing ? (
                <input
                  type="text"
                  value={editForm.firstName}
                  onChange={(e) => setEditForm(prev => ({ ...prev, firstName: e.target.value }))}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  disabled={isLoading}
                />
              ) : (
                <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                  <User className="h-5 w-5 text-gray-400 mr-3" />
                  <span className="text-secondary">{user.firstName}</span>
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-secondary mb-2">Last Name</label>
              {isEditing ? (
                <input
                  type="text"
                  value={editForm.lastName}
                  onChange={(e) => setEditForm(prev => ({ ...prev, lastName: e.target.value }))}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  disabled={isLoading}
                />
              ) : (
                <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                  <User className="h-5 w-5 text-gray-400 mr-3" />
                  <span className="text-secondary">{user.lastName}</span>
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-secondary mb-2">Email</label>
              <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                <Mail className="h-5 w-5 text-gray-400 mr-3" />
                <span className="text-secondary">{user.email}</span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-secondary mb-2">Phone Number</label>
              {isEditing ? (
                <input
                  type="tel"
                  value={editForm.phoneNumber}
                  onChange={(e) => setEditForm(prev => ({ ...prev, phoneNumber: e.target.value }))}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  disabled={isLoading}
                />
              ) : (
                <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                  <Phone className="h-5 w-5 text-gray-400 mr-3" />
                  <span className="text-secondary">{user.phoneNumber}</span>
                </div>
              )}
            </div>

            {/* Garage Owner Specific Fields */}
            {user.role === 'garage_owner' && (
              <>
                <div>
                  <label className="block text-sm font-medium text-secondary mb-2">Garage Name</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={editForm.garageName}
                      onChange={(e) => setEditForm(prev => ({ ...prev, garageName: e.target.value }))}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                      disabled={isLoading}
                    />
                  ) : (
                    <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                      <Car className="h-5 w-5 text-gray-400 mr-3" />
                      <span className="text-secondary">{user.garageName || 'Not specified'}</span>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-secondary mb-2">Business License</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={editForm.businessLicense}
                      onChange={(e) => setEditForm(prev => ({ ...prev, businessLicense: e.target.value }))}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                      disabled={isLoading}
                    />
                  ) : (
                    <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                      <Settings className="h-5 w-5 text-gray-400 mr-3" />
                      <span className="text-secondary">{user.businessLicense || 'Not specified'}</span>
                    </div>
                  )}
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-secondary mb-2">Garage Address</label>
                  {isEditing ? (
                    <textarea
                      value={editForm.garageAddress}
                      onChange={(e) => setEditForm(prev => ({ ...prev, garageAddress: e.target.value }))}
                      rows={3}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                      disabled={isLoading}
                    />
                  ) : (
                    <div className="flex items-start p-3 bg-gray-50 rounded-lg">
                      <MapPin className="h-5 w-5 text-gray-400 mr-3 mt-0.5" />
                      <span className="text-secondary">{user.garageAddress || 'Not specified'}</span>
                    </div>
                  )}
                </div>
              </>
            )}

            <div>
              <label className="block text-sm font-medium text-secondary mb-2">Member Since</label>
              <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                <Calendar className="h-5 w-5 text-gray-400 mr-3" />
                <span className="text-secondary">
                  {new Date(user.createdAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </span>
              </div>
            </div>
          </div>

          {isEditing && (
            <div className="mt-6 flex justify-end">
              <button
                onClick={handleSaveProfile}
                disabled={isLoading}
                className="flex items-center px-6 py-2 bg-primary text-secondary rounded-lg hover:bg-primary-dark transition-colors duration-200 disabled:opacity-50"
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Save Changes
                  </>
                )}
              </button>
            </div>
          )}
        </div>

        {/* Garage Facilities (for garage owners) */}
        {user.role === 'garage_owner' && (
          <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-secondary flex items-center">
                <Settings className="h-6 w-6 mr-2" />
                Garage Facilities
              </h2>
              <button
                onClick={() => setShowAddFacility(true)}
                disabled={isFacilitiesLoading}
                className="flex items-center px-4 py-2 bg-primary text-secondary rounded-lg hover:bg-primary-dark transition-colors duration-200 disabled:opacity-50"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Facility
              </button>
            </div>

            {/* Add Facility Form */}
            {showAddFacility && (
              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <h3 className="font-semibold text-secondary mb-3">Add New Facility</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input
                    type="text"
                    placeholder="Facility name"
                    value={newFacility.name}
                    onChange={(e) => setNewFacility(prev => ({ ...prev, name: e.target.value }))}
                    className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    disabled={isFacilitiesLoading}
                  />
                  <input
                    type="text"
                    placeholder="Description"
                    value={newFacility.description}
                    onChange={(e) => setNewFacility(prev => ({ ...prev, description: e.target.value }))}
                    className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    disabled={isFacilitiesLoading}
                  />
                </div>
                <div className="flex space-x-3 mt-4">
                  <button
                    onClick={addFacility}
                    disabled={isFacilitiesLoading}
                    className="bg-primary text-secondary px-4 py-2 rounded-lg hover:bg-primary-dark transition-colors duration-200 disabled:opacity-50"
                  >
                    {isFacilitiesLoading ? 'Adding...' : 'Add Facility'}
                  </button>
                  <button
                    onClick={() => {
                      setShowAddFacility(false);
                      setNewFacility({ name: '', description: '' });
                    }}
                    disabled={isFacilitiesLoading}
                    className="border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors duration-200 disabled:opacity-50"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}

            {/* Facilities List */}
            {isFacilitiesLoading && facilities.length === 0 ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            ) : facilities.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {facilities.map((facility) => (
                  <div key={facility.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold text-secondary">{facility.name}</h4>
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => toggleFacilityStatus(facility.id)}
                          disabled={isFacilitiesLoading}
                          className={`px-2 py-1 text-xs font-medium rounded-full ${
                            facility.isActive 
                              ? 'bg-green-100 text-green-600' 
                              : 'bg-red-100 text-red-600'
                          } disabled:opacity-50`}
                        >
                          {facility.isActive ? 'Active' : 'Inactive'}
                        </button>
                        <button
                          onClick={() => removeFacility(facility.id)}
                          disabled={isFacilitiesLoading}
                          className="text-red-500 hover:text-red-700 transition-colors duration-200 disabled:opacity-50"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600">{facility.description}</p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Settings className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">No facilities added yet</p>
              </div>
            )}
          </div>
        )}

        {/* Recent Bookings (for customers) */}
        {user.role === 'customer' && (
          <div className="bg-white rounded-xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-secondary mb-6 flex items-center">
              <Car className="h-6 w-6 mr-2" />
              Recent Bookings
            </h2>

            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            ) : recentBookings.length > 0 ? (
              <div className="space-y-4">
                {recentBookings.map((booking) => (
                  <div key={booking.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors duration-200">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-3">
                        <span className="font-semibold text-secondary">#{booking.id.slice(-8)}</span>
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(booking.status)}`}>
                          {booking.status.toUpperCase()}
                        </span>
                      </div>
                      <span className="text-sm text-gray-500">
                        {new Date(booking.scheduledDateTime).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                      <div>
                        <span className="font-medium text-gray-600">Garage:</span>
                        <p className="text-secondary">{booking.garage?.name || 'N/A'}</p>
                      </div>
                      <div>
                        <span className="font-medium text-gray-600">Service:</span>
                        <p className="text-secondary">{booking.service?.name || 'N/A'}</p>
                      </div>
                      <div>
                        <span className="font-medium text-gray-600">Amount:</span>
                        <p className="text-secondary font-semibold">Rs. {booking.totalAmount.toLocaleString()}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Car className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">No bookings found</p>
                <button className="mt-4 bg-primary text-secondary px-6 py-2 rounded-lg hover:bg-primary-dark transition-colors duration-200">
                  Book Your First Service
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;