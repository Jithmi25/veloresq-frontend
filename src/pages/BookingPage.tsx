import React, { useState } from 'react';
import { Calendar, Clock, MapPin, Car, User, Phone, CreditCard, CheckCircle } from 'lucide-react';

const BookingPage: React.FC = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    garage: '',
    service: '',
    date: '',
    time: '',
    vehicleInfo: {
      make: '',
      model: '',
      year: '',
      licensePlate: '',
    },
    personalInfo: {
      name: '',
      phone: '',
      email: '',
    },
    specialRequests: '',
  });

  const garages = [
    { id: '1', name: 'AutoCare Pro', location: 'Colombo 03', rating: 4.8, waitTime: '45 mins' },
    { id: '2', name: 'QuickFix Garage', location: 'Kandy Road', rating: 4.6, waitTime: '1.5 hours' },
    { id: '3', name: 'Elite Motors', location: 'Galle Road', rating: 4.9, waitTime: '30 mins' },
  ];

  const services = [
    { id: '1', name: 'Oil Change', price: 2500, duration: '30 mins' },
    { id: '2', name: 'Brake Service', price: 8500, duration: '1.5 hours' },
    { id: '3', name: 'Engine Diagnostic', price: 5000, duration: '45 mins' },
    { id: '4', name: 'Full Service', price: 15000, duration: '3 hours' },
    { id: '5', name: 'AC Service', price: 6500, duration: '2 hours' },
    { id: '6', name: 'Tire Change', price: 3500, duration: '20 mins' },
  ];

  const timeSlots = [
    '08:00', '08:30', '09:00', '09:30', '10:00', '10:30',
    '11:00', '11:30', '12:00', '12:30', '13:00', '13:30',
    '14:00', '14:30', '15:00', '15:30', '16:00', '16:30'
  ];

  const handleNext = () => {
    if (step < 4) setStep(step + 1);
  };

  const handlePrevious = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleSubmit = () => {
    // Handle booking submission
    console.log('Booking submitted:', formData);
    setStep(5); // Show confirmation
  };

  const updateFormData = (section: string, field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...prev[section as keyof typeof prev],
        [field]: value,
      },
    }));
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-6">
            <h3 className="text-2xl font-bold text-secondary mb-6">Select Garage & Service</h3>
            
            {/* Garage Selection */}
            <div>
              <label className="block text-sm font-medium text-secondary mb-3">Choose Garage</label>
              <div className="grid gap-4">
                {garages.map((garage) => (
                  <label
                    key={garage.id}
                    className={`block p-4 border-2 rounded-lg cursor-pointer transition-all duration-200 ${
                      formData.garage === garage.id
                        ? 'border-primary bg-yellow-50'
                        : 'border-gray-200 hover:border-primary'
                    }`}
                  >
                    <input
                      type="radio"
                      name="garage"
                      value={garage.id}
                      checked={formData.garage === garage.id}
                      onChange={(e) => setFormData(prev => ({ ...prev, garage: e.target.value }))}
                      className="sr-only"
                    />
                    <div className="flex justify-between items-center">
                      <div>
                        <h4 className="font-semibold text-secondary">{garage.name}</h4>
                        <p className="text-gray-600 flex items-center mt-1">
                          <MapPin className="h-4 w-4 mr-1" />
                          {garage.location}
                        </p>
                      </div>
                      <div className="text-right">
                        <div className="text-yellow-500 font-semibold">★ {garage.rating}</div>
                        <div className="text-sm text-gray-600">{garage.waitTime}</div>
                      </div>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* Service Selection */}
            <div>
              <label className="block text-sm font-medium text-secondary mb-3">Choose Service</label>
              <div className="grid md:grid-cols-2 gap-4">
                {services.map((service) => (
                  <label
                    key={service.id}
                    className={`block p-4 border-2 rounded-lg cursor-pointer transition-all duration-200 ${
                      formData.service === service.id
                        ? 'border-primary bg-yellow-50'
                        : 'border-gray-200 hover:border-primary'
                    }`}
                  >
                    <input
                      type="radio"
                      name="service"
                      value={service.id}
                      checked={formData.service === service.id}
                      onChange={(e) => setFormData(prev => ({ ...prev, service: e.target.value }))}
                      className="sr-only"
                    />
                    <div className="flex justify-between items-center">
                      <div>
                        <h4 className="font-semibold text-secondary">{service.name}</h4>
                        <p className="text-sm text-gray-600">{service.duration}</p>
                      </div>
                      <div className="text-primary font-bold">Rs. {service.price}</div>
                    </div>
                  </label>
                ))}
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <h3 className="text-2xl font-bold text-secondary mb-6">Select Date & Time</h3>
            
            <div className="grid md:grid-cols-2 gap-6">
              {/* Date Selection */}
              <div>
                <label className="block text-sm font-medium text-secondary mb-3">
                  <Calendar className="inline h-4 w-4 mr-2" />
                  Select Date
                </label>
                <input
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
                  min={new Date().toISOString().split('T')[0]}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>

              {/* Time Selection */}
              <div>
                <label className="block text-sm font-medium text-secondary mb-3">
                  <Clock className="inline h-4 w-4 mr-2" />
                  Select Time
                </label>
                <div className="grid grid-cols-3 gap-2 max-h-60 overflow-y-auto">
                  {timeSlots.map((time) => (
                    <label
                      key={time}
                      className={`block p-2 text-center border-2 rounded cursor-pointer transition-all duration-200 ${
                        formData.time === time
                          ? 'border-primary bg-yellow-50 text-secondary'
                          : 'border-gray-200 hover:border-primary text-gray-700'
                      }`}
                    >
                      <input
                        type="radio"
                        name="time"
                        value={time}
                        checked={formData.time === time}
                        onChange={(e) => setFormData(prev => ({ ...prev, time: e.target.value }))}
                        className="sr-only"
                      />
                      {time}
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <h3 className="text-2xl font-bold text-secondary mb-6">Vehicle & Personal Information</h3>
            
            {/* Vehicle Information */}
            <div className="bg-gray-50 p-6 rounded-lg">
              <h4 className="font-semibold text-secondary mb-4 flex items-center">
                <Car className="h-5 w-5 mr-2" />
                Vehicle Information
              </h4>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-secondary mb-2">Make</label>
                  <input
                    type="text"
                    placeholder="e.g., Toyota"
                    value={formData.vehicleInfo.make}
                    onChange={(e) => updateFormData('vehicleInfo', 'make', e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-secondary mb-2">Model</label>
                  <input
                    type="text"
                    placeholder="e.g., Corolla"
                    value={formData.vehicleInfo.model}
                    onChange={(e) => updateFormData('vehicleInfo', 'model', e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-secondary mb-2">Year</label>
                  <input
                    type="number"
                    placeholder="2020"
                    value={formData.vehicleInfo.year}
                    onChange={(e) => updateFormData('vehicleInfo', 'year', e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-secondary mb-2">License Plate</label>
                  <input
                    type="text"
                    placeholder="ABC-1234"
                    value={formData.vehicleInfo.licensePlate}
                    onChange={(e) => updateFormData('vehicleInfo', 'licensePlate', e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>
              </div>
            </div>

            {/* Personal Information */}
            <div className="bg-gray-50 p-6 rounded-lg">
              <h4 className="font-semibold text-secondary mb-4 flex items-center">
                <User className="h-5 w-5 mr-2" />
                Personal Information
              </h4>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-secondary mb-2">Full Name</label>
                  <input
                    type="text"
                    placeholder="Your full name"
                    value={formData.personalInfo.name}
                    onChange={(e) => updateFormData('personalInfo', 'name', e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-secondary mb-2">Phone Number</label>
                  <input
                    type="tel"
                    placeholder="+94 77 123 4567"
                    value={formData.personalInfo.phone}
                    onChange={(e) => updateFormData('personalInfo', 'phone', e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-secondary mb-2">Email Address</label>
                  <input
                    type="email"
                    placeholder="your@email.com"
                    value={formData.personalInfo.email}
                    onChange={(e) => updateFormData('personalInfo', 'email', e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>
              </div>
            </div>

            {/* Special Requests */}
            <div>
              <label className="block text-sm font-medium text-secondary mb-2">Special Requests (Optional)</label>
              <textarea
                placeholder="Any specific requirements or notes for the service..."
                value={formData.specialRequests}
                onChange={(e) => setFormData(prev => ({ ...prev, specialRequests: e.target.value }))}
                rows={3}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>
          </div>
        );

      case 4:
        const selectedGarage = garages.find(g => g.id === formData.garage);
        const selectedService = services.find(s => s.id === formData.service);
        
        return (
          <div className="space-y-6">
            <h3 className="text-2xl font-bold text-secondary mb-6">Confirm & Pay</h3>
            
            {/* Booking Summary */}
            <div className="bg-gray-50 p-6 rounded-lg">
              <h4 className="font-semibold text-secondary mb-4">Booking Summary</h4>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Garage:</span>
                  <span className="font-medium text-secondary">{selectedGarage?.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Service:</span>
                  <span className="font-medium text-secondary">{selectedService?.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Date & Time:</span>
                  <span className="font-medium text-secondary">{formData.date} at {formData.time}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Vehicle:</span>
                  <span className="font-medium text-secondary">
                    {formData.vehicleInfo.year} {formData.vehicleInfo.make} {formData.vehicleInfo.model}
                  </span>
                </div>
                <div className="border-t pt-3 flex justify-between text-lg font-bold">
                  <span>Total:</span>
                  <span className="text-primary">Rs. {selectedService?.price}</span>
                </div>
              </div>
            </div>

            {/* Payment Method */}
            <div className="bg-gray-50 p-6 rounded-lg">
              <h4 className="font-semibold text-secondary mb-4 flex items-center">
                <CreditCard className="h-5 w-5 mr-2" />
                Payment Method
              </h4>
              <div className="space-y-3">
                <label className="flex items-center p-3 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-100">
                  <input type="radio" name="payment" defaultChecked className="mr-3" />
                  <span>Pay at Garage</span>
                </label>
                <label className="flex items-center p-3 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-100">
                  <input type="radio" name="payment" className="mr-3" />
                  <span>Credit/Debit Card</span>
                </label>
                <label className="flex items-center p-3 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-100">
                  <input type="radio" name="payment" className="mr-3" />
                  <span>Mobile Payment</span>
                </label>
              </div>
            </div>
          </div>
        );

      case 5:
        return (
          <div className="text-center space-y-6">
            <div className="animate-bounce-slow">
              <CheckCircle className="h-20 w-20 text-green-500 mx-auto" />
            </div>
            <h3 className="text-3xl font-bold text-secondary">Booking Confirmed!</h3>
            <p className="text-xl text-gray-600">
              Your service has been successfully booked. You'll receive a confirmation SMS shortly.
            </p>
            <div className="bg-green-50 border border-green-200 rounded-lg p-6">
              <h4 className="font-semibold text-green-800 mb-2">Booking Reference: #VEL-2025-001</h4>
              <p className="text-green-700">
                Please arrive 10 minutes before your scheduled time. We'll send you a reminder 1 hour before your appointment.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-primary text-secondary px-6 py-3 rounded-lg font-semibold hover:bg-primary-dark transition-colors duration-200">
                Track Booking
              </button>
              <button 
                onClick={() => window.location.href = '/'}
                className="border border-secondary text-secondary px-6 py-3 rounded-lg font-semibold hover:bg-secondary hover:text-white transition-colors duration-200"
              >
                Back to Home
              </button>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-light py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Progress Bar */}
        {step < 5 && (
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              {['Select', 'Schedule', 'Details', 'Payment'].map((label, index) => (
                <div
                  key={index}
                  className={`flex items-center ${index < 3 ? 'flex-1' : ''}`}
                >
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold ${
                      step > index + 1
                        ? 'bg-green-500 text-white'
                        : step === index + 1
                        ? 'bg-primary text-secondary'
                        : 'bg-gray-300 text-gray-600'
                    }`}
                  >
                    {step > index + 1 ? '✓' : index + 1}
                  </div>
                  <span className={`ml-2 text-sm font-medium ${
                    step >= index + 1 ? 'text-secondary' : 'text-gray-500'
                  }`}>
                    {label}
                  </span>
                  {index < 3 && (
                    <div className={`flex-1 h-1 mx-4 rounded ${
                      step > index + 1 ? 'bg-green-500' : 'bg-gray-300'
                    }`} />
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Form Content */}
        <div className="bg-white rounded-xl shadow-lg p-8 animate-fade-in">
          {renderStep()}

          {/* Navigation Buttons */}
          {step < 5 && (
            <div className="flex justify-between mt-8 pt-6 border-t">
              <button
                onClick={handlePrevious}
                disabled={step === 1}
                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
              >
                Previous
              </button>
              <button
                onClick={step === 4 ? handleSubmit : handleNext}
                className="bg-primary text-secondary px-6 py-2 rounded-lg font-semibold hover:bg-primary-dark transition-all duration-200 transform hover:scale-105"
              >
                {step === 4 ? 'Confirm Booking' : 'Next Step'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BookingPage;