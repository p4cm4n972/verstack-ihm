// shop.component.ts
import { AfterViewInit, Component, inject, OnInit } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { ShopifyBuyButtonComponent } from '../../../composant/shopify-buy-button/shopify-buy-button.component';
import { MatIconModule } from '@angular/material/icon';
import { ActivatedRoute, Router } from '@angular/router';
import { Meta, Title } from '@angular/platform-browser';
import { MatCardModule } from '@angular/material/card';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';

@Component({
  imports: [MatFormFieldModule, MatCardModule, MatButtonModule, MatToolbarModule, MatIconModule, MatSelectModule, ShopifyBuyButtonComponent],
  selector: 'app-shop',
  templateUrl: './shop.component.html',
  styleUrls: ['./shop.component.scss'],
  standalone: true,
})
export class ShopComponent implements AfterViewInit, OnInit {
  products: any[] = [];
  filteredProducts: any[] = [];
  selectedCategory: string = '';
  categories: string[] = ['hommes', 'femmes', 'accessoires', 'maison', 'jouets'];
  themes = ['angular', 'react', 'Vue', 'Svelte', 'Node.js', 'Python'];
  activeTheme: string | null = null;



  activeCategory = 'Tous';
  // dialog = inject(MatDialog);

  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);



  constructor(private titleService: Title, private metaService: Meta) { }

  ngOnInit(): void {

    this.products = [
      { component: '1746262304851', id: '9698056798555', category: 'hommes', theme: ['angular'], prioritary: true },
      { component: '1746258121419', id: '9879512351067', category: 'hommes', theme: ['angular'], prioritary: false },
      { component: '1746294248466', id: '9879805395291', category: 'hommes', theme: ['angular'], prioritary: true },
      { component: '1746294331847', id: '9879808672091', category: 'hommes', theme: ['angular'], prioritary: true },
      { component: '1746404732790', id: '9881257574747', category: 'hommes', theme: ['angular'], prioritary: true },
      { component: '1746428728561', id: '9881395429723', category: 'maison', theme: ['angular'], prioritary: true },
      { component: '1746430266071', id: '9881414271323', category: 'maison', theme: ['angular'], prioritary: true },
      { component: '1746430349878', id: '9881411813723', category: 'maison', theme: ['angular'], prioritary: true },
      { component: '1746610575301', id: '9887484674395', category: 'maison', theme: ['hello kitty'], prioritary: false },
      { component: '1746611752322', id: '9887524094299', category: 'femmes', theme: ['hello kitty'], prioritary: true },

      { component: '1746732417993', id: '9891635495259', category: 'femmes', theme: ['rs'], prioritary: true },
      { component: '1746633268270', id: '9888303579483', category: 'femmes', theme: ['rs'], prioritary: true },
      { component: '1746634547276', id: '9888352928091', category: 'hommes', theme: ['angular', 'pokemon'], prioritary: true },
      { component: '1746635517652', id: '9888386646363', category: 'hommes', theme: ['c++', 'pokemon'], prioritary: true },
      { component: '1746635660529', id: '9888396902747', category: 'hommes', theme: ['docker', 'pokemon'], prioritary: true },
      { component: '1746636120006', id: '9888421118299', category: 'hommes', theme: ['java', 'pokemon'], prioritary: true },
      { component: '1746636647498', id: '9888436650331', category: 'hommes', theme: ['react', 'pokemon'], prioritary: true },
      { component: '1746637225107', id: '9888452084059', category: 'hommes', theme: ['react', 'DBZ'], prioritary: true },
      { component: '1746638162277', id: '9888477086043', category: 'hommes', theme: ['angular', 'DBZ'], prioritary: true },

      { component: '1746639225893', id: '9888504545627', category: 'hommes', theme: ['rs'], prioritary: true },
      { component: '1746640097726', id: '9888527090011', category: 'hommes', theme: ['rs'], prioritary: true },
      { component: '1746736407663', id: '9891805528411', category: 'hommes', theme: ['rs'], prioritary: true },
      { component: '1746736872758', id: '9891827188059', category: 'hommes', theme: ['rs'], prioritary: true },
      { component: '1746737527729', id: '9891855565147', category: 'hommes', theme: ['rs'], prioritary: true },
      { component: '1746738378281', id: '9891901276507', category: 'hommes', theme: ['rs'], prioritary: true },
    ]
   // this.applyFilter();
  }

  ngAfterViewInit() {
    const asides = document.querySelectorAll('aside');
    if (!asides) return;

    asides.forEach((aside: any) => {
      const el = aside as HTMLElement;
      el.style.setProperty('display', 'block', 'important');


      const observer = new MutationObserver(() => {
        if (el.style.display === 'none') {
          el.style.setProperty('display', 'block', 'important');
        }
      });

      observer.observe(el, { attributes: true, attributeFilter: ['style'] });
    })
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

  get produitsFiltres() {
    if (this.activeCategory === 'Tous') return this.products.filter(p => p.prioritary);
    return this.products.filter(p => p.category === this.activeCategory);
  }

  setCategorie(cat: string) {
    console.log(cat);
    this.activeCategory = cat;
  }

  setTheme(theme: string | null) {
    this.activeTheme = theme;
  }
}
