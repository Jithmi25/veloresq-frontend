import React from 'react';
import { Car, Mail, Phone, MapPin, Instagram, Twitter, Facebook } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-secondary text-accent">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 lg:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <div>
                  <img src="src/components/logo.png" alt="Veloresq Logo" className="h-14 w-35 " />
              
              </div>
            </div>
            <p className="text-gray-300 mb-6 max-w-md">
              Your premium car service platform. Connect, diagnose, and maintain your vehicle with cutting-edge technology and trusted professionals.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="p-2 bg-gray-dark rounded-lg hover:bg-primary hover:text-secondary transition-colors duration-200">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="p-2 bg-gray-dark rounded-lg hover:bg-primary hover:text-secondary transition-colors duration-200">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="p-2 bg-gray-dark rounded-lg hover:bg-primary hover:text-secondary transition-colors duration-200">
                <Instagram className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold text-primary mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <a href="/" className="text-gray-300 hover:text-primary transition-colors duration-200">Home</a>
              </li>
              <li>
                <a href="/booking" className="text-gray-300 hover:text-primary transition-colors duration-200">Book Service</a>
              </li>
              <li>
                <a href="/diagnosis" className="text-gray-300 hover:text-primary transition-colors duration-200">AI Diagnosis</a>
              </li>
              <li>
                <a href="/subscription" className="text-gray-300 hover:text-primary transition-colors duration-200">Premium Plans</a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-lg font-semibold text-primary mb-4">Contact</h3>
            <ul className="space-y-3">
              <li className="flex items-center space-x-2">
                <Phone className="h-4 w-4 text-primary" />
                <span className="text-gray-300">+94 77 123 4567</span>
              </li>
              <li className="flex items-center space-x-2">
                <Mail className="h-4 w-4 text-primary" />
                <span className="text-gray-300">hello@veloresq.com</span>
              </li>
              <li className="flex items-center space-x-2">
                <MapPin className="h-4 w-4 text-primary" />
                <span className="text-gray-300">Colombo, Sri Lanka</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Stats Section */}
        <div className="border-t border-gray-dark mt-8 pt-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center mb-8">
            <div className="animate-fade-in">
              <div className="text-4xl md:text-5xl font-bold text-primary mb-2">500+</div>
              <div className="text-gray-300">Trusted Garages</div>
            </div>
            <div className="animate-fade-in" style={{ animationDelay: '0.1s' }}>
              <div className="text-4xl md:text-5xl font-bold text-primary mb-2">50K+</div>
              <div className="text-gray-300">Happy Customers</div>
            </div>
            <div className="animate-fade-in" style={{ animationDelay: '0.2s' }}>
              <div className="text-4xl md:text-5xl font-bold text-primary mb-2">99.8%</div>
              <div className="text-gray-300">Uptime</div>
            </div>
            <div className="animate-fade-in" style={{ animationDelay: '0.3s' }}>
              <div className="text-4xl md:text-5xl font-bold text-primary mb-2">4.9★</div>
              <div className="text-gray-300">Average Rating</div>
            </div>
          </div>

          <div className="text-center">
            <p className="text-gray-300">
              © 2025 Veloresq. All rights reserved. | 
              <a href="#" className="text-primary hover:text-primary-dark ml-1">Privacy Policy</a> | 
              <a href="#" className="text-primary hover:text-primary-dark ml-1">Terms of Service</a>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;