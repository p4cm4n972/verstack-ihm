// shop.component.ts
import { AfterViewInit, Component, inject, OnInit } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { ShopifyBuyButtonComponent } from '../../../composant/shopify-buy-button/shopify-buy-button.component';
import { MatIconModule } from '@angular/material/icon';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  imports: [MatFormFieldModule, MatIconModule, MatSelectModule, ShopifyBuyButtonComponent], 
  selector: 'app-shop',
  templateUrl: './shop.component.html',
  styleUrls: ['./shop.component.scss'],
  standalone: true,
})
export class ShopComponent implements AfterViewInit, OnInit {
  products: any[] = [];
  filteredProducts: any[] = [];
  selectedCategory: string = '';
  categories: string[] = ['Hommes', 'Femmes', 'Accessoires', 'Maison', 'Jouets'];

  // dialog = inject(MatDialog);

  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  constructor() {}

  ngOnInit(): void {
    this.products = [
      {component: '1746262304851', id: '9698056798555', category: 'hommes'},
      {component: '1746258121419', id: '9879512351067', category: 'femmes'},
      {component: '1746294248466', id: '9879805395291', category: 'femmes'},
      {component: '1746294331847', id: '9879808672091', category: 'hommes'},
      {component: '1746404732790', id: '9881257574747', category: 'hommes'},
      {component: '1746428728561', id: '9881395429723', category: 'Maison'},
      {component: '1746430266071', id: '9881414271323', category: 'Maison'},
      {component: '1746430349878', id: '9881411813723', category: 'Maison'},
    ]
     this.applyFilter();
  }

  ngAfterViewInit(): void {
      
   
  }

  applyFilter(): void {
    if (!this.selectedCategory) {
      this.filteredProducts = this.products;
    } else {
      this.filteredProducts = this.products.filter(p => p.category.toLowerCase() === this.selectedCategory.toLowerCase()); 
    }
  }

  trackById(index: number, product: any): number {
    return product.id;
  }

  /*openProductModal(product: any): void {
    this.dialog.open(ShopifyModalProductComponent, {
      data: { id: product.id, component: product.component },
      width: '80%',
      height: '80%',
    });
  }*/
 gotoItems(product: any): void {
    this.router.navigate(['/shop', product.id], { queryParams: { component: product.component } });
  }
}
