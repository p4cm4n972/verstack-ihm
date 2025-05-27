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
import { MatPaginatorModule, PageEvent, MatPaginatorIntl } from '@angular/material/paginator';
import { CommonModule } from '@angular/common';
import { SeoService } from '../../../services/seo.service';

export function getFrenchPaginatorIntl(): MatPaginatorIntl {
  const paginatorIntl = new MatPaginatorIntl();

  paginatorIntl.itemsPerPageLabel = 'Éléments par page :';
  paginatorIntl.nextPageLabel = 'Page suivante';
  paginatorIntl.previousPageLabel = 'Page précédente';
  paginatorIntl.firstPageLabel = 'Première page';
  paginatorIntl.lastPageLabel = 'Dernière page';
  paginatorIntl.getRangeLabel = (page: number, pageSize: number, length: number) => {
    if (length === 0 || pageSize === 0) {
      return `0 sur ${length}`;
    }
    const startIndex = page * pageSize;
    const endIndex = Math.min(startIndex + pageSize, length);
    return `${startIndex + 1} – ${endIndex} sur ${length}`;
  };

  return paginatorIntl;
}

@Component({
  imports: [CommonModule, MatFormFieldModule, MatCardModule, MatButtonModule, MatToolbarModule, MatIconModule, MatSelectModule, ShopifyBuyButtonComponent, MatPaginatorModule],
  selector: 'app-shop',
  templateUrl: './shop.component.html',
  styleUrls: ['./shop.component.scss'],
  standalone: true,
  providers: [
    { provide: MatPaginatorIntl, useValue: getFrenchPaginatorIntl() }
  ]
})
/**
 * @class ShopComponent
 * @implements {AfterViewInit}
 * @implements {OnInit}
 * 
 * The ShopComponent is responsible for displaying and managing a list of products in a shop interface.
 * It provides filtering by category and theme, supports pagination, and handles navigation to product details.
 * 
 * @property {any[]} products - The complete list of products available in the shop.
 * @property {any[]} filteredProducts - The list of products after applying filters (not currently used).
 * @property {string} selectedCategory - The currently selected category for filtering (not currently used).
 * @property {string[]} categories - The available product categories.
 * @property {string[]} themes - The available product themes.
 * @property {string | null} activeTheme - The currently selected theme for filtering.
 * @property {number} pageSize - The number of products displayed per page.
 * @property {number} currentPage - The current page index for pagination.
 * @property {any[]} pagedProducts - The list of products to display on the current page.
 * @property {string} activeCategory - The currently selected category for filtering.
 * 
 * @constructor
 * @param {Title} titleService - Angular service for managing the document title.
 * @param {Meta} metaService - Angular service for managing meta tags.
 * 
 * @method ngOnInit Initializes the component, sets up the product list, and updates the paged products.
 * @method ngAfterViewInit Ensures that all <aside> elements remain visible by observing style changes.
 * @method trackById Used for Angular's ngFor trackBy to optimize rendering by product id.
 * @method gotoItems Navigates to the product detail page for a given product.
 * @method getProduitsFiltres Returns the filtered list of products based on priority, category, and theme.
 * @method updatePagedProducts Updates the pagedProducts array based on the current filters and pagination.
 * @method onPageChange Handles pagination events and updates the displayed products.
 * @method setCategorie Sets the active category for filtering.
 * @method setTheme Sets the active theme for filtering.
 */
export class ShopComponent implements AfterViewInit, OnInit {
  isLoadingAll = false;
  loadedCount = 0;
  expectedCount = 0;


  products: any[] = [];
  filteredProducts: any[] = [];
  selectedCategory: string = '';
  categories: string[] = ['hommes', 'femmes', 'accessoires', 'maison', 'jouets'];
  themes = ['angular', 'react', 'Vue', 'Svelte', 'Node.js', 'Python'];
  activeTheme: string | null = null;
  // pagination
  pageSize = 28;
  currentPage = 0;
  pagedProducts: any[] = [];


