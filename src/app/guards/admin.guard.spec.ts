import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';

import { AdminGuard } from './admin.guard';
import { AuthenticationService } from '../services/authentication.service';

describe('AdminGuard', () => {
  let guard: AdminGuard;
  let authService: jasmine.SpyObj<AuthenticationService>;
  let router: jasmine.SpyObj<Router>;

  // Helper to create a valid JWT token with given payload
  function createToken(payload: object): string {
    const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
    const body = btoa(JSON.stringify(payload));
    const signature = 'fake-signature';
    return `${header}.${body}.${signature}`;
  }

  beforeEach(() => {
    authService = jasmine.createSpyObj('AuthenticationService', ['getAccessToken']);
    router = jasmine.createSpyObj('Router', ['navigate']);

    TestBed.configureTestingModule({
      providers: [
        AdminGuard,
        { provide: AuthenticationService, useValue: authService },
        { provide: Router, useValue: router }
      ]
    });

    guard = TestBed.inject(AdminGuard);
  });

  it('should redirect to signup when token is missing', () => {
    authService.getAccessToken.and.returnValue(null);
    expect(guard.canActivate()).toBeFalse();
    expect(router.navigate).toHaveBeenCalledWith(['/signup']);
  });

  it('should allow admin with valid token', () => {
    const token = createToken({
      exp: Math.floor(Date.now() / 1000) + 1000,
      role: 'admin'
    });
    authService.getAccessToken.and.returnValue(token);
    expect(guard.canActivate()).toBeTrue();
  });

  it('should redirect to home when role is not admin', () => {
    const token = createToken({
      exp: Math.floor(Date.now() / 1000) + 1000,
      role: 'user'
    });
    authService.getAccessToken.and.returnValue(token);
    expect(guard.canActivate()).toBeFalse();
    expect(router.navigate).toHaveBeenCalledWith(['/home']);
  });

  it('should redirect to home when token is expired', () => {
    const token = createToken({
      exp: Math.floor(Date.now() / 1000) - 1000, // expired
      role: 'admin'
    });
    authService.getAccessToken.and.returnValue(token);
    expect(guard.canActivate()).toBeFalse();
    expect(router.navigate).toHaveBeenCalledWith(['/home']);
  });
});
