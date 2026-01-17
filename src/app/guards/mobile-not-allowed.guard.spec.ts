import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { PLATFORM_ID } from '@angular/core';

import { mobileNotAllowedGuard } from './mobile-not-allowed.guard';

describe('mobileNotAllowedGuard', () => {
  let guard: mobileNotAllowedGuard;
  let router: jasmine.SpyObj<Router>;
  let originalUserAgent: string;

  beforeEach(() => {
    // Save original userAgent
    originalUserAgent = navigator.userAgent;

    router = jasmine.createSpyObj('Router', ['navigate']);
    TestBed.configureTestingModule({
      providers: [
        mobileNotAllowedGuard,
        { provide: Router, useValue: router },
        { provide: PLATFORM_ID, useValue: 'browser' }
      ]
    });
    guard = TestBed.inject(mobileNotAllowedGuard);
  });

  afterEach(() => {
    // Restore original userAgent
    Object.defineProperty(navigator, 'userAgent', {
      value: originalUserAgent,
      configurable: true
    });
  });

  it('should allow desktop navigation', () => {
    Object.defineProperty(navigator, 'userAgent', {
      value: 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36',
      configurable: true
    });
    expect(guard.canActivate()).toBeTrue();
  });

  it('should block mobile navigation', () => {
    Object.defineProperty(navigator, 'userAgent', {
      value: 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X)',
      configurable: true
    });
    expect(guard.canActivate()).toBeFalse();
    expect(router.navigate).toHaveBeenCalledWith(['/mobile-not-allowed']);
  });
});
