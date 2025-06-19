import {
  AfterViewInit,
  Component,
  Inject,
  inject,
  OnInit,
  PLATFORM_ID,
} from '@angular/core';
import { isPlatformBrowser, DOCUMENT } from '@angular/common';
import { ShopifyLoaderService } from '../../services/shopify-loader.service';
import { ShopifyBuyButtonComponent } from '../shopify-buy-button/shopify-buy-button.component';
import { MatCardModule } from '@angular/material/card';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-shopify-modal-product',
  imports: [ MatCardModule, MatIconModule, RouterModule, MatButtonModule],
  templateUrl: './shopify-modal-product.component.html',
  styleUrl: './shopify-modal-product.component.scss',
})
export class ShopifyModalProductComponent implements AfterViewInit, OnInit {

  private readonly route = inject(ActivatedRoute);

  data: any = {
    id: '',
    component: ''
  };
  productId!: string | null;
  componentId!: string | null;
  component!: string;
  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    @Inject(DOCUMENT) private document: Document,
    private loader: ShopifyLoaderService,
  ) {}


  ngOnInit(): void {
    this.productId = this.route.snapshot.paramMap.get('id');
    this.componentId = this.route.snapshot.queryParams['component'];
    this.component = `product-component-${this.componentId}`;
    console.log(this.component)
    console.log('on init');
    if (this.productId && this.componentId) {
      this.data = {
        id: this.productId,
        component: this.componentId
      };
    }
  }
 


  ngAfterViewInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.loader
        .load()
        .then(() => this.createComponent())
        .catch(() => {});
    }
  }
  
    private createComponent() {
      const ShopifyBuy = (window as any).ShopifyBuy;
      const client = ShopifyBuy.buildClient({
        domain: 's8h1eq-f8.myshopify.com',
        storefrontAccessToken: '232f9b875a9e591cc075e509677c130e',
      });
  
      ShopifyBuy.UI.onReady(client).then( (ui: any) => {
        ui.createComponent('product', {
          id: `${this.data.id}`,
          node: this.document.getElementById(`${this.component}`),
          moneyFormat: '%E2%82%AC%7B%7Bamount_with_comma_separator%7D%7D',
          options: {
    "product": {
      "styles": {
        "product": {
          "@media (min-width: 601px)": {
            "max-width": "100%",
            "margin-left": "0",
            "margin-bottom": "50px"
          },
          "text-align": "left"
        },
        "title": {
          "font-size": "26px"
        },
        "price": {
          "font-size": "18px"
        },
        "compareAt": {
          "font-size": "15.299999999999999px"
        },
        "unitPrice": {
          "font-size": "15.299999999999999px"
        }
      },
      "layout": "horizontal",
      "contents": {
        "img": false,
        "imgWithCarousel": true,
        "description": true
      },
      "width": "100%",
      "text": {
        "button": "Ajouter au panier",
      }
    },
    "productSet": {
      "styles": {
        "products": {
          "@media (min-width: 601px)": {
            "margin-left": "-20px"
          }
        }
      }
    },
    "modalProduct": {
      "contents": {
        "img": false,
        "imgWithCarousel": true,
        "button": false,
        "buttonWithQuantity": true
      },
      "styles": {
        "product": {
          "@media (min-width: 601px)": {
            "max-width": "100%",
            "margin-left": "0px",
            "margin-bottom": "0px"
          }
        },
        "title": {
          "font-family": "Helvetica Neue, sans-serif",
          "font-weight": "bold",
          "font-size": "26px",
          "color": "#4c4c4c"
        },
        "price": {
          "font-family": "Helvetica Neue, sans-serif",
          "font-weight": "normal",
          "font-size": "18px",
          "color": "#4c4c4c"
        },
        "compareAt": {
          "font-family": "Helvetica Neue, sans-serif",
          "font-weight": "normal",
          "font-size": "15.299999999999999px",
          "color": "#4c4c4c"
        },
        "unitPrice": {
          "font-family": "Helvetica Neue, sans-serif",
          "font-weight": "normal",
          "font-size": "15.299999999999999px",
          "color": "#4c4c4c"
        }
      },
      "text": {
        "button": "Ajouter au panier",
      }
    },
    "option": {},
    "cart": {
      "text": {
        "total": "Sous-total",
        "notice": "Les frais de port et d'autres frais seront calculés à l'étape de paiement.",
        "button": "Payer",
        "empty": "Votre panier est vide.",
        "title": "Panier",
        "header": "Panier",
        "close": "Fermer",
        "remove": "Supprimer",
      }
    },
    "toggle": {}
  },
        });
      });
    }
  }
