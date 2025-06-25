import { isPlatformBrowser } from '@angular/common';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})

export class mobileNotAllowedGuard implements CanActivate {
  constructor(@Inject(PLATFORM_ID) private platformId: Object, private router: Router) {}

  canActivate(): boolean {
    if (isPlatformBrowser(this.platformId)) {
      const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
      if (!isMobile) {
        this.router.navigate(['/mobile-not-allowed']);
        return false;
      }
    }
    return true;
  }
}