import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { HTTP_INTERCEPTORS, provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import { AuthenticationService } from './services/authentication.service';
import { JwtInterceptorService } from './services/jwt-interceptor.service';
import { authInterceptor } from './interceptors/auth.interceptor';
import { mobileNotAllowedGuard } from './guards/mobile-not-allowed.guard';
import { AdminGuard } from './guards/admin.guard';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideAnimationsAsync(),
    provideHttpClient(withFetch(), withInterceptors([authInterceptor])),
    AuthenticationService,
    {provide: HTTP_INTERCEPTORS, useClass: JwtInterceptorService, multi: true},
    mobileNotAllowedGuard,
    AdminGuard
  ],
};
