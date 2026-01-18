import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import { AuthenticationService } from './services/authentication.service';
import { apiUrlInterceptor } from './interceptors/api-url.interceptor';
import { authInterceptor } from './interceptors/auth.interceptor';
import { mobileNotAllowedGuard } from './guards/mobile-not-allowed.guard';
import { AdminGuard } from './guards/admin.guard';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideAnimationsAsync(),
    provideHttpClient(withFetch(), withInterceptors([apiUrlInterceptor, authInterceptor])),
    AuthenticationService,
    mobileNotAllowedGuard,
    AdminGuard, provideClientHydration(withEventReplay())
  ],
};
