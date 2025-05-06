// shop.component.ts
import { AfterViewInit, Component, inject, OnInit } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { ShopifyBuyButtonComponent } from '../../../composant/shopify-buy-button/shopify-buy-button.component';
import { MatIconModule } from '@angular/material/icon';
import { ActivatedRoute, Router } from '@angular/router';
import { Meta, Title } from '@angular/platform-browser';

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

  constructor(private titleService: Title, private metaService: Meta) {}

  ngOnInit(): void {
    this.titleService.setTitle('Red Squiggly – La geek Boutique');

    this.metaService.addTags([
      { name: 'description', content: 'Découvrez la boutique Red Squiggly – vêtements et accessoires pour développeurs. Codez avec style.' },
      { name: 'keywords', content: 'boutique développeur, vêtements développeur, Red Squiggly, t-shirts code, mode geek, hoodie dev' },
      { name: 'author', content: 'Red Squiggly' },
      { name: 'robots', content: 'index, follow' },

      // Open Graph
     /* { property: 'og:title', content: 'Red Squiggly – Boutique développeur' },
      { property: 'og:description', content: 'Mode pour développeurs et geeks. Découvrez nos vêtements stylés et techniques.' },
      { property: 'og:image', content: 'https://verstack.io/assets/images/og-image-boutique.png' },
      { property: 'og:url', content: 'https://verstack.io/boutique' },
      { property: 'og:type', content: 'website' },*/

      // Twitter Card
      /*{ name: 'twitter:card', content: 'summary_large_image' },
      { name: 'twitter:title', content: 'Red Squiggly – Boutique développeur' },
      { name: 'twitter:description', content: 'T-shirts, hoodies et accessoires pour développeurs. Code & style.' },
      { name: 'twitter:image', content: 'https://verstack.io/assets/images/twitter-image-boutique.png' }*/
    ]);

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
