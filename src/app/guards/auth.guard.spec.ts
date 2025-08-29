import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { AuthGuard } from './auth.guard';
import { AuthenticationService } from '../services/authentication.service';

describe('AuthGuard', () => {
  let guard: AuthGuard;
  let authService: jasmine.SpyObj<AuthenticationService>;
  let router: jasmine.SpyObj<Router>;

  beforeEach(() => {
    const authServiceSpy = jasmine.createSpyObj('AuthenticationService', ['getAccessToken', 'logout']);
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    TestBed.configureTestingModule({
      providers: [
        AuthGuard,
        { provide: AuthenticationService, useValue: authServiceSpy },
        { provide: Router, useValue: routerSpy }
      ]
    });
    
    guard = TestBed.inject(AuthGuard);
    authService = TestBed.inject(AuthenticationService) as jasmine.SpyObj<AuthenticationService>;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });

  it('should redirect to signup when no token', () => {
    authService.getAccessToken.and.returnValue(null);
    
    const result = guard.canActivate({} as any, { url: '/profile' } as any);
    
    expect(result).toBeFalse();
    expect(router.navigate).toHaveBeenCalledWith(['/signup'], {
      queryParams: { returnUrl: '/profile' }
    });
  });

  it('should allow access when valid token', () => {
    // Mock d'un token valide (non expiré)
    const validToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjk5OTk5OTk5OTl9.token';
    authService.getAccessToken.and.returnValue(validToken);
    
    const result = guard.canActivate({} as any, { url: '/profile' } as any);
    
    expect(result).toBeTrue();
  });
});