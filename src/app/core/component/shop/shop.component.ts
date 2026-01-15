// shop.component.ts
import { AfterViewInit, Component, inject, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser, DOCUMENT } from '@angular/common';
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

import { SeoService } from '../../../services/seo.service';
import { ProductsService } from '../../../services/products.service';

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
  imports: [MatFormFieldModule, MatCardModule, MatButtonModule, MatToolbarModule, MatIconModule, MatSelectModule, ShopifyBuyButtonComponent, MatPaginatorModule],
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
  themes = ['angular', 'react', 'Vue', 'Svelte', 'Node.js', 'Python', 'rs', 'retro', 'hello kitty', 'c++', 'java', 'docker', 'DBZ', 'pokemon'];
  activeTheme: string | null = null;
  // pagination
  pageSize = 28;
  currentPage = 0;
  pagedProducts: any[] = [];


  activeCategory = 'Tous';

  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);



  constructor(
    private titleService: Title,
    private metaService: Meta,
    private seo: SeoService,
    private productsService: ProductsService,
    @Inject(DOCUMENT) private document: Document,
    @Inject(PLATFORM_ID) private platformId: Object,
  ) {}

  ngOnInit(): void {
    this.seo.updateMetaData({
    title: 'Boutique – Red Squiggly',
    description: 'Découvrez la mode geek, inspirée des stacks.',
    keywords: `verstack, langages, outils, développeurs, Angular, React , version Angular, version React, version Vue.js, version Node.js, version Python, version Java,
      version C#, version PHP, version Ruby, version Go, version Rust, version JavaScript, version TypeScript, version Bash, version Shell, version Perl,
      version Kotlin, version Swift, version Scala, version Dart, version Objective-C, version C, version C++, version R, version MATLAB, version Julia,
      version Haskell, version Elixir, version Erlang, version F#, version Groovy, version PowerShell, version Assembly, version SQL, version HTML,
      version CSS, version SASS, version LESS, version Docker, version Kubernetes, version Terraform, version Ansible, version Jenkins, version Git,
      version GitHub Actions, version Travis CI, version CircleCI, version Webpack, version Babel, version ESLint, version Prettier, version Nginx,
      version Apache, version PostgreSQL, version MySQL, version MongoDB, version Redis, version GraphQL, version Firebase, version Supabase,
      version Netlify, version Vercel, version AWS, version Azure, version GCP`,
    image: 'public/assets/slider/slider-1.jpg',
    url: 'https://verstack.io/shop'
  });
    this.products = this.productsService.getProducts();

    
    this.updatePagedProducts();


    


  }

  ngAfterViewInit() {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    const asides = this.document.querySelectorAll('aside');
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
