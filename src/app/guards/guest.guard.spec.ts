import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { GuestGuard } from './guest.guard';
import { AuthenticationService } from '../services/authentication.service';

describe('GuestGuard', () => {
  let guard: GuestGuard;
  let authService: jasmine.SpyObj<AuthenticationService>;
  let router: jasmine.SpyObj<Router>;

  beforeEach(() => {
    const authServiceSpy = jasmine.createSpyObj('AuthenticationService', ['getAccessToken']);
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    TestBed.configureTestingModule({
      providers: [
        GuestGuard,
        { provide: AuthenticationService, useValue: authServiceSpy },
        { provide: Router, useValue: routerSpy }
      ]
    });
    
    guard = TestBed.inject(GuestGuard);
    authService = TestBed.inject(AuthenticationService) as jasmine.SpyObj<AuthenticationService>;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });

  it('should allow access when no token', () => {
    authService.getAccessToken.and.returnValue(null);
    
    const result = guard.canActivate({} as any, { url: '/signup' } as any);
    
    expect(result).toBeTrue();
  });

  it('should redirect to home when valid token', () => {
    // Mock d'un token valide (non expiré)
    const validToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjk5OTk5OTk5OTl9.token';
    authService.getAccessToken.and.returnValue(validToken);
    
    const result = guard.canActivate({} as any, { url: '/signup' } as any);
    
    expect(result).toBeFalse();
    expect(router.navigate).toHaveBeenCalledWith(['/home']);
  });
});