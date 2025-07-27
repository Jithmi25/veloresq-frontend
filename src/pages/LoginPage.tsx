import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Car, Mail, Lock, Eye, EyeOff, AlertCircle, User, Shield, Wrench } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { toast } from 'react-toastify';

interface LoginFormData {
  email: string;
  password: string;
  role: 'customer' | 'garage_owner' | 'admin';
}

const LoginPage: React.FC = () => {
  const [formData, setFormData] = useState<LoginFormData>({
    email: '',
    password: '',
    role: 'customer',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Get the previous location or default to home
  const from = location.state?.from?.pathname || '/';

  const roleOptions = [
    {
      value: 'customer',
      label: 'Customer',
      icon: User,
      description: 'Book services and manage your vehicle',
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200'
    },
    {
      value: 'garage_owner',
      label: 'Garage Owner',
      icon: Wrench,
      description: 'Manage your garage and services',
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200'
    },
    {
      value: 'admin',
      label: 'Administrator',
      icon: Shield,
      description: 'System administration access',
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      borderColor: 'border-purple-200'
    }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      // Call the login function from the auth context with proper parameters
      await login(formData.email, formData.password, formData.role);

      // Show success message
      toast.success(`Welcome back!`);

      // Redirect based on role
      let redirectPath = from;
      if (formData.role === 'admin') {
        redirectPath = '/admin';
      } else if (formData.role === 'garage_owner') {
        redirectPath = '/garage-dashboard';
      } else if (from === '/') {
        // If coming from home, redirect to appropriate dashboard
        redirectPath = '/dashboard';
      }

      // Navigate to the appropriate page
      navigate(redirectPath, { replace: true });

    } catch (error: any) {
      console.error('Login error:', error);
      
      // Handle different types of errors
      let errorMessage = 'Login failed. Please try again.';
      if (error.message) {
        errorMessage = error.message;
      }

      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleRoleChange = (role: 'customer' | 'garage_owner' | 'admin') => {
    setFormData(prev => ({ ...prev, role }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-secondary to-gray-dark flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="flex items-center justify-center mb-6">
            <div className="p-3 bg-primary rounded-full">
              <Car className="h-8 w-8 text-secondary" />
            </div>
          </div>
          <h2 className="text-3xl font-bold text-primary">Welcome Back</h2>
          <p className="mt-2 text-gray-300">Sign in to your Veloresq account</p>
        </div>

        <div className="bg-white rounded-xl shadow-2xl p-8">
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center space-x-2">
              <AlertCircle className="h-5 w-5 text-red-600" />
              <span className="text-red-700 text-sm">{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Role Selection */}
            <div>
              <label className="block text-sm font-medium text-secondary mb-3">
                Login as
              </label>
              <div className="space-y-3">
                {roleOptions.map((role) => (
                  <label
                    key={role.value}
                    className={`block p-4 border-2 rounded-lg cursor-pointer transition-all duration-200 ${
                      formData.role === role.value
                        ? `${role.borderColor} ${role.bgColor}`
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <input
                      type="radio"
                      name="role"
                      value={role.value}
                      checked={formData.role === role.value}
                      onChange={() => handleRoleChange(role.value as any)}
                      className="sr-only"
                    />
                    <div className="flex items-center space-x-3">
                      <div className={`p-2 rounded-lg ${role.bgColor}`}>
                        <role.icon className={`h-5 w-5 ${role.color}`} />
                      </div>
                      <div>
                        <h3 className="font-semibold text-secondary">{role.label}</h3>
                        <p className="text-sm text-gray-600">{role.description}</p>
                      </div>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-secondary mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="Enter your email"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-secondary mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                  Remember me
                </label>
              </div>

              <div className="text-sm">
                <Link 
                  to="/forgot-password" 
                  className="text-primary hover:text-primary-dark font-medium"
                >
                  Forgot your password?
                </Link>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className={`w-full bg-primary text-secondary py-3 px-4 rounded-lg font-semibold hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 transition-all duration-200 ${
                isLoading ? 'opacity-50 cursor-not-allowed' : 'transform hover:scale-105'
              }`}
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-secondary mr-2"></div>
                  Signing in...
                </div>
              ) : (
                'Sign In'
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-600">
              Don't have an account?{' '}
              <Link 
                to="/register" 
                className="text-primary hover:text-primary-dark font-semibold"
              >
                Sign up here
              </Link>
            </p>
          </div>

          {/* Role-specific help text */}
          <div className="mt-4 p-3 bg-gray-50 rounded-lg">
            <p className="text-xs text-gray-600 text-center">
              {formData.role === 'admin' && "Admin access requires special permissions. Contact support if you need admin access."}
              {formData.role === 'garage_owner' && "Garage owners can manage their service centers and bookings."}
              {formData.role === 'customer' && "Customers can book services, get AI diagnostics, and request emergency help."}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;