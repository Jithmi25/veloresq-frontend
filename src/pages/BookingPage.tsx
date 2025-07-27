import React, { useState, useEffect } from 'react';
import { Calendar, Clock, MapPin, Car, User, CreditCard, CheckCircle, ChevronLeft, Zap } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { bookingService } from '../services/bookingService';
import { garageService } from '../services/garageService';
import { toast } from 'react-toastify';

interface VehicleInfo {
  make: string;
  model: string;
  year: string;
  licensePlate: string;
}

interface PersonalInfo {
  name: string;
  phone: string;
  email: string;
}

interface BookingFormData {
  garage: string;
  service: string;
  date: string;
  time: string;
  vehicleInfo: VehicleInfo;
  personalInfo: PersonalInfo;
  specialRequests: string;
}

interface Garage {
  id: string;
  name: string;
  address: string;
}

interface Service {
  id: string;
  name: string;
  price: number;
  estimatedDuration: number;
}

const BookingPage: React.FC = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<BookingFormData>({
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
  const [garages, setGarages] = useState<Garage[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [timeSlots, setTimeSlots] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [garageDetails, setGarageDetails] = useState<Garage | null>(null);
  const [serviceDetails, setServiceDetails] = useState<Service | null>(null);
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        // Get garage ID from URL if coming from search page
        const queryParams = new URLSearchParams(location.search);
        const garageId = queryParams.get('garage');

        // Fetch garages
        const garagesData = await garageService.getAllGarages();
        setGarages(garagesData);

        // If garage ID is in URL, set it in form and fetch services
        if (garageId) {
          setFormData(prev => ({ ...prev, garage: garageId }));
          const servicesData = await garageService.getGarageServices(garageId);
          setServices(servicesData);
          
          // Also fetch garage details for display
          const garage = await garageService.getGarageById(garageId);
          setGarageDetails(garage);
        }
      } catch (err) {
        console.error('Failed to load initial data:', err);
        toast.error('Failed to load garages or services');
      }
    };

    fetchInitialData();
  }, [location.search]);

  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        personalInfo: {
          name: `${user.firstName} ${user.lastName}`.trim() || '',
          phone: user.phoneNumber || '',
          email: user.email || '',
        }
      }));
    }
  }, [user]);

  useEffect(() => {
    // Fetch services when garage is selected
    const fetchServices = async () => {
      if (formData.garage) {
        try {
          const servicesData = await garageService.getGarageServices(formData.garage);
          setServices(servicesData);
          
          // Also fetch garage details for display
          const garage = await garageService.getGarageById(formData.garage);
          setGarageDetails(garage);
        } catch (err) {
          console.error('Failed to load services:', err);
          toast.error('Failed to load services for this garage');
        }
      }
    };

    fetchServices();
  }, [formData.garage]);

  useEffect(() => {
    // Generate time slots when date is selected
    if (formData.date) {
      generateTimeSlots();
    }
  }, [formData.date]);

  const generateTimeSlots = () => {
    // This would ideally come from the backend based on garage availability
    const slots = [];
    const startHour = 8; // 8 AM
    const endHour = 17; // 5 PM
    
    for (let hour = startHour; hour <= endHour; hour++) {
      // Only show full hours
      slots.push(`${hour}:00 ${hour < 12 ? 'AM' : 'PM'}`);
    }
    
    setTimeSlots(slots);
  };

  const handleNext = () => {
    if (step < 4) setStep(step + 1);
  };

  const handlePrevious = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);
    try {
      // Combine date and time into scheduledDateTime
      const scheduledDateTime = new Date(`${formData.date}T${formData.time.split(' ')[0]}`).toISOString();
      
      const bookingData = {
        garageId: formData.garage,
        serviceId: formData.service,
        scheduledDateTime,
        vehicleInfo: {
          ...formData.vehicleInfo,
          year: parseInt(formData.vehicleInfo.year) || new Date().getFullYear()
        },
        specialRequests: formData.specialRequests,
      };

      const response = await bookingService.createBooking(bookingData);
      console.log('Booking submitted:', response);
      setStep(5);
      toast.success('Booking confirmed successfully!');
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.message || 'Something went wrong. Please try again.');
      toast.error('Failed to submit booking');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    // Handle nested objects in form data
    if (name.startsWith('vehicleInfo.')) {
      const field = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        vehicleInfo: {
          ...prev.vehicleInfo,
          [field]: value
        }
      }));
    } else if (name.startsWith('personalInfo.')) {
      const field = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        personalInfo: {
          ...prev.personalInfo,
          [field]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-secondary flex items-center">
              <MapPin className="h-5 w-5 mr-2" />
              Select Garage
            </h3>
            
            <div className="space-y-4">
              <select
                name="garage"
                value={formData.garage}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              >
                <option value="">Select a garage</option>
                {garages.map((garage) => (
                  <option key={garage.id} value={garage.id}>{garage.name}</option>
                ))}
              </select>
              
              {garageDetails && (
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-semibold">{garageDetails.name}</h4>
                  <p className="text-sm text-gray-600">{garageDetails.address}</p>
                </div>
              )}
            </div>
          </div>
        );
      case 2:
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-secondary flex items-center">
              <Zap className="h-5 w-5 mr-2" />
              Select Service
            </h3>
            
            <div className="space-y-4">
              <select
                name="service"
                value={formData.service}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              >
                <option value="">Select a service</option>
                {services.map((service) => (
                  <option key={service.id} value={service.id}>
                    {service.name} (Rs. {service.price.toLocaleString()})
                  </option>
                ))}
              </select>
              
              {serviceDetails && (
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-semibold">{serviceDetails.name}</h4>
                  <p className="text-sm text-gray-600">
                    Price: Rs. {serviceDetails.price.toLocaleString()} | Duration: ~{serviceDetails.estimatedDuration} mins
                  </p>
                </div>
              )}
            </div>
          </div>
        );
      case 3:
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-secondary flex items-center">
              <Calendar className="h-5 w-5 mr-2" />
              Schedule Appointment
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-secondary mb-2">Date</label>
                  <input
                    type="date"
                    name="date"
                    value={formData.date}
                    onChange={handleChange}
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-secondary mb-2">Time Slot</label>
                  <select
                    name="time"
                    value={formData.time}
                    onChange={handleChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  >
                    <option value="">Select a time</option>
                    {timeSlots.map((slot, idx) => (
                      <option key={idx} value={slot}>{slot}</option>
                    ))}
                  </select>
                </div>
              </div>
              
              <div className="space-y-4">
                <h4 className="font-semibold text-secondary flex items-center">
                  <Car className="h-5 w-5 mr-2" />
                  Vehicle Information
                </h4>
                
                <div className="space-y-3">
                  <input
                    type="text"
                    name="vehicleInfo.make"
                    placeholder="Make (e.g., Toyota)"
                    value={formData.vehicleInfo.make}
                    onChange={handleChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                  <input
                    type="text"
                    name="vehicleInfo.model"
                    placeholder="Model (e.g., Corolla)"
                    value={formData.vehicleInfo.model}
                    onChange={handleChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                  <input
                    type="text"
                    name="vehicleInfo.year"
                    placeholder="Year"
                    value={formData.vehicleInfo.year}
                    onChange={handleChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                  <input
                    type="text"
                    name="vehicleInfo.licensePlate"
                    placeholder="License Plate"
                    value={formData.vehicleInfo.licensePlate}
                    onChange={handleChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <h4 className="font-semibold text-secondary flex items-center">
                <User className="h-5 w-5 mr-2" />
                Personal Information
              </h4>
              
              <div className="space-y-3">
                <input
                  type="text"
                  name="personalInfo.name"
                  placeholder="Full Name"
                  value={formData.personalInfo.name}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  required
                />
                <input
                  type="tel"
                  name="personalInfo.phone"
                  placeholder="Phone Number"
                  value={formData.personalInfo.phone}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  required
                />
                <input
                  type="email"
                  name="personalInfo.email"
                  placeholder="Email"
                  value={formData.personalInfo.email}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  required
                />
              </div>
            </div>
            
            <div className="space-y-4">
              <h4 className="font-semibold text-secondary">Special Requests</h4>
              <textarea
                name="specialRequests"
                placeholder="Any special instructions or requests..."
                value={formData.specialRequests}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                rows={3}
              />
            </div>
          </div>
        );
      case 4:
        const selectedGarage = garages.find(g => g.id === formData.garage) || garageDetails;
        const selectedService = services.find(s => s.id === formData.service) || serviceDetails;
        
        return (
          <div className="space-y-6">
            <h3 className="text-2xl font-bold text-secondary mb-6">Confirm & Pay</h3>
            
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg">
                {error}
              </div>
            )}
            
            <div className="bg-gray-50 p-6 rounded-lg">
              <h4 className="font-semibold text-secondary mb-4">Booking Summary</h4>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Garage:</span>
                  <span className="font-medium">{selectedGarage?.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Service:</span>
                  <span className="font-medium">{selectedService?.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Date & Time:</span>
                  <span className="font-medium">
                    {new Date(formData.date).toLocaleDateString()} at {formData.time}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Vehicle:</span>
                  <span className="font-medium">
                    {formData.vehicleInfo.year} {formData.vehicleInfo.make} {formData.vehicleInfo.model}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">License Plate:</span>
                  <span className="font-medium">{formData.vehicleInfo.licensePlate}</span>
                </div>
                <div className="flex justify-between border-t pt-3 font-bold">
                  <span>Total:</span>
                  <span>Rs. {selectedService?.price.toLocaleString()}</span>
                </div>
              </div>
            </div>
            
            <div className="bg-gray-50 p-6 rounded-lg">
              <h4 className="font-semibold text-secondary mb-4 flex items-center">
                <CreditCard className="h-5 w-5 mr-2" />
                Payment Method
              </h4>
              <div className="space-y-3">
                <label className="flex items-center p-3 border border-gray-300 rounded-lg bg-white">
                  <input
                    type="radio"
                    name="payment"
                    defaultChecked
                    className="mr-3"
                  />
                  Pay at Garage (Cash/Card)
                </label>
              </div>
            </div>
            
            <div className="mt-6">
              <button
                onClick={handleSubmit}
                disabled={loading}
                className={`w-full bg-primary text-secondary px-6 py-3 rounded-lg font-semibold text-lg ${
                  loading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-primary-dark'
                }`}
              >
                {loading ? 'Confirming...' : 'Confirm Booking'}
              </button>
            </div>
          </div>
        );
      case 5:
        return (
          <div className="text-center space-y-6 py-8">
            <CheckCircle className="h-20 w-20 text-green-500 mx-auto animate-bounce" />
            <h3 className="text-3xl font-bold text-secondary">Booking Confirmed!</h3>
            <p className="text-lg text-gray-600">
              Your service has been successfully booked. A confirmation has been sent to your email.
            </p>
            <div className="pt-6">
              <button
                onClick={() => navigate('/my-bookings')}
                className="bg-primary text-white px-6 py-3 rounded-lg font-semibold mr-4 hover:bg-primary-dark"
              >
                View My Bookings
              </button>
              <button
                onClick={() => navigate('/')}
                className="bg-white border border-gray-300 text-gray-700 px-6 py-3 rounded-lg font-semibold hover:bg-gray-50"
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
        {step < 5 && (
          <button
            onClick={() => step === 1 ? navigate('/garages') : handlePrevious()}
            className="flex items-center text-primary mb-6 hover:text-primary-dark"
          >
            <ChevronLeft className="h-5 w-5 mr-1" />
            {step === 1 ? 'Back to Garages' : 'Previous Step'}
          </button>
        )}
        
        <div className="bg-white rounded-xl shadow-lg p-8">
          {/* Progress Steps */}
          {step < 5 && (
            <div className="flex justify-between mb-8 relative">
              <div className="absolute top-1/2 left-0 right-0 h-1 bg-gray-200 -z-10"></div>
              {[1, 2, 3, 4].map((stepNumber) => (
                <div key={stepNumber} className="flex flex-col items-center">
                  <div className={`h-8 w-8 rounded-full flex items-center justify-center ${
                    step >= stepNumber ? 'bg-primary text-secondary' : 'bg-gray-200 text-gray-600'
                  }`}>
                    {stepNumber}
                  </div>
                  <span className={`text-xs mt-2 ${
                    step >= stepNumber ? 'text-primary font-medium' : 'text-gray-500'
                  }`}>
                    {stepNumber === 1 && 'Garage'}
                    {stepNumber === 2 && 'Service'}
                    {stepNumber === 3 && 'Details'}
                    {stepNumber === 4 && 'Confirm'}
                  </span>
                </div>
              ))}
            </div>
          )}
          
          {renderStep()}
        </div>
      </div>
    </div>
  );
};

export default BookingPage;