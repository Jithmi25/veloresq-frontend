import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Car, Menu, X, Zap, Shield, Phone, User, LogOut, Search, ChevronDown, Battery } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const location = useLocation();
  const { user, isAuthenticated, logout } = useAuth();

  const isActive = (path: string) => location.pathname === path;

  const getNavItems = () => {
    if (isAuthenticated) {
      if (user?.role === 'admin') {
        return [
          { path: '/admin', label: 'Admin Dashboard', icon: Shield },
        ];
      } else if (user?.role === 'garage_owner') {
        return [
          { path: '/', label: 'Home', icon: Car },
          { path: '/garage-dashboard', label: 'Garage Dashboard', icon: Shield },
          { path: '/manage-bookings', label: 'Manage Bookings', icon: Zap },
        ];
      } else {
        return [
          { path: '/', label: 'Home', icon: Car },
          { path: '/garages', label: 'Find Garages', icon: Search },
          { path: '/battery-charging', label: 'Battery Charging', icon: Battery },
          { path: '/booking', label: 'Book Service', icon: Zap },
          { path: '/emergency', label: 'Emergency', icon: Phone },
          { path: '/diagnosis', label: 'AI Diagnosis', icon: Shield },
        ];
      }
    }

    return [
      { path: '/', label: 'Home', icon: Car },
      { path: '/garages', label: 'Find Garages', icon: Search },
      { path: '/battery-charging', label: 'Battery Charging', icon: Battery },
    ];
  };

  const navItems = getNavItems();

  const handleLogout = async () => {
    await logout();
    setIsMenuOpen(false);
    setIsProfileDropdownOpen(false);
  };

  return (
    <header className="bg-secondary text-accent shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to={user?.role === 'admin' ? '/admin' : '/'} className="flex items-center space-x-2 group">
          <div>
              <img src="src/components/logo.png" alt="Veloresq Logo" className="h-8 w-30 mr-3" />
              
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            {navItems.map(({ path, label, icon: Icon }) => (
              <Link
                key={path}
                to={path}
                className={`flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                  isActive(path)
                    ? 'bg-primary text-secondary'
                    : 'text-accent hover:bg-gray-dark hover:text-primary'
                }`}
              >
                <Icon className="h-4 w-4" />
                <span>{label}</span>
              </Link>
            ))}
          </nav>

          {/* Desktop Auth Section */}
          <div className="hidden md:flex items-center space-x-4">
            {isAuthenticated ? (
              <>
                {/* Go Premium Button (for customers only) */}
                {user?.role === 'customer' && (
                  <Link
                    to="/subscription"
                    className="bg-primary text-secondary px-4 py-2 rounded-lg font-semibold hover:bg-primary-dark transition-all duration-200 transform hover:scale-105 flex items-center space-x-1"
                  >
                    <Zap className="h-4 w-4" />
                    <span>Go Premium</span>
                  </Link>
                )}

                {/* Profile Dropdown */}
                <div className="relative">
                  <button
                    onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                    className="flex items-center space-x-2 px-3 py-2 rounded-lg hover:bg-gray-dark transition-colors duration-200"
                  >
                    <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                      <User className="h-4 w-4 text-secondary" />
                    </div>
                    <div className="text-left">
                      <div className="text-sm font-medium text-accent">
                        {user?.firstName} {user?.lastName}
                      </div>
                      <div className="text-xs text-gray-400 capitalize">
                        {user?.role?.replace('_', ' ')}
                      </div>
                    </div>
                    <ChevronDown className={`h-4 w-4 text-gray-400 transition-transform duration-200 ${
                      isProfileDropdownOpen ? 'rotate-180' : ''
                    }`} />
                  </button>

                  {/* Dropdown Menu */}
                  {isProfileDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                      <Link
                        to="/profile"
                        onClick={() => setIsProfileDropdownOpen(false)}
                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors duration-200"
                      >
                        <User className="h-4 w-4 mr-3" />
                        View Profile
                      </Link>
                      
                      {user?.role === 'customer' && (
                        <>
                          <Link
                            to="/subscription"
                            onClick={() => setIsProfileDropdownOpen(false)}
                            className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors duration-200"
                          >
                            <Zap className="h-4 w-4 mr-3" />
                            Manage Subscription
                          </Link>
                          <Link
                            to="/battery-charging"
                            onClick={() => setIsProfileDropdownOpen(false)}
                            className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors duration-200"
                          >
                            <Battery className="h-4 w-4 mr-3" />
                            Battery Charging
                          </Link>
                        </>
                      )}
                      
                      <hr className="my-2" />
                      
                      <button
                        onClick={handleLogout}
                        className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors duration-200"
                      >
                        <LogOut className="h-4 w-4 mr-3" />
                        Sign Out
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="border border-primary text-primary px-4 py-2 rounded-lg font-semibold hover:bg-primary hover:text-secondary transition-all duration-200"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="bg-primary text-secondary px-4 py-2 rounded-lg font-semibold hover:bg-primary-dark transition-all duration-200 transform hover:scale-105"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 rounded-md text-accent hover:bg-gray-dark transition-colors duration-200"
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-dark animate-slide-up">
            <nav className="space-y-2">
              {navItems.map(({ path, label, icon: Icon }) => (
                <Link
                  key={path}
                  to={path}
                  onClick={() => setIsMenuOpen(false)}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                    isActive(path)
                      ? 'bg-primary text-secondary'
                      : 'text-accent hover:bg-gray-dark hover:text-primary'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{label}</span>
                </Link>
              ))}
              
              <div className="pt-4 space-y-2 border-t border-gray-dark">
                {isAuthenticated ? (
                  <>
                    {/* User Info */}
                    <div className="px-3 py-2 text-accent">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
                          <User className="h-5 w-5 text-secondary" />
                        </div>
                        <div>
                          <div className="text-sm font-medium">
                            {user?.firstName} {user?.lastName}
                          </div>
                          <div className="text-xs text-gray-400 capitalize">
                            {user?.role?.replace('_', ' ')}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Profile Link */}
                    <Link
                      to="/profile"
                      onClick={() => setIsMenuOpen(false)}
                      className="flex items-center space-x-2 px-3 py-2 text-accent hover:bg-gray-dark hover:text-primary rounded-md transition-colors duration-200"
                    >
                      <User className="h-4 w-4" />
                      <span>View Profile</span>
                    </Link>

                    {/* Go Premium (for customers) */}
                    {user?.role === 'customer' && (
                      <>
                        <Link
                          to="/subscription"
                          onClick={() => setIsMenuOpen(false)}
                          className="flex items-center space-x-2 bg-primary text-secondary px-3 py-2 rounded-lg font-semibold mx-3"
                        >
                          <Zap className="h-4 w-4" />
                          <span>Go Premium</span>
                        </Link>
                        <Link
                          to="/battery-charging"
                          onClick={() => setIsMenuOpen(false)}
                          className="flex items-center space-x-2 px-3 py-2 text-accent hover:bg-gray-dark hover:text-primary rounded-md transition-colors duration-200"
                        >
                          <Battery className="h-4 w-4" />
                          <span>Battery Charging</span>
                        </Link>
                      </>
                    )}

                    {/* Logout */}
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center space-x-2 text-red-400 px-3 py-2 rounded-lg hover:bg-red-900 hover:bg-opacity-20 transition-colors duration-200"
                    >
                      <LogOut className="h-4 w-4" />
                      <span>Sign Out</span>
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      to="/login"
                      onClick={() => setIsMenuOpen(false)}
                      className="block border border-primary text-primary px-3 py-2 rounded-lg font-semibold text-center mx-3"
                    >
                      Login
                    </Link>
                    <Link
                      to="/register"
                      onClick={() => setIsMenuOpen(false)}
                      className="block bg-primary text-secondary px-3 py-2 rounded-lg font-semibold text-center mx-3"
                    >
                      Sign Up
                    </Link>
                  </>
                )}
              </div>
            </nav>
          </div>
        )}
      </div>

      {/* Click outside to close dropdown */}
      {isProfileDropdownOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsProfileDropdownOpen(false)}
        />
      )}
    </header>
  );
};

export default Header;