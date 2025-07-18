import React, { useState } from 'react';
import { Search, MapPin, Zap, Shield, Users, Clock, Car, Wrench, CheckCircle, Star } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import GarageCard from '../components/GarageCard';

const HomePage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [location, setLocation] = useState('');
  const navigate = useNavigate();
  const { user } = useAuth();

  // If user is admin, redirect to admin dashboard
  if (user?.role === 'admin') {
    navigate('/admin');
    return null;
  }

  // Mock data
  const featuredGarages = [
    {
      id: '1',
      name: 'AutoCare Pro',
      location: 'Colombo 03',
      distance: 2.5,
      rating: 4.8,
      reviewCount: 127,
      queueLength: 3,
      estimatedWait: '45 mins',
      status: 'open' as const,
      services: [
        { name: 'Oil Change', price: 2500, duration: '30 mins' },
        { name: 'Brake Service', price: 8500, duration: '1.5 hours' },
        { name: 'Engine Diagnostic', price: 5000, duration: '45 mins' },
        { name: 'Tire Change', price: 3500, duration: '20 mins' },
      ],
    },
    {
      id: '2',
      name: 'QuickFix Garage',
      location: 'Kandy Road',
      distance: 4.1,
      rating: 4.6,
      reviewCount: 89,
      queueLength: 7,
      estimatedWait: '1.5 hours',
      status: 'busy' as const,
      services: [
        { name: 'Quick Service', price: 1500, duration: '15 mins' },
        { name: 'Battery Check', price: 1000, duration: '10 mins' },
        { name: 'AC Service', price: 6500, duration: '2 hours' },
      ],
    },
    {
      id: '3',
      name: 'Elite Motors',
      location: 'Galle Road',
      distance: 3.8,
      rating: 4.9,
      reviewCount: 203,
      queueLength: 2,
      estimatedWait: '30 mins',
      status: 'open' as const,
      services: [
        { name: 'Full Service', price: 15000, duration: '3 hours' },
        { name: 'Paint Touch-up', price: 12000, duration: '4 hours' },
        { name: 'Engine Tune-up', price: 18000, duration: '2.5 hours' },
      ],
    },
  ];

  const features = [
    {
      icon: MapPin,
      title: 'Find Nearby Garages',
      description: 'Discover trusted garages in your area with real-time availability and queue information.',
    },
    {
      icon: Clock,
      title: 'Real-time Queue Updates',
      description: 'Know exactly how long you\'ll wait with live queue tracking and estimated service times.',
    },
    {
      icon: Shield,
      title: 'AI Diagnosis',
      description: 'Upload car sounds for instant AI-powered diagnosis before visiting the garage.',
    },
    {
      icon: Zap,
      title: 'Emergency Service',
      description: 'One-tap SOS dispatch for roadside emergencies with live tracking support.',
    },
  ];

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (searchTerm) params.append('search', searchTerm);
    if (location) params.append('location', location);
    
    navigate(`/garages?${params.toString()}`);
  };

  // Show different content for garage owners
  if (user?.role === 'garage_owner') {
    return (
      <div className="min-h-screen">
        {/* Garage Owner Hero Section */}
        <section className="bg-gradient-to-r from-secondary to-gray-dark text-accent py-20 px-4">
          <div className="max-w-7xl mx-auto text-center">
            <div className="animate-fade-in">
              <h1 className="text-4xl md:text-6xl font-bold mb-6">
                Welcome Back,
                <span className="text-primary block">{user.firstName}!</span>
              </h1>
              <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto">
                Manage your garage operations, track bookings, and grow your automotive service business with Veloresq.
              </p>
            </div>

            {/* Quick Actions for Garage Owners */}
            <div className="mt-12 flex flex-wrap justify-center gap-4">
              <Link
                to="/garage-dashboard"
                className="bg-primary text-secondary px-6 py-3 rounded-lg font-semibold hover:bg-primary-dark transition-all duration-200 transform hover:scale-105 flex items-center"
              >
                <Car className="h-5 w-5 mr-2" />
                Garage Dashboard
              </Link>
              <Link
                to="/manage-bookings"
                className="border-2 border-primary text-primary px-6 py-3 rounded-lg font-semibold hover:bg-primary hover:text-secondary transition-all duration-200 transform hover:scale-105 flex items-center"
              >
                <Clock className="h-5 w-5 mr-2" />
                Manage Bookings
              </Link>
              <Link
                to="/profile"
                className="border-2 border-accent text-accent px-6 py-3 rounded-lg font-semibold hover:bg-accent hover:text-secondary transition-all duration-200 transform hover:scale-105 flex items-center"
              >
                <Shield className="h-5 w-5 mr-2" />
                Garage Settings
              </Link>
            </div>
          </div>
        </section>

        {/* Quick Stats for Garage Owners */}
        <section className="py-20 px-4 bg-white">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-secondary mb-4">
                Your Garage at a Glance
              </h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Quick overview of your garage performance and operations
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              <div className="animate-fade-in">
                <div className="text-4xl md:text-5xl font-bold text-primary mb-2">12</div>
                <div className="text-gray-600">Today's Bookings</div>
              </div>
              <div className="animate-fade-in" style={{ animationDelay: '0.1s' }}>
                <div className="text-4xl md:text-5xl font-bold text-primary mb-2">156</div>
                <div className="text-gray-600">Total This Month</div>
              </div>
              <div className="animate-fade-in" style={{ animationDelay: '0.2s' }}>
                <div className="text-4xl md:text-5xl font-bold text-primary mb-2">4.8★</div>
                <div className="text-gray-600">Average Rating</div>
              </div>
              <div className="animate-fade-in" style={{ animationDelay: '0.3s' }}>
                <div className="text-4xl md:text-5xl font-bold text-primary mb-2">5</div>
                <div className="text-gray-600">Current Queue</div>
              </div>
            </div>
          </div>
        </section>

        {/* Recent Activity */}
        <section className="py-20 px-4 bg-gray-light">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-secondary mb-4">
                Recent Activity
              </h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Stay updated with your latest bookings and customer interactions
              </p>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-8">
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                      <CheckCircle className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <p className="font-semibold text-secondary">Service Completed</p>
                      <p className="text-sm text-gray-600">John Silva - Oil Change</p>
                    </div>
                  </div>
                  <span className="text-sm text-gray-500">2 hours ago</span>
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <Clock className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-semibold text-secondary">New Booking</p>
                      <p className="text-sm text-gray-600">Maya Perera - Brake Service</p>
                    </div>
                  </div>
                  <span className="text-sm text-gray-500">4 hours ago</span>
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center">
                      <Star className="h-5 w-5 text-yellow-600" />
                    </div>
                    <div>
                      <p className="font-semibold text-secondary">New Review</p>
                      <p className="text-sm text-gray-600">5-star rating from Ravi Kumar</p>
                    </div>
                  </div>
                  <span className="text-sm text-gray-500">6 hours ago</span>
                </div>
              </div>

              <div className="text-center mt-6">
                <Link
                  to="/manage-bookings"
                  className="bg-secondary text-primary px-8 py-3 rounded-lg font-semibold hover:bg-gray-dark transition-all duration-200 transform hover:scale-105"
                >
                  View All Bookings
                </Link>
              </div>
            </div>
          </div>
        </section>
      </div>
    );
  }

  // Default content for customers and non-authenticated users
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-secondary to-gray-dark text-accent py-20 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <div className="animate-fade-in">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Premium Car Service
              <span className="text-primary block">Made Simple</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto">
              Connect with trusted garages, get AI-powered diagnostics, and manage your car maintenance with cutting-edge technology.
            </p>
          </div>

          {/* Search Bar */}
          <div className="max-w-4xl mx-auto animate-slide-up">
            <div className="bg-white rounded-2xl shadow-2xl p-6 md:p-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <input
                    type="text"
                    placeholder="Search services or garages..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-secondary"
                  />
                </div>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <input
                    type="text"
                    placeholder="Your location..."
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-secondary"
                  />
                </div>
                <button 
                  onClick={handleSearch}
                  className="bg-primary text-secondary px-6 py-3 rounded-lg font-semibold hover:bg-primary-dark transition-all duration-200 transform hover:scale-105 flex items-center justify-center"
                >
                  <Search className="h-5 w-5 mr-2" />
                  Find Garages
                </button>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="mt-12 flex flex-wrap justify-center gap-4">
            <Link
              to="/emergency"
              className="bg-red-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-red-600 transition-all duration-200 transform hover:scale-105 flex items-center animate-pulse"
            >
              <Zap className="h-5 w-5 mr-2" />
              Emergency Help
            </Link>
            <Link
              to="/diagnosis"
              className="bg-primary text-secondary px-6 py-3 rounded-lg font-semibold hover:bg-primary-dark transition-all duration-200 transform hover:scale-105 flex items-center"
            >
              <Shield className="h-5 w-5 mr-2" />
              AI Diagnosis
            </Link>
            <Link
              to="/garages"
              className="border-2 border-primary text-primary px-6 py-3 rounded-lg font-semibold hover:bg-primary hover:text-secondary transition-all duration-200 transform hover:scale-105 flex items-center"
            >
              <MapPin className="h-5 w-5 mr-2" />
              Browse All Garages
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-secondary mb-4">
              Why Choose Veloresq?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Experience the future of car maintenance with our innovative features designed for modern drivers.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="text-center group animate-fade-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="bg-primary rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 group-hover:bg-primary-dark transition-colors duration-200">
                  <feature.icon className="h-8 w-8 text-secondary" />
                </div>
                <h3 className="text-xl font-semibold text-secondary mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Garages */}
      <section className="py-20 px-4 bg-gray-light">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-secondary mb-4">
              Featured Garages
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Top-rated service centers near you with real-time availability.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredGarages.map((garage, index) => (
              <div
                key={garage.id}
                style={{ animationDelay: `${index * 0.2}s` }}
              >
                <GarageCard {...garage} />
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link
              to="/garages"
              className="bg-secondary text-primary px-8 py-3 rounded-lg font-semibold hover:bg-gray-dark transition-all duration-200 transform hover:scale-105"
            >
              View All Garages
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;