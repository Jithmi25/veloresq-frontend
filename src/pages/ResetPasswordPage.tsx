import React, { useState, useEffect } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { Car, Lock, Eye, EyeOff, CheckCircle, AlertCircle } from 'lucide-react';
import { authService } from '../services/authService';
import { useAuth } from '../hooks/useAuth';

const ResetPasswordPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { verifyResetToken } = useAuth();
  const token = searchParams.get('token');

  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [isTokenValid, setIsTokenValid] = useState<boolean | null>(null);

  // Verify token validity on component mount
  useEffect(() => {
    const verifyToken = async () => {
      if (!token) {
        setIsTokenValid(false);
        return;
      }

      try {
        setIsLoading(true);
        const isValid = await verifyResetToken(token);
        setIsTokenValid(isValid);
        if (!isValid) {
          setError('Invalid or expired reset token. Please request a new password reset link.');
        }
      } catch (err) {
        setIsTokenValid(false);
        setError('Failed to verify reset token. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    verifyToken();
  }, [token, verifyResetToken]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    // Client-side validation
    if (!formData.password || !formData.confirmPassword) {
      setError('Please fill in all fields');
      setIsLoading(false);
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setIsLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      setIsLoading(false);
      return;
    }

    if (!token) {
      setError('Invalid reset token. Please request a new password reset.');
      setIsLoading(false);
      return;
    }

    try {
      // Call the reset password service
      await authService.resetPassword({
        token,
        newPassword: formData.password
      });
      
      setIsSuccess(true);
      
      // Redirect to login after 3 seconds
      setTimeout(() => {
        navigate('/login');
      }, 3000);
    } catch (error: any) {
      console.error('Password reset error:', error);
      setError(error.response?.data?.message || 
              error.message || 
              'Failed to reset password. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  if (isTokenValid === false) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-secondary to-gray-dark flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <div className="flex items-center justify-center mb-6">
              <div className="p-3 bg-red-100 rounded-full">
                <AlertCircle className="h-8 w-8 text-red-600" />
              </div>
            </div>
            <h2 className="text-3xl font-bold text-primary">Invalid Reset Link</h2>
            <p className="mt-2 text-gray-300">This password reset link is invalid or has expired</p>
          </div>

          <div className="bg-white rounded-xl shadow-2xl p-8">
            <div className="text-center space-y-4">
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-red-800 text-sm">
                  The password reset link you used is either invalid or has expired. 
                  Please request a new password reset link below.
                </p>
              </div>
              
              <div className="pt-4">
                <Link
                  to="/forgot-password"
                  className="w-full bg-primary text-secondary py-3 px-4 rounded-lg font-semibold hover:bg-primary-dark transition-all duration-200 flex items-center justify-center"
                >
                  Request New Reset Link
                </Link>
              </div>

              <div className="pt-2">
                <Link
                  to="/login"
                  className="w-full border border-gray-300 text-gray-700 py-3 px-4 rounded-lg font-semibold hover:bg-gray-50 transition-all duration-200 flex items-center justify-center"
                >
                  Back to Login
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-secondary to-gray-dark flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <div className="flex items-center justify-center mb-6">
              <div className="p-3 bg-green-100 rounded-full">
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
            </div>
            <h2 className="text-3xl font-bold text-primary">Password Reset Successful!</h2>
            <p className="mt-2 text-gray-300">Your password has been updated successfully</p>
          </div>

          <div className="bg-white rounded-xl shadow-2xl p-8">
            <div className="text-center space-y-4">
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <p className="text-green-800 text-sm">
                  Your password has been reset successfully. You can now log in with your new password.
                </p>
              </div>
              
              <div className="text-sm text-gray-600">
                <p>You will be redirected to the login page in a few seconds...</p>
              </div>

              <div className="pt-4">
                <Link
                  to="/login"
                  className="w-full bg-primary text-secondary py-3 px-4 rounded-lg font-semibold hover:bg-primary-dark transition-all duration-200 flex items-center justify-center"
                >
                  Continue to Login
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-secondary to-gray-dark flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="flex items-center justify-center mb-6">
            <div className="p-3 bg-primary rounded-full">
              <Car className="h-8 w-8 text-secondary" />
            </div>
          </div>
          <h2 className="text-3xl font-bold text-primary">Reset Your Password</h2>
          <p className="mt-2 text-gray-300">Enter your new password below</p>
        </div>

        <div className="bg-white rounded-xl shadow-2xl p-8">
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center space-x-2">
              <AlertCircle className="h-5 w-5 text-red-600" />
              <span className="text-red-700 text-sm">{error}</span>
            </div>
          )}

          {isTokenValid === null ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-secondary mb-2">
                  New Password
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
                    placeholder="Enter your new password"
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
              </div>

              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-secondary mb-2">
                  Confirm New Password
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
                    placeholder="Confirm your new password"
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

              <div className="text-sm text-gray-600">
                <p>Password requirements:</p>
                <ul className="list-disc list-inside mt-1 space-y-1">
                  <li>At least 6 characters long</li>
                  <li>Should contain a mix of letters and numbers</li>
                  <li>Consider using special characters for extra security</li>
                </ul>
              </div>

              <button
                type="submit"
                disabled={isLoading || !formData.password || !formData.confirmPassword}
                className="w-full bg-primary text-secondary py-3 px-4 rounded-lg font-semibold hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-secondary mr-2"></div>
                    Resetting Password...
                  </div>
                ) : (
                  'Reset Password'
                )}
              </button>
            </form>
          )}

          <div className="mt-6 text-center">
            <p className="text-gray-600 text-sm">
              Remember your password?{' '}
              <Link to="/login" className="text-primary hover:text-primary-dark font-semibold">
                Sign in here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetPasswordPage;