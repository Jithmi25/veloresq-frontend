import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Car, Mail, Lock, User, Phone, Eye, EyeOff, AlertCircle, Wrench, Building } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { authService } from '../services/authService';

interface RegisterFormData {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  password: string;
  confirmPassword: string;
  role: 'customer' | 'garage_owner';
  agreeToTerms: boolean;
  garageName?: string;
  garageAddress?: string;
  businessLicense?: string;
}

const RegisterPage: React.FC = () => {
  const [formData, setFormData] = useState<RegisterFormData>({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    password: '',
    confirmPassword: '',
    role: 'customer',
    agreeToTerms: false,
    garageName: '',
    garageAddress: '',
    businessLicense: '',
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const { register } = useAuth();
  const navigate = useNavigate();

  const roleOptions = [
    {
      value: 'customer',
      label: 'Customer',
      icon: User,
      description: 'Book services and manage your vehicle maintenance',
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200'
    },
    {
      value: 'garage_owner',
      label: 'Garage Owner',
      icon: Wrench,
      description: 'Register your garage and offer services to customers',
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200'
    }
  ];

  const validateForm = (): boolean => {
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return false;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      return false;
    }

    if (!formData.agreeToTerms) {
      setError('Please agree to the terms and conditions');
      return false;
    }

    if (formData.role === 'garage_owner') {
      if (!formData.garageName?.trim()) {
        setError('Garage name is required for garage owners');
        return false;
      }
      if (!formData.garageAddress?.trim()) {
        setError('Garage address is required for garage owners');
        return false;
      }
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      // Prepare the data for registration
      const registrationData = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phoneNumber: formData.phoneNumber,
        password: formData.password,
        role: formData.role,
        ...(formData.role === 'garage_owner' && {
          garageName: formData.garageName,
          garageAddress: formData.garageAddress,
          businessLicense: formData.businessLicense
        })
      };

      // Option 1: Use auth context register function if it handles registration
      // await register(registrationData);

      // Option 2: Direct API call to auth service
      const result = await authService.register(registrationData);

      // If we get here, registration was successful
      if (result.user && result.token) {
        setSuccessMessage(
          formData.role === 'garage_owner'
            ? 'Garage owner account created successfully! Please check your email for verification instructions.'
            : 'Account created successfully! You can now log in.'
        );
        
        // Redirect to login after 3 seconds
        setTimeout(() => {
          navigate('/login');
        }, 3000);
      } else {
        setError('Registration failed. Please try again.');
      }
    } catch (error: any) {
      console.error('Registration error:', error);
      
      // Handle specific error cases
      const errorMessage = error.response?.data?.message || error.message || 'Registration failed. Please try again.';
      
      if (errorMessage.toLowerCase().includes('user already exists') ||
          errorMessage.toLowerCase().includes('email already exists') ||
          errorMessage.toLowerCase().includes('already registered')) {
        setError('An account with this email address already exists. Please use a different email or try logging in instead.');
      } else if (errorMessage.toLowerCase().includes('invalid email')) {
        setError('Please enter a valid email address.');
      } else if (errorMessage.toLowerCase().includes('password')) {
        setError('Password requirements not met. Please ensure your password is at least 6 characters long.');
      } else {
        setError(errorMessage);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const handleRoleChange = (role: 'customer' | 'garage_owner') => {
    setFormData(prev => ({ 
      ...prev, 
      role,
      // Reset garage-specific fields when switching roles
      ...(role === 'customer' && {
        garageName: '',
        garageAddress: '',
        businessLicense: ''
      })
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-secondary to-gray-dark flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl w-full space-y-8">
        <div className="text-center">
          <div className="flex items-center justify-center mb-6">
            <div className="p-3 bg-primary rounded-full">
              <Car className="h-8 w-8 text-secondary" />
            </div>
          </div>
          <h2 className="text-3xl font-bold text-primary">Join Veloresq</h2>
          <p className="mt-2 text-gray-300">Create your account to get started</p>
        </div>

        <div className="bg-white rounded-xl shadow-2xl p-8">
          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center space-x-2">
              <AlertCircle className="h-5 w-5 text-red-600" />
              <span className="text-red-700 text-sm">{error}</span>
            </div>
          )}

          {/* Success Message */}
          {successMessage && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-center space-x-2 text-green-700">
                <AlertCircle className="h-5 w-5" />
                <span className="text-sm">{successMessage}</span>
              </div>
            </div>
          )}

          {!successMessage && (
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Account Type */}
              <div>
                <label className="block text-sm font-medium text-secondary mb-3">
                  Account Type
                </label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                        onChange={() => handleRoleChange(role.value as 'customer' | 'garage_owner')}
                        className="sr-only"
                      />
                      <div className="text-center">
                        <div className={`inline-flex p-3 rounded-full ${role.bgColor} mb-3`}>
                          <role.icon className={`h-6 w-6 ${role.color}`} />
                        </div>
                        <h3 className="font-semibold text-secondary mb-1">{role.label}</h3>
                        <p className="text-sm text-gray-600">{role.description}</p>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {/* Personal Information */}
              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="text-lg font-semibold text-secondary mb-4 flex items-center">
                  <User className="h-5 w-5 mr-2" />
                  Personal Information
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label htmlFor="firstName" className="block text-sm font-medium text-secondary mb-2">
                      First Name *
                    </label>
                    <input
                      id="firstName"
                      name="firstName"
                      type="text"
                      required
                      value={formData.firstName}
                      onChange={handleChange}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                      placeholder="First name"
                      disabled={isLoading}
                    />
                  </div>
                  <div>
                    <label htmlFor="lastName" className="block text-sm font-medium text-secondary mb-2">
                      Last Name *
                    </label>
                    <input
                      id="lastName"
                      name="lastName"
                      type="text"
                      required
                      value={formData.lastName}
                      onChange={handleChange}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                      placeholder="Last name"
                      disabled={isLoading}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-secondary mb-2">
                      Email Address *
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                      <input
                        id="email"
                        name="email"
                        type="email"
                        required
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                        placeholder="Enter your email"
                        disabled={isLoading}
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="phoneNumber" className="block text-sm font-medium text-secondary mb-2">
                      Phone Number *
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                      <input
                        id="phoneNumber"
                        name="phoneNumber"
                        type="tel"
                        required
                        value={formData.phoneNumber}
                        onChange={handleChange}
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                        placeholder="+94 77 123 4567"
                        disabled={isLoading}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Garage Information (only for garage owners) */}
              {formData.role === 'garage_owner' && (
                <div className="bg-green-50 p-6 rounded-lg border border-green-200">
                  <h3 className="text-lg font-semibold text-secondary mb-4 flex items-center">
                    <Building className="h-5 w-5 mr-2" />
                    Garage Information
                  </h3>
                  
                  <div className="space-y-4">
                    <div>
                      <label htmlFor="garageName" className="block text-sm font-medium text-secondary mb-2">
                        Garage Name *
                      </label>
                      <input
                        id="garageName"
                        name="garageName"
                        type="text"
                        required
                        value={formData.garageName}
                        onChange={handleChange}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                        placeholder="Enter your garage name"
                        disabled={isLoading}
                      />
                    </div>

                    <div>
                      <label htmlFor="garageAddress" className="block text-sm font-medium text-secondary mb-2">
                        Garage Address *
                      </label>
                      <textarea
                        id="garageAddress"
                        name="garageAddress"
                        required
                        value={formData.garageAddress}
                        onChange={handleChange}
                        rows={3}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                        placeholder="Enter your garage address"
                        disabled={isLoading}
                      />
                    </div>

                    <div>
                      <label htmlFor="businessLicense" className="block text-sm font-medium text-secondary mb-2">
                        Business License Number (Optional)
                      </label>
                      <input
                        id="businessLicense"
                        name="businessLicense"
                        type="text"
                        value={formData.businessLicense}
                        onChange={handleChange}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                        placeholder="Enter business license number"
                        disabled={isLoading}
                      />
                    </div>
                  </div>

                  <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <p className="text-sm text-yellow-800">
                      <strong>Note:</strong> Garage registrations require verification. You'll receive an email with next steps after registration.
                    </p>
                  </div>
                </div>
              )}

              {/* Password Section */}
              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="text-lg font-semibold text-secondary mb-4 flex items-center">
                  <Lock className="h-5 w-5 mr-2" />
                  Security
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="password" className="block text-sm font-medium text-secondary mb-2">
                      Password *
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                      <input
                        id="password"
                        name="password"
                        type={showPassword ? 'text' : 'password'}
                        required
                        value={formData.password}
                        onChange={handleChange}
                        className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                        placeholder="Create a password"
                        disabled={isLoading}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        disabled={isLoading}
                      >
                        {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                      </button>
                    </div>
                    <p className="mt-1 text-xs text-gray-500">Minimum 6 characters</p>
                  </div>

                  <div>
                    <label htmlFor="confirmPassword" className="block text-sm font-medium text-secondary mb-2">
                      Confirm Password *
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                      <input
                        id="confirmPassword"
                        name="confirmPassword"
                        type={showConfirmPassword ? 'text' : 'password'}
                        required
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                        placeholder="Confirm your password"
                        disabled={isLoading}
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        disabled={isLoading}
                      >
                        {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Terms Agreement */}
              <div className="flex items-start">
                <input
                  id="agreeToTerms"
                  name="agreeToTerms"
                  type="checkbox"
                  checked={formData.agreeToTerms}
                  onChange={handleChange}
                  className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded mt-1"
                  disabled={isLoading}
                />
                <label htmlFor="agreeToTerms" className="ml-2 block text-sm text-gray-700">
                  I agree to the{' '}
                  <Link to="/terms" className="text-primary hover:text-primary-dark" target="_blank">
                    Terms and Conditions
                  </Link>{' '}
                  and{' '}
                  <Link to="/privacy" className="text-primary hover:text-primary-dark" target="_blank">
                    Privacy Policy
                  </Link>
                  {formData.role === 'garage_owner' && (
                    <>
                      {' '}and the{' '}
                      <Link to="/garage-terms" className="text-primary hover:text-primary-dark" target="_blank">
                        Garage Partner Agreement
                      </Link>
                    </>
                  )}
                </label>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-primary text-secondary py-3 px-4 rounded-lg font-semibold hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-secondary mr-2"></div>
                    Creating account...
                  </div>
                ) : (
                  `Create ${formData.role === 'garage_owner' ? 'Garage Owner' : 'Customer'} Account`
                )}
              </button>
            </form>
          )}

          {!successMessage && (
            <div className="mt-6 text-center">
              <p className="text-gray-600">
                Already have an account?{' '}
                <Link to="/login" className="text-primary hover:text-primary-dark font-semibold">
                  Sign in here
                </Link>
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;