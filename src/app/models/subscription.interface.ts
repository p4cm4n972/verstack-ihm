/**
 * Subscription model for managing user subscriptions
 */

export type SubscriptionStatus = 'active' | 'cancelled' | 'expired' | 'pending';

export interface Subscription {
  _id: string;
  userId: string;
  stripeSubscriptionId?: string;
  stripeCustomerId?: string;
  status: SubscriptionStatus;
  startDate: Date;
  endDate: Date;
  nextBillingDate: Date;
  amount: number; // Amount in euros
  currency: string; // 'EUR'
  autoRenew: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface SubscriptionCheckoutRequest {
  userId: string;
  prorated: boolean;
}

export interface SubscriptionCheckoutResponse {
  sessionId: string;
  checkoutUrl: string;
  amount: number;
  prorationDetails?: {
    daysRemaining: number;
    proratedAmount: number;
    fullYearAmount: number;
  };
}

export interface SubscriptionCancellationRequest {
  userId: string;
  immediate: boolean; // If true, cancel immediately. If false, cancel at period end
}

export interface ProrationCalculation {
  fullYearPrice: number; // 0.99 EUR
  daysInYear: number;
  daysRemaining: number;
  proratedPrice: number;
  startDate: Date;
  nextRenewalDate: Date; // First Tuesday of next year
}
