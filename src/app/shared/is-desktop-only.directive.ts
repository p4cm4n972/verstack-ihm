import { Directive, inject, PLATFORM_ID, TemplateRef, ViewContainerRef } from '@angular/core';
import { DeviceService } from '../services/device.service';
import { isPlatformBrowser } from '@angular/common';

@Directive({
  selector: '[isDesktopOnly]'
})
export class IsDesktopOnlyDirective {
  private platformId = inject(PLATFORM_ID);

  constructor(
    private templateRef: TemplateRef<unknown>,
    private viewContainer: ViewContainerRef,
    private readonly deviceService: DeviceService
  ) { }

  ngOnInit() {
    if (!this.deviceService.isMobile()) {
      this.viewContainer.createEmbeddedView(this.templateRef);
    } else {
      this.viewContainer.clear();
    }
  }
}
