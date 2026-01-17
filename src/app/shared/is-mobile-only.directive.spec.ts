import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PLATFORM_ID } from '@angular/core';
import { IsMobileOnlyDirective } from './is-mobile-only.directive';
import { DeviceService } from '../services/device.service';

@Component({
  standalone: true,
  imports: [IsMobileOnlyDirective],
  template: `<div *isMobileOnly>mobile</div>`
})
class TestComponent {}

describe('IsMobileOnlyDirective', () => {
  let mockDeviceService: jasmine.SpyObj<DeviceService>;

  function createFixture(isMobile: boolean): ComponentFixture<TestComponent> {
    mockDeviceService.isMobile.and.returnValue(isMobile);
    const fixture = TestBed.createComponent(TestComponent);
    fixture.detectChanges();
    return fixture;
  }

  beforeEach(() => {
    mockDeviceService = jasmine.createSpyObj('DeviceService', ['isMobile']);

    TestBed.configureTestingModule({
      imports: [TestComponent],
      providers: [
        { provide: DeviceService, useValue: mockDeviceService },
        { provide: PLATFORM_ID, useValue: 'browser' }
      ]
    }).compileComponents();
  });

  it('should display content on mobile', () => {
    const fixture = createFixture(true);
    expect(fixture.nativeElement.textContent.trim()).toBe('mobile');
  });

  it('should hide content on desktop', () => {
    const fixture = createFixture(false);
    expect(fixture.nativeElement.textContent.trim()).toBe('');
  });
});
