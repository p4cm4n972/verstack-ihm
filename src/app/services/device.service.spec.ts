import { TestBed } from '@angular/core/testing';

import { DeviceService } from './device.service';

describe('DeviceService', () => {
  let service: DeviceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DeviceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should detect mobile user agent', () => {
    Object.defineProperty(window.navigator, 'userAgent', {
      value: 'iPhone',
      configurable: true,
    });
    expect(service.isMobile()).toBeTrue();
  });
});
