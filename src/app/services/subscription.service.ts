import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import {
  Subscription,
  SubscriptionCheckoutRequest,
  SubscriptionCheckoutResponse,
  SubscriptionCancellationRequest,
  ProrationCalculation
} from '../models/subscription.interface';
import { calculateProration } from '../utils/proration.utils';

/**
 * Service for managing user subscriptions
 */
@Injectable({
  providedIn: 'root'
})
export class SubscriptionService {
  private http = inject(HttpClient);
  private readonly API_BASE = '/api/subscriptions';

  // Observable to track current subscription status
  private subscriptionSubject = new BehaviorSubject<Subscription | null>(null);
  public subscription$ = this.subscriptionSubject.asObservable();

  /**
   * Get current user's subscription
   */
  getSubscription(userId: string): Observable<Subscription> {
    return this.http.get<Subscription>(`${this.API_BASE}/user/${userId}`).pipe(
      tap(subscription => this.subscriptionSubject.next(subscription))
    );
  }

  /**
   * Calculate proration for current date
   */
  calculateProration(fullYearPrice: number = 0.99): ProrationCalculation {
    return calculateProration(fullYearPrice, new Date());
  }

  /**
   * Create Stripe checkout session for subscription
   */
  createCheckoutSession(request: SubscriptionCheckoutRequest): Observable<SubscriptionCheckoutResponse> {
    return this.http.post<SubscriptionCheckoutResponse>(
      `${this.API_BASE}/checkout`,
      request
    );
  }

  /**
   * Cancel subscription
   * @param request Cancellation details
   */
  cancelSubscription(request: SubscriptionCancellationRequest): Observable<Subscription> {
    return this.http.post<Subscription>(
      `${this.API_BASE}/cancel`,
      request
    ).pipe(
      tap(subscription => this.subscriptionSubject.next(subscription))
    );
  }

  /**
   * Reactivate a cancelled subscription
   * @param userId User ID
   */
  reactivateSubscription(userId: string): Observable<Subscription> {
    return this.http.post<Subscription>(
      `${this.API_BASE}/reactivate`,
      { userId }
    ).pipe(
      tap(subscription => this.subscriptionSubject.next(subscription))
    );
  }

  /**
   * Check if user has active subscription
   */
  hasActiveSubscription(): boolean {
    const subscription = this.subscriptionSubject.value;
    if (!subscription) return false;

    return subscription.status === 'active' &&
           new Date(subscription.endDate) > new Date();
  }

  /**
   * Get all subscriptions (admin only)
   */
  getAllSubscriptions(
    page: number = 1,
    limit: number = 20,
    status?: string
  ): Observable<{ subscriptions: Subscription[], total: number }> {
    let url = `${this.API_BASE}?page=${page}&limit=${limit}`;
    if (status) {
      url += `&status=${status}`;
    }
    return this.http.get<{ subscriptions: Subscription[], total: number }>(url);
  }

  /**
   * Update subscription status manually (admin only)
   */
  updateSubscriptionStatus(
    subscriptionId: string,
    status: string
  ): Observable<Subscription> {
    return this.http.patch<Subscription>(
      `${this.API_BASE}/${subscriptionId}/status`,
      { status }
    );
  }

  /**
   * Clear cached subscription data
   */
  clearCache(): void {
    this.subscriptionSubject.next(null);
  }
}
