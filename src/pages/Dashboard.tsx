import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const Dashboard: React.FC = () => {
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && user) {
      // Redirect based on user role
      switch (user.role) {
        case 'admin':
          navigate('/admin', { replace: true });
          break;
        case 'garage_owner':
          navigate('/garage-dashboard', { replace: true });
          break;
        case 'customer':
        default:
          navigate('/profile', { replace: true });
          break;
      }
    } else if (!isLoading && !user) {
      // If not authenticated, redirect to login
      navigate('/login', { replace: true });
    }
  }, [user, isLoading, navigate]);

  // Show loading while determining redirect
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-light flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  // This should not be reached due to the useEffect redirects
  return (
    <div className="min-h-screen bg-gray-light flex items-center justify-center">
      <div className="text-center">
        <p className="text-gray-600">Redirecting...</p>
      </div>
    </div>
  );
};

export default Dashboard;