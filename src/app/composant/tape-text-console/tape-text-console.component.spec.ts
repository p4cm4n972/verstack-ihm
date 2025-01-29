import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TapeTextConsoleComponent } from './tape-text-console.component';

describe('TapeTextConsoleComponent', () => {
  let component: TapeTextConsoleComponent;
  let fixture: ComponentFixture<TapeTextConsoleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TapeTextConsoleComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TapeTextConsoleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
