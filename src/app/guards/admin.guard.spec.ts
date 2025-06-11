import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import * as jwt_decode from 'jwt-decode';

import { AdminGuard } from './admin.guard';
import { AuthenticationService } from '../services/authentication.service';

describe('AdminGuard', () => {
  let guard: AdminGuard;
  let authService: jasmine.SpyObj<AuthenticationService>;
  let router: jasmine.SpyObj<Router>;

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
    authService.getAccessToken.and.returnValue('token');
    spyOn(jwt_decode, 'jwtDecode').and.returnValue({
      exp: Math.floor(Date.now() / 1000) + 1000,
      role: 'admin'
    });
    expect(guard.canActivate()).toBeTrue();
  });

  it('should redirect to home when role is not admin', () => {
    authService.getAccessToken.and.returnValue('token');
    spyOn(jwt_decode, 'jwtDecode').and.returnValue({
      exp: Math.floor(Date.now() / 1000) + 1000,
      role: 'user'
    });
    expect(guard.canActivate()).toBeFalse();
    expect(router.navigate).toHaveBeenCalledWith(['/home']);
  });
});
