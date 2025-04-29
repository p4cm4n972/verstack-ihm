import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManisfesteComponent } from './manisfeste.component';

describe('ManisfesteComponent', () => {
  let component: ManisfesteComponent;
  let fixture: ComponentFixture<ManisfesteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ManisfesteComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ManisfesteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
