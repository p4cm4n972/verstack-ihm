import { isPlatformBrowser } from '@angular/common';
import { Component, Inject, PLATFORM_ID } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-mobile-not-allowed',
  imports: [RouterModule],
  templateUrl: './mobile-not-allowed.component.html',
  styleUrl: './mobile-not-allowed.component.scss'
})
export class MobileNotAllowedComponent {
  isMobile!: boolean;

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    this.isMobile = isPlatformBrowser(platformId) && window.innerWidth < 768;
  }
}
