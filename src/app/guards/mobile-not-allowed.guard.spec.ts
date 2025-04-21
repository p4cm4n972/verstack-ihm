import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { mobileNotAllowedGuard } from './mobile-not-allowed.guard';

describe('mobileNotAllowedGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => mobileNotAllowedGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
