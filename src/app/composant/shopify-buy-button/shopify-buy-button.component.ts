import { AfterViewInit, Component, EventEmitter, inject, Inject, Input, Output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-shopify-buy-button',
  imports: [MatCardModule, MatButtonModule, MatIconModule],
  templateUrl: './shopify-buy-button.component.html',
  styleUrl: './shopify-buy-button.component.scss',
  standalone: true,
})
export class ShopifyBuyButtonComponent implements AfterViewInit {
  @Input() productId!: string; // <- ID produit Shopify
  @Input() componentId!: string; // <- ID DOM unique à ce produit

  @Output() loaded = new EventEmitter<void>();
  @Output() error = new EventEmitter<string>();



  constructor() {
  }

  ngAfterViewInit(): void {
    this.initBuyButton();
  }

  private initBuyButton() {
    if ((window as any).ShopifyBuy) {
      if ((window as any).ShopifyBuy.UI) {
        this.createComponent();
      } else {
        this.loadScript();
      }
    } else {
      this.loadScript();
    }
  }

  private loadScript() {
    const script = document.createElement('script');
    script.async = true;
    script.src = 'https://sdks.shopifycdn.com/buy-button/latest/buy-button-storefront.min.js';
    script.onload = () => this.createComponent();
    document.head.appendChild(script);
  }

  private createComponent() {
    const ShopifyBuy = (window as any).ShopifyBuy;
    const client = ShopifyBuy.buildClient({
      domain: 's8h1eq-f8.myshopify.com',
      storefrontAccessToken: '232f9b875a9e591cc075e509677c130e',
    });

    ShopifyBuy.UI.onReady(client).then((ui: any) => {
      ui.createComponent('product', {
        id: `${this.productId}`,
        node: document.getElementById(`${this.componentId}`),
        moneyFormat: '%E2%82%AC%7B%7Bamount_with_comma_separator%7D%7D',
        options: {
          "product": {
            "styles": {
              "product": {
                "@media (min-width: 601px)": {
                  "max-width": "calc(25% - 20px)",
                  "margin-left": "20px",
                  "margin-bottom": "50px"
                },
              },



            },
            "contents": {
              "options": false,
            },
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
              "button": "Passer à la caisse",
              "empty": "Votre panier est vide",
              "notice": "Les frais de port et les taxes sont calculés lors de la validation de la commande.",
              "header": "Panier",
              "title": "Panier",
              "close": "Fermer",
              "remove": "Supprimer",
            }
          },
          "toggle": {}
        },
      });
      const container = document.getElementById(`${this.componentId}`);

      const observer = new MutationObserver(() => {
        const iframe = container?.querySelector('iframe');
        if (iframe) {
          this.loaded.emit();
          observer.disconnect();
        }
      });
      observer.observe(container!, { childList: true, subtree: true });
    });
  }
}
