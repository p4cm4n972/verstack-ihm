import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DeviceService {
  private readonly mobileRegex = /iPhone|iPad|iPod|Android/i;

  
  
  isMobile() {
   return this.mobileRegex.test(navigator.userAgent);

  }
}
