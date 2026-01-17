import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

import { MobileNotAllowedComponent } from './mobile-not-allowed.component';

describe('MobileNotAllowedComponent', () => {
  let component: MobileNotAllowedComponent;
  let fixture: ComponentFixture<MobileNotAllowedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MobileNotAllowedComponent, NoopAnimationsModule],
      providers: [
        provideRouter([])
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(MobileNotAllowedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
