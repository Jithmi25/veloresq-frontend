import api from './api';

interface Subscription {
  id: string;
  planId: string;
  planName: string;
  userId: string;
  status: 'active' | 'canceled' | 'expired' | 'trialing';
  billingCycle: 'monthly' | 'yearly';
  price: number;
  startDate: string;
  endDate?: string;
  nextBillingDate?: string;
  trialEndDate?: string;
  paymentMethodId?: string;
  createdAt: string;
  updatedAt: string;
}

interface CreateSubscriptionData {
  planId: string;
  billingCycle: 'monthly' | 'yearly';
  price: number;
  trialDays?: number;
  paymentToken?: string; // For payment processing
}

interface ChangeSubscriptionData {
  planId: string;
  billingCycle: 'monthly' | 'yearly';
  price: number;
  immediate?: boolean; // Whether to change immediately or at next billing cycle
}

interface SubscriptionResponse {
  success: boolean;
  message?: string;
  subscription?: Subscription;
  clientSecret?: string; // For Stripe or other payment processors
}

const subscriptionService = {
  /**
   * Get the current user's active subscription
   */
  async getCurrentSubscription(): Promise<Subscription> {
    try {
      const response = await api.get('/subscriptions/current');
      return response.data;
    } catch (error) {
      console.error('Failed to fetch current subscription:', error);
      throw new Error(error.response?.data?.message || 'Failed to fetch subscription');
    }
  },

  /**
   * Create a new subscription
   */
  async createSubscription(data: CreateSubscriptionData): Promise<SubscriptionResponse> {
    try {
      const response = await api.post('/subscriptions', data);
      return {
        success: true,
        message: 'Subscription created successfully',
        subscription: response.data.subscription,
        clientSecret: response.data.clientSecret // For payment processors
      };
    } catch (error) {
      console.error('Failed to create subscription:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to create subscription'
      };
    }
  },

  /**
   * Change existing subscription (upgrade/downgrade)
   */
  async changeSubscription(data: ChangeSubscriptionData): Promise<SubscriptionResponse> {
    try {
      const response = await api.put('/subscriptions/current', data);
      return {
        success: true,
        message: 'Subscription updated successfully',
        subscription: response.data.subscription
      };
    } catch (error) {
      console.error('Failed to change subscription:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to update subscription'
      };
    }
  },

  /**
   * Cancel current subscription
   */
  async cancelSubscription(): Promise<SubscriptionResponse> {
    try {
      const response = await api.delete('/subscriptions/current');
      return {
        success: true,
        message: 'Subscription canceled successfully',
        subscription: response.data.subscription
      };
    } catch (error) {
      console.error('Failed to cancel subscription:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to cancel subscription'
      };
    }
  },

  /**
   * Get all available subscription plans
   */
  async getPlans(): Promise<{
    success: boolean;
    plans?: Array<{
      id: string;
      name: string;
      description: string;
      features: string[];
      prices: {
        monthly: number;
        yearly: number;
      };
      trialDays: number;
      for: 'customer' | 'garage';
    }>;
    message?: string;
  }> {
    try {
      const response = await api.get('/subscriptions/plans');
      return {
        success: true,
        plans: response.data.plans
      };
    } catch (error) {
      console.error('Failed to fetch plans:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch plans'
      };
    }
  },

  /**
   * Get payment methods for current user
   */
  async getPaymentMethods(): Promise<{
    success: boolean;
    paymentMethods?: Array<{
      id: string;
      brand: string;
      last4: string;
      expMonth: number;
      expYear: number;
      isDefault: boolean;
    }>;
    message?: string;
  }> {
    try {
      const response = await api.get('/subscriptions/payment-methods');
      return {
        success: true,
        paymentMethods: response.data.paymentMethods
      };
    } catch (error) {
      console.error('Failed to fetch payment methods:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch payment methods'
      };
    }
  },

  /**
   * Add a new payment method
   */
  async addPaymentMethod(paymentToken: string): Promise<{
    success: boolean;
    paymentMethod?: any;
    message?: string;
  }> {
    try {
      const response = await api.post('/subscriptions/payment-methods', { paymentToken });
      return {
        success: true,
        paymentMethod: response.data.paymentMethod
      };
    } catch (error) {
      console.error('Failed to add payment method:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to add payment method'
      };
    }
  }
};

export default subscriptionService;