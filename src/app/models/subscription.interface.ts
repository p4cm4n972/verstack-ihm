/**
 * Subscription model for managing user subscriptions
 * Abonnement mensuel à 0.99€/mois
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
  amount: number; // Montant en euros (0.99)
  currency: string; // 'EUR'
  autoRenew: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface SubscriptionCheckoutRequest {
  userId: string;
}

export interface SubscriptionCheckoutResponse {
  sessionId: string;
  checkoutUrl: string;
  amount: number;
}

export interface SubscriptionCancellationRequest {
  userId: string;
  immediate: boolean; // If true, cancel immediately. If false, cancel at period end
}
