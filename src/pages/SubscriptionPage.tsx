import React, { useState } from 'react';
import { Check, Crown, Zap, Shield, Star, Users, Car, Clock } from 'lucide-react';

const SubscriptionPage: React.FC = () => {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');
  const [selectedPlan, setSelectedPlan] = useState<string>('');

  const plans = [
    {
      id: 'basic',
      name: 'Basic',
      description: 'Perfect for occasional car maintenance',
      price: { monthly: 499, yearly: 4990 },
      icon: Car,
      color: 'text-gray-600',
      bgColor: 'bg-gray-100',
      borderColor: 'border-gray-200',
      features: [
        'Find nearby garages',
        'Basic booking system',
        'Email support',
        'Service history tracking',
        'Basic notifications'
      ],
      limitations: [
        'Limited to 5 bookings per month',
        'No priority support',
        'No emergency services'
      ]
    },
    {
      id: 'premium',
      name: 'Premium',
      description: 'Most popular for regular car owners',
      price: { monthly: 999, yearly: 9990 },
      icon: Star,
      color: 'text-primary',
      bgColor: 'bg-yellow-100',
      borderColor: 'border-primary',
      popular: true,
      features: [
        'Everything in Basic',
        'Unlimited bookings',
        'AI audio diagnosis',
        'Priority booking queue',
        'SMS notifications',
        'Emergency roadside assistance',
        'Price comparison tool',
        'Advanced service history',
        'Phone support'
      ],
      savings: billingCycle === 'yearly' ? 'Save Rs. 2,000' : null
    },
    {
      id: 'pro',
      name: 'Pro',
      description: 'For car enthusiasts and fleet owners',
      price: { monthly: 1999, yearly: 19990 },
      icon: Crown,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
      borderColor: 'border-purple-200',
      features: [
        'Everything in Premium',
        'Fleet management (up to 10 vehicles)',
        'Dedicated account manager',
        'Custom maintenance schedules',
        'Advanced analytics & reports',
        'API access for integration',
        'White-label garage partnerships',
        '24/7 priority support',
        'Bulk booking discounts'
      ],
      savings: billingCycle === 'yearly' ? 'Save Rs. 4,000' : null
    }
  ];

  const garageFeatures = [
    {
      id: 'garage-basic',
      name: 'Garage Basic',
      description: 'For small independent garages',
      price: { monthly: 2999, yearly: 29990 },
      icon: Shield,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
      borderColor: 'border-blue-200',
      features: [
        'Garage profile listing',
        'Basic booking management',
        'Customer communication tools',
        'Service catalog management',
        'Payment processing',
        'Basic analytics'
      ]
    },
    {
      id: 'garage-pro',
      name: 'Garage Pro',
      description: 'For established automotive service centers',
      price: { monthly: 5999, yearly: 59990 },
      icon: Zap,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
      borderColor: 'border-green-200',
      popular: true,
      features: [
        'Everything in Garage Basic',
        'Advanced queue management',
        'Staff management system',
        'Inventory tracking',
        'Customer loyalty programs',
        'Marketing tools',
        'Advanced reporting',
        'Multiple location support',
        'Emergency service dispatch'
      ],
      savings: billingCycle === 'yearly' ? 'Save Rs. 12,000' : null
    }
  ];

  const handlePlanSelect = (planId: string) => {
    setSelectedPlan(planId);
  };

  const handleSubscribe = (planId: string) => {
    // Handle subscription logic here
    console.log(`Subscribing to ${planId} plan with ${billingCycle} billing`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-secondary mb-4">
            Choose Your <span className="text-primary">Premium</span> Plan
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Unlock advanced features and get the most out of your Veloresq experience
          </p>
        </div>

        {/* Billing Toggle */}
        <div className="flex justify-center mb-12">
          <div className="bg-white p-2 rounded-lg shadow-lg">
            <button
              onClick={() => setBillingCycle('monthly')}
              className={`px-6 py-2 rounded-md font-semibold transition-all duration-200 ${
                billingCycle === 'monthly'
                  ? 'bg-primary text-secondary'
                  : 'text-gray-600 hover:text-secondary'
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setBillingCycle('yearly')}
              className={`px-6 py-2 rounded-md font-semibold transition-all duration-200 ${
                billingCycle === 'yearly'
                  ? 'bg-primary text-secondary'
                  : 'text-gray-600 hover:text-secondary'
              }`}
            >
              Yearly
              <span className="ml-2 text-xs bg-green-100 text-green-600 px-2 py-1 rounded-full">
                Save up to 20%
              </span>
            </button>
          </div>
        </div>

        {/* Customer Plans */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-secondary text-center mb-8">
            <Users className="inline h-8 w-8 mr-2" />
            For Car Owners
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {plans.map((plan) => (
              <div
                key={plan.id}
                className={`bg-white rounded-2xl shadow-lg border-2 transition-all duration-300 transform hover:-translate-y-1 ${
                  plan.popular ? 'border-primary shadow-xl scale-105' : plan.borderColor
                } ${selectedPlan === plan.id ? 'ring-4 ring-primary ring-opacity-50' : ''}`}
              >
                {plan.popular && (
                  <div className="bg-primary text-secondary text-center py-2 text-sm font-bold rounded-t-2xl">
                    MOST POPULAR
                  </div>
                )}
                
                <div className="p-8">
                  <div className="text-center mb-6">
                    <div className={`inline-flex p-3 rounded-full ${plan.bgColor} mb-4`}>
                      <plan.icon className={`h-8 w-8 ${plan.color}`} />
                    </div>
                    <h3 className="text-2xl font-bold text-secondary mb-2">{plan.name}</h3>
                    <p className="text-gray-600 mb-4">{plan.description}</p>
                    <div className="mb-2">
                      <span className="text-4xl font-bold text-secondary">
                        Rs. {plan.price[billingCycle].toLocaleString()}
                      </span>
                      <span className="text-gray-600">/{billingCycle === 'monthly' ? 'month' : 'year'}</span>
                    </div>
                    {plan.savings && (
                      <div className="text-green-600 font-semibold text-sm">{plan.savings}</div>
                    )}
                  </div>

                  <div className="space-y-3 mb-8">
                    {plan.features.map((feature, index) => (
                      <div key={index} className="flex items-start space-x-3">
                        <Check className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700">{feature}</span>
                      </div>
                    ))}
                    
                    {plan.limitations && (
                      <div className="pt-3 border-t border-gray-100">
                        {plan.limitations.map((limitation, index) => (
                          <div key={index} className="flex items-start space-x-3 text-sm text-gray-500">
                            <span className="w-5 h-5 flex items-center justify-center mt-0.5">•</span>
                            <span>{limitation}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <button
                    onClick={() => handleSubscribe(plan.id)}
                    className={`w-full py-3 rounded-lg font-semibold transition-all duration-200 transform hover:scale-105 ${
                      plan.popular
                        ? 'bg-primary text-secondary hover:bg-primary-dark'
                        : 'bg-secondary text-white hover:bg-gray-dark'
                    }`}
                  >
                    {plan.id === 'basic' ? 'Start Free Trial' : 'Get Started'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Garage Plans */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-secondary text-center mb-8">
            <Shield className="inline h-8 w-8 mr-2" />
            For Garage Owners
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {garageFeatures.map((plan) => (
              <div
                key={plan.id}
                className={`bg-white rounded-2xl shadow-lg border-2 transition-all duration-300 transform hover:-translate-y-1 ${
                  plan.popular ? 'border-primary shadow-xl' : plan.borderColor
                }`}
              >
                {plan.popular && (
                  <div className="bg-primary text-secondary text-center py-2 text-sm font-bold rounded-t-2xl">
                    RECOMMENDED
                  </div>
                )}
                
                <div className="p-8">
                  <div className="text-center mb-6">
                    <div className={`inline-flex p-3 rounded-full ${plan.bgColor} mb-4`}>
                      <plan.icon className={`h-8 w-8 ${plan.color}`} />
                    </div>
                    <h3 className="text-2xl font-bold text-secondary mb-2">{plan.name}</h3>
                    <p className="text-gray-600 mb-4">{plan.description}</p>
                    <div className="mb-2">
                      <span className="text-4xl font-bold text-secondary">
                        Rs. {plan.price[billingCycle].toLocaleString()}
                      </span>
                      <span className="text-gray-600">/{billingCycle === 'monthly' ? 'month' : 'year'}</span>
                    </div>
                    {plan.savings && (
                      <div className="text-green-600 font-semibold text-sm">{plan.savings}</div>
                    )}
                  </div>

                  <div className="space-y-3 mb-8">
                    {plan.features.map((feature, index) => (
                      <div key={index} className="flex items-start space-x-3">
                        <Check className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700">{feature}</span>
                      </div>
                    ))}
                  </div>

                  <button
                    onClick={() => handleSubscribe(plan.id)}
                    className={`w-full py-3 rounded-lg font-semibold transition-all duration-200 transform hover:scale-105 ${
                      plan.popular
                        ? 'bg-primary text-secondary hover:bg-primary-dark'
                        : 'bg-secondary text-white hover:bg-gray-dark'
                    }`}
                  >
                    Start Free Trial
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Features Comparison */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-12">
          <h2 className="text-3xl font-bold text-secondary text-center mb-8">Why Go Premium?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-blue-100 p-4 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
                <Clock className="h-10 w-10 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-secondary mb-2">Save Time</h3>
              <p className="text-gray-600">
                Skip the queues with priority booking and real-time availability updates
              </p>
            </div>
            <div className="text-center">
              <div className="bg-green-100 p-4 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
                <Shield className="h-10 w-10 text-green-600" />
              </div>
              <h3 className="text-xl font-bold text-secondary mb-2">Peace of Mind</h3>
              <p className="text-gray-600">
                24/7 emergency support and AI diagnostics help prevent major issues
              </p>
            </div>
            <div className="text-center">
              <div className="bg-primary p-4 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
                <Star className="h-10 w-10 text-secondary" />
              </div>
              <h3 className="text-xl font-bold text-secondary mb-2">Premium Experience</h3>
              <p className="text-gray-600">
                Access to exclusive features and the best garages in your area
              </p>
            </div>
          </div>
        </div>

        {/* FAQ */}
        <div className="bg-gray-50 rounded-2xl p-8">
          <h2 className="text-3xl font-bold text-secondary text-center mb-8">Frequently Asked Questions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-bold text-secondary mb-2">Can I cancel my subscription anytime?</h4>
              <p className="text-gray-600">Yes, you can cancel your subscription at any time. You'll continue to have access until the end of your billing period.</p>
            </div>
            <div>
              <h4 className="font-bold text-secondary mb-2">What payment methods do you accept?</h4>
              <p className="text-gray-600">We accept all major credit cards, debit cards, and mobile payment methods like PayHere.</p>
            </div>
            <div>
              <h4 className="font-bold text-secondary mb-2">Is there a free trial?</h4>
              <p className="text-gray-600">Yes! All premium plans come with a 7-day free trial. No credit card required to start.</p>
            </div>
            <div>
              <h4 className="font-bold text-secondary mb-2">Can I change my plan later?</h4>
              <p className="text-gray-600">Absolutely! You can upgrade or downgrade your plan at any time from your account settings.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionPage;