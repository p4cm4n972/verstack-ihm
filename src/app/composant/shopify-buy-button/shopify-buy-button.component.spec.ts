import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShopifyBuyButtonComponent } from './shopify-buy-button.component';
import { ShopifyLoaderService } from '../../services/shopify-loader.service';

describe('ShopifyBuyButtonComponent', () => {
  let component: ShopifyBuyButtonComponent;
  let fixture: ComponentFixture<ShopifyBuyButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ShopifyBuyButtonComponent],
      providers: [
        {
          provide: ShopifyLoaderService,
          useValue: { load: () => Promise.resolve() }
        }
      ]
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
