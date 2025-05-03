import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShopifyBuyButtonComponent } from './shopify-buy-button.component';

describe('ShopifyBuyButtonComponent', () => {
  let component: ShopifyBuyButtonComponent;
  let fixture: ComponentFixture<ShopifyBuyButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ShopifyBuyButtonComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ShopifyBuyButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
