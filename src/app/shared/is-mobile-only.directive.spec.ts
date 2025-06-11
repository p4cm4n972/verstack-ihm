import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { IsMobileOnlyDirective } from './is-mobile-only.directive';
import { DeviceService } from '../services/device.service';

@Component({
  template: `<div *isMobileOnly>mobile</div>`
})
class TestComponent {}

describe('IsMobileOnlyDirective', () => {
  function createFixture(isMobile: boolean): ComponentFixture<TestComponent> {
    TestBed.overrideProvider(DeviceService, { useValue: { isMobile: () => isMobile } });
    const fixture = TestBed.createComponent(TestComponent);
    fixture.detectChanges();
    return fixture;
  }

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TestComponent, IsMobileOnlyDirective],
      providers: [DeviceService]
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
