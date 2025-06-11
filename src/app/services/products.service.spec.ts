import { TestBed } from '@angular/core/testing';
import { ProductsService } from './products.service';

describe('ProductsService', () => {
  let service: ProductsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProductsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return product list', () => {
    const products = service.getProducts();
    expect(Array.isArray(products)).toBeTrue();
    expect(products.length).toBeGreaterThan(0);
  });
});
