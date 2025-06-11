import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { PLATFORM_ID } from '@angular/core';

import { mobileNotAllowedGuard } from './mobile-not-allowed.guard';

describe('mobileNotAllowedGuard', () => {
  let guard: mobileNotAllowedGuard;
  let router: jasmine.SpyObj<Router>;

  beforeEach(() => {
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

  it('should allow desktop navigation', () => {
    spyOnProperty(window.navigator, 'userAgent', 'get').and.returnValue('Mozilla');
    expect(guard.canActivate()).toBeTrue();
  });

  it('should block mobile navigation', () => {
    spyOnProperty(window.navigator, 'userAgent', 'get').and.returnValue('iPhone');
    expect(guard.canActivate()).toBeFalse();
    expect(router.navigate).toHaveBeenCalledWith(['/mobile-not-allowed']);
  });
});
