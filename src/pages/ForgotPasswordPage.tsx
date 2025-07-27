import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Car,
  Mail,
  ArrowLeft,
  CheckCircle,
  AlertCircle,
} from 'lucide-react';
import { authService } from '../services/authService'; // Ensure this is correctly implemented

const ForgotPasswordPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    try {
      await authService.forgotPassword(email); // Call your backend API
      setIsSuccess(true);
    } catch (err: any) {
      const message = err?.response?.data?.message || 'Failed to send reset email. Please try again.';
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-secondary to-gray-dark flex items-center justify-center px-4 py-12">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <div className="flex justify-center mb-6">
              <div className="p-3 bg-green-100 rounded-full">
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
            </div>
            <h2 className="text-3xl font-bold text-primary">Check Your Email</h2>
            <p className="mt-2 text-gray-300">
              We've sent password reset instructions to your email.
            </p>
          </div>

          <div className="bg-white p-8 rounded-xl shadow-lg">
            <div className="text-center space-y-4">
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-green-800 text-sm">
                Password reset link sent to <strong>{email}</strong>
              </div>
              <p className="text-sm text-gray-600">
                If you don’t see the email, please check your spam folder.
              </p>

              <Link
                to="/login"
                className="block bg-primary text-secondary py-3 px-4 rounded-lg font-semibold hover:bg-primary-dark transition-all duration-200 transform hover:scale-105 text-center"
              >
                <ArrowLeft className="inline-block h-4 w-4 mr-2" />
                Back to Login
              </Link>

              <p className="pt-4 text-sm text-gray-600 border-t">
                Didn’t receive the email?{' '}
                <button
                  onClick={() => {
                    setIsSuccess(false);
                    setEmail('');
                  }}
                  className="text-primary font-semibold hover:text-primary-dark"
                >
                  Try again
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-secondary to-gray-dark flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="flex justify-center mb-6">
            <div className="p-3 bg-primary rounded-full">
              <Car className="h-8 w-8 text-secondary" />
            </div>
          </div>
          <h2 className="text-3xl font-bold text-primary">Forgot Password?</h2>
          <p className="mt-2 text-gray-300">Enter your email to receive a reset link</p>
        </div>

        <div className="bg-white p-8 rounded-xl shadow-lg">
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center space-x-2 text-sm text-red-700">
              <AlertCircle className="h-5 w-5 text-red-600" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
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
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:outline-none"
                  placeholder="you@example.com"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading || !email}
              className="w-full bg-primary text-secondary py-3 px-4 rounded-lg font-semibold hover:bg-primary-dark focus:ring-2 focus:ring-offset-2 disabled:opacity-50 transition transform hover:scale-105"
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-secondary mr-2" />
                  Sending...
                </div>
              ) : (
                'Send Reset Link'
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <Link
              to="/login"
              className="text-primary hover:text-primary-dark font-semibold flex items-center justify-center"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Login
            </Link>
          </div>

          <div className="mt-6 text-center text-sm text-gray-600">
            Don’t have an account?{' '}
            <Link to="/register" className="text-primary font-semibold hover:text-primary-dark">
              Sign up
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
