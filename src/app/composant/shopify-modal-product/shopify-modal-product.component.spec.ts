import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShopifyModalProductComponent } from './shopify-modal-product.component';
import { ShopifyLoaderService } from '../../services/shopify-loader.service';

describe('ShopifyModalProductComponent', () => {
  let component: ShopifyModalProductComponent;
  let fixture: ComponentFixture<ShopifyModalProductComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ShopifyModalProductComponent],
      providers: [
        {
          provide: ShopifyLoaderService,
          useValue: { load: () => Promise.resolve() }
        }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ShopifyModalProductComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
