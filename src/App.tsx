import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './hooks/useAuth';
import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import BookingPage from './pages/BookingPage';
import EmergencyPage from './pages/EmergencyPage';
import DiagnosisPage from './pages/DiagnosisPage';
import SubscriptionPage from './pages/SubscriptionPage';
import AdminDashboard from './pages/AdminDashboard';
import GarageDashboard from './pages/GarageDashboard';
import ManageBookings from './pages/ManageBookings';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ProfilePage from './pages/ProfilePage';
import GarageSearchPage from './pages/GarageSearchPage';
import BatteryChargePage from './pages/BatteryChargePage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gray-light flex flex-col">
          <Header />
          <main className="flex-1">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/forgot-password" element={<ForgotPasswordPage />} />
              <Route path="/reset-password" element={<ResetPasswordPage />} />
              <Route path="/garages" element={<GarageSearchPage />} />
              <Route path="/battery-charging" element={<BatteryChargePage />} />
              <Route 
                path="/booking" 
                element={
                  <ProtectedRoute>
                    <BookingPage />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/emergency" 
                element={
                  <ProtectedRoute>
                    <EmergencyPage />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/diagnosis" 
                element={
                  <ProtectedRoute>
                    <DiagnosisPage />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/subscription" 
                element={
                  <ProtectedRoute>
                    <SubscriptionPage />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/profile" 
                element={
                  <ProtectedRoute>
                    <ProfilePage />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/admin" 
                element={
                  <ProtectedRoute requiredRole="admin">
                    <AdminDashboard />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/garage-dashboard" 
                element={
                  <ProtectedRoute requiredRole="garage_owner">
                    <GarageDashboard />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/manage-bookings" 
                element={
                  <ProtectedRoute requiredRole="garage_owner">
                    <ManageBookings />
                  </ProtectedRoute>
                } 
              />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;