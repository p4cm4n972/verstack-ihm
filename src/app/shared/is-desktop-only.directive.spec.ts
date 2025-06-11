import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { IsDesktopOnlyDirective } from './is-desktop-only.directive';
import { DeviceService } from '../services/device.service';

@Component({
  template: `<div *isDesktopOnly>desktop</div>`
})
class TestComponent {}

describe('IsDesktopOnlyDirective', () => {
  function createFixture(isMobile: boolean): ComponentFixture<TestComponent> {
    TestBed.overrideProvider(DeviceService, { useValue: { isMobile: () => isMobile } });
    const fixture = TestBed.createComponent(TestComponent);
    fixture.detectChanges();
    return fixture;
  }

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TestComponent, IsDesktopOnlyDirective],
      providers: [DeviceService]
    }).compileComponents();
  });

  it('should display content on desktop', () => {
    const fixture = createFixture(false);
    expect(fixture.nativeElement.textContent.trim()).toBe('desktop');
  });

  it('should hide content on mobile', () => {
    const fixture = createFixture(true);
    expect(fixture.nativeElement.textContent.trim()).toBe('');
  });
});
