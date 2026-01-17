import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { PLATFORM_ID } from '@angular/core';

import { ShopifyModalProductComponent } from './shopify-modal-product.component';
import { ShopifyLoaderService } from '../../services/shopify-loader.service';

describe('ShopifyModalProductComponent', () => {
  let component: ShopifyModalProductComponent;
  let fixture: ComponentFixture<ShopifyModalProductComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ShopifyModalProductComponent],
      providers: [
        provideRouter([]),
        { provide: PLATFORM_ID, useValue: 'browser' },
        {
          provide: ShopifyLoaderService,
          useValue: { load: () => Promise.resolve() }
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ShopifyModalProductComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
