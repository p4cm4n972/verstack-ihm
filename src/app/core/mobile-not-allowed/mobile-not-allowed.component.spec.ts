import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MobileNotAllowedComponent } from './mobile-not-allowed.component';

describe('MobileNotAllowedComponent', () => {
  let component: MobileNotAllowedComponent;
  let fixture: ComponentFixture<MobileNotAllowedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MobileNotAllowedComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MobileNotAllowedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
