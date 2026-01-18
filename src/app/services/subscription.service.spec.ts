import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';

import { SubscriptionService } from './subscription.service';
import { Subscription, SubscriptionCheckoutResponse } from '../models/subscription.interface';

describe('SubscriptionService', () => {
  let service: SubscriptionService;
  let httpMock: HttpTestingController;

  const mockSubscription: Subscription = {
    _id: 'sub123',
    userId: 'user123',
    stripeSubscriptionId: 'stripe_sub_123',
    stripeCustomerId: 'cus_123',
    status: 'active',
    startDate: new Date('2026-01-01'),
    endDate: new Date('2026-02-01'),
    nextBillingDate: new Date('2026-02-01'),
    amount: 0.99,
    currency: 'EUR',
    autoRenew: true,
    createdAt: new Date('2026-01-01'),
    updatedAt: new Date('2026-01-01')
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        SubscriptionService,
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    });
    service = TestBed.inject(SubscriptionService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should have MONTHLY_PRICE of 0.99', () => {
    expect(service.MONTHLY_PRICE).toBe(0.99);
  });

  describe('getSubscription', () => {
    it('should fetch user subscription', () => {
      const userId = 'user123';

      service.getSubscription(userId).subscribe(subscription => {
        expect(subscription).toEqual(mockSubscription);
      });

      const req = httpMock.expectOne(`/api/subscriptions/user/${userId}`);
      expect(req.request.method).toBe('GET');
      req.flush(mockSubscription);
    });

    it('should update subscription$ observable', () => {
      const userId = 'user123';

      service.getSubscription(userId).subscribe();

      const req = httpMock.expectOne(`/api/subscriptions/user/${userId}`);
      req.flush(mockSubscription);

      service.subscription$.subscribe(sub => {
        expect(sub).toEqual(mockSubscription);
      });
    });
  });

  describe('createCheckoutSession', () => {
    it('should create checkout session with userId only', () => {
      const mockResponse: SubscriptionCheckoutResponse = {
        sessionId: 'session_123',
        checkoutUrl: 'https://checkout.stripe.com/session_123',
        amount: 0.99
      };

      service.createCheckoutSession({ userId: 'user123' }).subscribe(response => {
        expect(response.sessionId).toBe('session_123');
        expect(response.amount).toBe(0.99);
      });

      const req = httpMock.expectOne('/api/subscriptions/checkout');
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual({ userId: 'user123' });
      req.flush(mockResponse);
    });
  });

  describe('cancelSubscription', () => {
    it('should cancel subscription at period end', () => {
      const cancelledSub = { ...mockSubscription, autoRenew: false };

      service.cancelSubscription({ userId: 'user123', immediate: false }).subscribe(sub => {
        expect(sub.autoRenew).toBe(false);
      });

      const req = httpMock.expectOne('/api/subscriptions/cancel');
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual({ userId: 'user123', immediate: false });
      req.flush(cancelledSub);
    });

    it('should cancel subscription immediately', () => {
      const cancelledSub = { ...mockSubscription, status: 'cancelled' as const };

      service.cancelSubscription({ userId: 'user123', immediate: true }).subscribe(sub => {
        expect(sub.status).toBe('cancelled');
      });

      const req = httpMock.expectOne('/api/subscriptions/cancel');
      expect(req.request.body).toEqual({ userId: 'user123', immediate: true });
      req.flush(cancelledSub);
    });
  });

  describe('reactivateSubscription', () => {
    it('should reactivate subscription', () => {
      const reactivatedSub = { ...mockSubscription, status: 'active' as const, autoRenew: true };

      service.reactivateSubscription('user123').subscribe(sub => {
        expect(sub.status).toBe('active');
        expect(sub.autoRenew).toBe(true);
      });

      const req = httpMock.expectOne('/api/subscriptions/reactivate');
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual({ userId: 'user123' });
      req.flush(reactivatedSub);
    });
  });

  describe('hasActiveSubscription', () => {
    it('should return false when no subscription', () => {
      expect(service.hasActiveSubscription()).toBe(false);
    });

    it('should return true for active subscription with future end date', () => {
      service.getSubscription('user123').subscribe();

      const futureDate = new Date();
      futureDate.setMonth(futureDate.getMonth() + 1);
      const activeSub = { ...mockSubscription, endDate: futureDate };

      const req = httpMock.expectOne('/api/subscriptions/user/user123');
      req.flush(activeSub);

      expect(service.hasActiveSubscription()).toBe(true);
    });

    it('should return false for expired subscription', () => {
      service.getSubscription('user123').subscribe();

      const pastDate = new Date();
      pastDate.setMonth(pastDate.getMonth() - 1);
      const expiredSub = { ...mockSubscription, endDate: pastDate };

      const req = httpMock.expectOne('/api/subscriptions/user/user123');
      req.flush(expiredSub);

      expect(service.hasActiveSubscription()).toBe(false);
    });
  });

  describe('clearCache', () => {
    it('should clear subscription cache', () => {
      // First set a subscription
      service.getSubscription('user123').subscribe();
      const req = httpMock.expectOne('/api/subscriptions/user/user123');
      req.flush(mockSubscription);

      // Clear cache
      service.clearCache();

      // Verify cache is cleared
      service.subscription$.subscribe(sub => {
        expect(sub).toBeNull();
      });
    });
  });
});
