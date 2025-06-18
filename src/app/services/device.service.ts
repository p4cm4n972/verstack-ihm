import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class DeviceService {
  private readonly mobileRegex = /iPhone|iPad|iPod|Android/i;

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  isMobile(): boolean {
    if (isPlatformBrowser(this.platformId)) {
      return this.mobileRegex.test(navigator.userAgent);
    }
    return false;
  }
}
