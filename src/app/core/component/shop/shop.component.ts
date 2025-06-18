// shop.component.ts
import { AfterViewInit, Component, inject, OnInit, Inject, PLATFORM_ID, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
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
import { CommonModule, isPlatformBrowser, DOCUMENT } from '@angular/common';
import { SeoService } from '../../../services/seo.service';
import { ProductsService } from '../../../services/products.service';
import { ShopifyLoaderService } from '../../../services/shopify-loader.service';

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
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    { provide: MatPaginatorIntl, useValue: getFrenchPaginatorIntl() }
  ]
})

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

 private isBrowser: boolean;

  constructor(private titleService: Title, private metaService: Meta, private seo: SeoService,
              private productsService: ProductsService,
              private shopifyLoader: ShopifyLoaderService,
              private cdr: ChangeDetectorRef,
              @Inject(PLATFORM_ID) private platformId: Object,
              @Inject(DOCUMENT) private document: Document) { 
                this.isBrowser = isPlatformBrowser(platformId);
              }

  ngOnInit(): void {
    this.seo.updateMetaData({
    title: 'Boutique – Red Squiggly',
    description: 'Découvrez la mode geek, inspirée des stacks.',
    keywords: 'verstack, langages, outils, développeurs, Angular, React, style, mode, geek',
    image: 'public/assets/slider/slider-1.jpg',
    url: 'https://verstack.io/shop'
  });
  this.productsService.getProducts().subscribe({
    next: (products) => {
      this.products = products;
      this.filteredProducts = products;
      if (!this.isLoadingAll) {
        this.isLoadingAll = true;
      }// Notifier Angular que les données ont changé
      this.cdr.markForCheck(); 
      this.updatePagedProducts();
      if (this.isBrowser) {
        this.shopifyLoader.load().catch(() => {});
      }
    },
    error: (err) => {
      console.error('Erreur lors du chargement des produits:', err);
    }
  })


   



  }

  ngAfterViewInit() {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    this.shopifyLoader.load().catch(() => {});

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
