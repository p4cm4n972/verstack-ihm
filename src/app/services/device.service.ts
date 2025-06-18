import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class DeviceService {
  private readonly mobileRegex = /iPhone|iPad|iPod|Android/i;

  private isBrowser: boolean;

  constructor(@Inject(PLATFORM_ID) platformId: Object) {
    this.isBrowser = isPlatformBrowser(platformId);
  }


  isMobile(): boolean {
    if (!this.isBrowser) {
      return false;
    }
    return this.mobileRegex.test(navigator.userAgent);

  }
}