  activeCategory = 'Tous';

  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);



  constructor(private titleService: Title, private metaService: Meta, private seo: SeoService) { }

  ngOnInit(): void {
    this.seo.updateMetaData({
    title: 'Boutique – Red Squiggly',
    description: 'Découvrez la mode geek, inspirée des stacks.',
    keywords: 'verstack, langages, outils, développeurs, Angular, React, style, mode, geek',
    image: 'public/assets/slider/slider-1.jpg',
    url: 'https://verstack.io/shop'
  });

    this.products = [
      { component: '1746262304851', id: '9698056798555', category: 'hommes', theme: ['angular'], prioritary: true },
      { component: '1746258121419', id: '9879512351067', category: 'hommes', theme: ['angular'], prioritary: false },
      { component: '1746294248466', id: '9879805395291', category: 'hommes', theme: ['angular'], prioritary: true },
      { component: '1746294331847', id: '9879808672091', category: 'hommes', theme: ['angular'], prioritary: true },
      { component: '1746404732790', id: '9881257574747', category: 'hommes', theme: ['angular'], prioritary: true },
      { component: '1746428728561', id: '9881395429723', category: 'maison', theme: ['angular'], prioritary: true },
      { component: '1746430266071', id: '9881414271323', category: 'maison', theme: ['angular'], prioritary: false },
      { component: '1746430349878', id: '9881411813723', category: 'maison', theme: ['angular'], prioritary: true },
      { component: '1746610575301', id: '9887484674395', category: 'maison', theme: ['hello kitty'], prioritary: false },
      { component: '1746611752322', id: '9887524094299', category: 'femmes', theme: ['hello kitty'], prioritary: true },

      { component: '1746732417993', id: '9891635495259', category: 'femmes', theme: ['rs'], prioritary: true },
      { component: '1746633268270', id: '9888303579483', category: 'femmes', theme: ['rs'], prioritary: true },
      { component: '1746634547276', id: '9888352928091', category: 'hommes', theme: ['angular', 'pokemon'], prioritary: true },
      { component: '1746635517652', id: '9888386646363', category: 'hommes', theme: ['c++', 'pokemon'], prioritary: true },
      { component: '1746635660529', id: '9888396902747', category: 'hommes', theme: ['docker', 'pokemon'], prioritary: false },
      { component: '1746636120006', id: '9888421118299', category: 'hommes', theme: ['java', 'pokemon'], prioritary: true },
      { component: '1746636647498', id: '9888436650331', category: 'hommes', theme: ['react', 'pokemon'], prioritary: false },
      { component: '1746637225107', id: '9888452084059', category: 'hommes', theme: ['react', 'DBZ'], prioritary: true },
      { component: '1746638162277', id: '9888477086043', category: 'hommes', theme: ['angular', 'DBZ'], prioritary: true },

      { component: '1746639225893', id: '9888504545627', category: 'hommes', theme: ['rs'], prioritary: false },
      { component: '1746640097726', id: '9888527090011', category: 'hommes', theme: ['rs'], prioritary: true },
      { component: '1746736407663', id: '9891805528411', category: 'hommes', theme: ['rs'], prioritary: true },
      { component: '1746736872758', id: '9891827188059', category: 'hommes', theme: ['rs'], prioritary: true },
      { component: '1746737527729', id: '9891855565147', category: 'hommes', theme: ['rs'], prioritary: true },
      { component: '1746738378281', id: '9891901276507', category: 'hommes', theme: ['rs'], prioritary: true },
      { component: '1747328163472', id: '9900459426139', category: 'hommes', theme: ['rs'], prioritary: true },
      { component: '1747339188142', id: '9900517884251', category: 'hommes', theme: ['rs'], prioritary: true },
      { component: '1747339375388', id: '9900525420891', category: 'femmes', theme: ['rs'], prioritary: true },
      { component: '1747341061013', id: '9900662587739', category: 'femmes', theme: ['rs'], prioritary: false },
      { component: '1747342008257', id: '9900671828315', category: 'femmes', theme: ['rs'], prioritary: false },
      { component: '1747343258833', id: '9900683002203', category: 'hommes', theme: ['rs'], prioritary: false },
      { component: '1747344026376', id: '9900693225819', category: 'hommes', theme: ['rs'], prioritary: false },
      { component: '1747344345473', id: '9900695847259', category: 'hommes', theme: ['rs'], prioritary: true },
      { component: '1747344830170', id: '9900701843803', category: 'hommes', theme: ['rs'], prioritary: true },
      { component: '1747345308316', id: '9900705743195', category: 'hommes', theme: ['rs'], prioritary: false },
      { component: '1747345922328', id: '9900711379291', category: 'hommes', theme: ['rs'], prioritary: true },
      { component: '1747495353961', id: '9903723250011', category: 'hommes', theme: ['rs'], prioritary: true },
      { component: '1747496440258', id: '9903731540315', category: 'hommes', theme: ['rs'], prioritary: true },
      { component: '1747497459133', id: '9903743369563', category: 'hommes', theme: ['rs'], prioritary: true },
      { component: '1747497993907', id: '9903746515291', category: 'hommes', theme: ['rs'], prioritary: true },
      { component: '1748109198345', id: '9905642209627', category: 'hommes', theme: ['rs'], prioritary: true },
      { component: '1748109259742', id: '9917987979611', category: 'hommes', theme: ['rs'], prioritary: true },
      { component: '1748109335109', id: '9909646885211', category: 'femmes', theme: ['rs'], prioritary: true },



    ]
    
    this.updatePagedProducts();


    


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

    });

   




  }

 


  trackById(index: number, product: any): number {
    return product.id;
  }


  gotoItems(product: any): void {
    this.router.navigate(['/shop', product.id], { queryParams: { component: product.component } });
  }

  getProduitsFiltres(): any[] {
    let result = [...this.products];
    //this.products.filter(p => p.prioritary);

    if (this.activeCategory !== 'Tous') {
      result = result.filter(p => p.category === this.activeCategory);
    } else {
      result = result.filter(p => p.prioritary);
    }

    if (this.activeTheme) {
      result = result.filter(p => p.theme.includes(this.activeTheme));
    }

    return result;
  }

  updatePagedProducts() {
    const all = this.getProduitsFiltres();
    const start = this.currentPage * this.pageSize;
    const end = start + this.pageSize;
    this.pagedProducts = all.slice(start, end);

    // Initialisation du suivi de chargement
    this.expectedCount = this.pagedProducts.length;
    this.loadedCount = 0;
  }

   onProductLoaded() {
    this.loadedCount++;
    if (this.loadedCount >= this.expectedCount) {
    this.isLoadingAll = true;
    }
  }

  

  onPageChange(event: PageEvent) {
    this.pageSize = event.pageSize;
    this.currentPage = event.pageIndex;
    this.updatePagedProducts();
  }




  setCategorie(cat: string) {
    this.activeCategory = cat;
    this.currentPage = 0;
    this.updatePagedProducts();
  }

  setTheme(theme: string | null) {
    this.activeTheme = theme;
    this.currentPage = 0;
    this.updatePagedProducts();
  }
}
