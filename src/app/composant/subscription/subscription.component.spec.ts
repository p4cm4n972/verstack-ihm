import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { PLATFORM_ID } from '@angular/core';
import { EMPTY, of } from 'rxjs';

import { SubscriptionComponent } from './subscription.component';
import { SubscriptionService } from '../../services/subscription.service';
import { AuthenticationService } from '../../services/authentication.service';
import { Subscription } from '../../models/subscription.interface';

describe('SubscriptionComponent', () => {
  let component: SubscriptionComponent;
  let fixture: ComponentFixture<SubscriptionComponent>;
  let subscriptionServiceSpy: jasmine.SpyObj<SubscriptionService>;
  let authServiceSpy: jasmine.SpyObj<AuthenticationService>;

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

  beforeEach(async () => {
    subscriptionServiceSpy = jasmine.createSpyObj('SubscriptionService', [
      'getSubscription',
      'createCheckoutSession',
      'cancelSubscription',
      'reactivateSubscription'
    ], {
      MONTHLY_PRICE: 0.99
    });

    authServiceSpy = jasmine.createSpyObj('AuthenticationService', [
      'getUserId',
      'getUserRole'
    ]);

    await TestBed.configureTestingModule({
      imports: [
        SubscriptionComponent
      ],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        provideAnimationsAsync('noop'),
        { provide: PLATFORM_ID, useValue: 'browser' },
        { provide: SubscriptionService, useValue: subscriptionServiceSpy },
        { provide: AuthenticationService, useValue: authServiceSpy }
      ]
    }).compileComponents();

    // Default mock returns - use EMPTY to avoid console.error in tests
    authServiceSpy.getUserId.and.returnValue('user123');
    authServiceSpy.getUserRole.and.returnValue('user');
    subscriptionServiceSpy.getSubscription.and.returnValue(EMPTY);
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SubscriptionComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should have monthlyPrice of 0.99', () => {
    fixture.detectChanges();
    expect(component.monthlyPrice).toBe(0.99);
  });

  describe('ngOnInit', () => {
    it('should load user role on init', () => {
      authServiceSpy.getUserRole.and.returnValue('subscriber');
      fixture.detectChanges();
      expect(component.userRole).toBe('subscriber');
    });

    it('should load subscription on init', () => {
      subscriptionServiceSpy.getSubscription.and.returnValue(of(mockSubscription));
      fixture.detectChanges();
      expect(subscriptionServiceSpy.getSubscription).toHaveBeenCalledWith('user123');
      expect(component.subscription).toEqual(mockSubscription);
    });

    it('should handle no user id', () => {
      authServiceSpy.getUserId.and.returnValue(null as unknown as string);
      fixture.detectChanges();
      expect(component.isLoading).toBe(false);
    });
  });

  describe('isSubscriber', () => {
    it('should return true when userRole is subscriber', () => {
      authServiceSpy.getUserRole.and.returnValue('subscriber');
      fixture.detectChanges();
      expect(component.isSubscriber).toBe(true);
    });

    it('should return true when subscription is active', () => {
      subscriptionServiceSpy.getSubscription.and.returnValue(of(mockSubscription));
      fixture.detectChanges();
      expect(component.isSubscriber).toBe(true);
    });

    it('should return false for regular user without subscription', () => {
      authServiceSpy.getUserRole.and.returnValue('user');
      fixture.detectChanges();
      expect(component.isSubscriber).toBe(false);
    });
  });

  describe('subscribe', () => {
    it('should call createCheckoutSession with userId', () => {
      // Use EMPTY to prevent redirect which would disconnect the browser
      subscriptionServiceSpy.createCheckoutSession.and.returnValue(EMPTY);
      fixture.detectChanges();

      component.subscribe();

      expect(subscriptionServiceSpy.createCheckoutSession).toHaveBeenCalledWith({ userId: 'user123' });
    });

    it('should set isProcessing to true while processing', () => {
      subscriptionServiceSpy.createCheckoutSession.and.returnValue(EMPTY);
      fixture.detectChanges();

      component.subscribe();

      expect(component.isProcessing).toBe(true);
    });

    it('should not call service when no user id', () => {
      authServiceSpy.getUserId.and.returnValue(null as unknown as string);
      fixture.detectChanges();
      component.subscribe();
      expect(subscriptionServiceSpy.createCheckoutSession).not.toHaveBeenCalled();
    });
  });

  describe('cancelSubscription', () => {
    beforeEach(() => {
      subscriptionServiceSpy.getSubscription.and.returnValue(of(mockSubscription));
      fixture.detectChanges();
    });

    it('should cancel subscription at period end', fakeAsync(() => {
      spyOn(window, 'confirm').and.returnValue(true);
      const cancelledSub = { ...mockSubscription, autoRenew: false };
      subscriptionServiceSpy.cancelSubscription.and.returnValue(of(cancelledSub));

      component.cancelSubscription(false);
      tick();

      expect(subscriptionServiceSpy.cancelSubscription).toHaveBeenCalledWith({
        userId: 'user123',
        immediate: false
      });
      expect(component.subscription?.autoRenew).toBe(false);
    }));

    it('should not cancel if user declines confirmation', () => {
      spyOn(window, 'confirm').and.returnValue(false);

      component.cancelSubscription(false);

      expect(subscriptionServiceSpy.cancelSubscription).not.toHaveBeenCalled();
    });
  });

  describe('reactivateSubscription', () => {
    it('should reactivate subscription', fakeAsync(() => {
      const cancelledSub = { ...mockSubscription, status: 'cancelled' as const };
      subscriptionServiceSpy.getSubscription.and.returnValue(of(cancelledSub));
      fixture.detectChanges();

      const reactivatedSub = { ...mockSubscription, status: 'active' as const };
      subscriptionServiceSpy.reactivateSubscription.and.returnValue(of(reactivatedSub));

      component.reactivateSubscription();
      tick();

      expect(subscriptionServiceSpy.reactivateSubscription).toHaveBeenCalledWith('user123');
      expect(component.subscription?.status).toBe('active');
    }));
  });

  describe('formatPrice', () => {
    it('should format price in EUR', () => {
      fixture.detectChanges();
      const formatted = component.formatPrice(0.99);
      expect(formatted).toContain('0,99');
      expect(formatted).toContain('€');
    });
  });

  describe('subscriptionEndDate', () => {
    it('should return formatted end date', () => {
      subscriptionServiceSpy.getSubscription.and.returnValue(of(mockSubscription));
      fixture.detectChanges();
      expect(component.subscriptionEndDate).toBeTruthy();
    });

    it('should return empty string when no subscription', () => {
      fixture.detectChanges();
      expect(component.subscriptionEndDate).toBe('');
    });
  });
});
