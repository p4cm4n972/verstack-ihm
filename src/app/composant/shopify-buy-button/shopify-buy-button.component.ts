import {
  AfterViewInit,
  Component,
  EventEmitter,
  Inject,
  Input,
  Output,
  PLATFORM_ID,
} from '@angular/core';
import { isPlatformBrowser, DOCUMENT } from '@angular/common';
import { ShopifyLoaderService } from '../../services/shopify-loader.service';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
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



  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    @Inject(DOCUMENT) private document: Document,
    private loader: ShopifyLoaderService,
  ) {}

  ngAfterViewInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.loader
        .load()
        .then(() => this.createComponent())
        .catch(() => this.error.emit('Failed to load Shopify script'));
    }
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
        node: this.document.getElementById(`${this.componentId}`),
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
              "title": {
                "font-family": "'Courier New', monospace",
                "font-weight": "700",
                "font-size": "13px",
                "color": "#ffffff",
                "text-shadow": "0 0 8px rgba(229, 57, 53, 0.3)",
                "max-height": "40px",
                "min-height": "40px",
                "overflow": "hidden",
                "line-height": "1.3",
                "display": "-webkit-box",
                "-webkit-line-clamp": "2",
                "-webkit-box-orient": "vertical"
              },
              "price": {
                "font-family": "'Courier New', monospace",
                "font-weight": "600",
                "font-size": "16px",
                "color": "#ff5252"
              },
              "compareAt": {
                "font-family": "'Courier New', monospace",
                "font-size": "13px",
                "color": "rgba(255, 255, 255, 0.5)"
              },
              "button": {
                "font-family": "'Courier New', monospace",
                "font-weight": "700",
                "font-size": "12px",
                "letter-spacing": "1px",
                "text-transform": "uppercase",
                "padding": "12px 20px",
                "background": "linear-gradient(135deg, rgba(229, 57, 53, 0.8) 0%, rgba(183, 28, 28, 0.8) 100%)",
                "border-radius": "6px",
                "border": "1px solid rgba(229, 57, 53, 0.6)",
                "color": "#ffffff",
                ":hover": {
                  "background": "linear-gradient(135deg, rgba(229, 57, 53, 1) 0%, rgba(183, 28, 28, 1) 100%)",
                  "box-shadow": "0 0 20px rgba(229, 57, 53, 0.5)"
                },
                ":focus": {
                  "background": "linear-gradient(135deg, rgba(229, 57, 53, 1) 0%, rgba(183, 28, 28, 1) 100%)"
                }
              },
              "img": {
                "border-radius": "8px"
              },
              "imgWrapper": {
                "background": "transparent"
              }
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
                "font-family": "'Courier New', monospace",
                "font-weight": "bold",
                "font-size": "24px",
                "color": "#ffffff"
              },
              "price": {
                "font-family": "'Courier New', monospace",
                "font-weight": "600",
                "font-size": "20px",
                "color": "#ff5252"
              },
              "compareAt": {
                "font-family": "'Courier New', monospace",
                "font-weight": "normal",
                "font-size": "15px",
                "color": "rgba(255, 255, 255, 0.5)"
              },
              "unitPrice": {
                "font-family": "'Courier New', monospace",
                "font-weight": "normal",
                "font-size": "15px",
                "color": "rgba(255, 255, 255, 0.6)"
              },
              "button": {
                "font-family": "'Courier New', monospace",
                "font-weight": "700",
                "letter-spacing": "1px",
                "text-transform": "uppercase",
                "background": "linear-gradient(135deg, rgba(229, 57, 53, 0.8) 0%, rgba(183, 28, 28, 0.8) 100%)",
                "border-radius": "6px",
                "border": "1px solid rgba(229, 57, 53, 0.6)",
                "color": "#ffffff",
                ":hover": {
                  "background": "linear-gradient(135deg, rgba(229, 57, 53, 1) 0%, rgba(183, 28, 28, 1) 100%)",
                  "box-shadow": "0 0 20px rgba(229, 57, 53, 0.5)"
                }
              }
            },
            "text": {
              "button": "Ajouter au panier",
            }
          },
          "option": {},
          "cart": {
            "styles": {
              "cart": {
                "background-color": "rgba(15, 10, 12, 0.98)",
                "border-left": "1px solid rgba(229, 57, 53, 0.3)"
              },
              "header": {
                "color": "#ffffff",
                "font-family": "'Courier New', monospace"
              },
              "title": {
                "color": "#ff5252",
                "font-family": "'Courier New', monospace"
              },
              "lineItems": {
                "color": "#ffffff"
              },
              "subtotalText": {
                "color": "rgba(255, 255, 255, 0.7)",
                "font-family": "'Courier New', monospace"
              },
              "subtotal": {
                "color": "#ff5252",
                "font-family": "'Courier New', monospace"
              },
              "notice": {
                "color": "rgba(255, 255, 255, 0.5)",
                "font-family": "'Courier New', monospace"
              },
              "button": {
                "font-family": "'Courier New', monospace",
                "font-weight": "700",
                "letter-spacing": "1px",
                "text-transform": "uppercase",
                "background": "linear-gradient(135deg, rgba(229, 57, 53, 0.8) 0%, rgba(183, 28, 28, 0.8) 100%)",
                "border-radius": "6px",
                "border": "1px solid rgba(229, 57, 53, 0.6)",
                "color": "#ffffff",
                ":hover": {
                  "background": "linear-gradient(135deg, rgba(229, 57, 53, 1) 0%, rgba(183, 28, 28, 1) 100%)"
                }
              },
              "close": {
                "color": "#ff5252",
                ":hover": {
                  "color": "#ffffff"
                }
              },
              "empty": {
                "color": "rgba(255, 255, 255, 0.5)",
                "font-family": "'Courier New', monospace"
              },
              "footer": {
                "background-color": "rgba(20, 10, 12, 0.5)",
                "border-top": "1px solid rgba(229, 57, 53, 0.2)"
              }
            },
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
          "toggle": {
            "sticky": true,
            "styles": {
              "toggle": {
                "position": "fixed",
                "bottom": "30px",
                "right": "30px",
                "left": "auto",
                "top": "auto",
                "z-index": "999999",
                "background": "linear-gradient(135deg, rgba(229, 57, 53, 0.8) 0%, rgba(183, 28, 28, 0.8) 100%)",
                "border": "1px solid rgba(229, 57, 53, 0.6)",
                ":hover": {
                  "background": "linear-gradient(135deg, rgba(229, 57, 53, 1) 0%, rgba(183, 28, 28, 1) 100%)",
                  "box-shadow": "0 0 20px rgba(229, 57, 53, 0.5)"
                }
              },
              "count": {
                "font-family": "'Courier New', monospace",
                "font-weight": "700"
              }
            }
          }
        },
      });
      const container = this.document.getElementById(`${this.componentId}`);

      const observer = new MutationObserver(() => {
        const iframe = container?.querySelector('iframe') as HTMLIFrameElement;
        if (iframe) {
          this.loaded.emit();
          observer.disconnect();
          // Inject scroll animation styles into iframe
          this.injectScrollAnimation(iframe);
        }
      });
      observer.observe(container!, { childList: true, subtree: true });
    });
  }

  private injectScrollAnimation(iframe: HTMLIFrameElement): void {
    // Wait for iframe to fully load
    iframe.addEventListener('load', () => {
      try {
        const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document;
        if (iframeDoc) {
          const style = iframeDoc.createElement('style');
          style.textContent = `
            @keyframes scrollTitle {
              0%, 20% { transform: translateY(0); }
              80%, 100% { transform: translateY(calc(-100% + 40px)); }
            }
            .shopify-buy__product__title {
              max-height: 40px !important;
              min-height: 40px !important;
              overflow: hidden !important;
              position: relative !important;
              transition: all 0.3s ease !important;
            }
            .shopify-buy__product__title:hover {
              overflow: visible !important;
              max-height: none !important;
              animation: scrollTitle 3s ease-in-out infinite alternate !important;
            }
          `;
          iframeDoc.head.appendChild(style);
        }
      } catch (e) {
        // Cross-origin iframe - cannot inject styles
        console.warn('Cannot inject styles into Shopify iframe (cross-origin)');
      }
    });

    // Also try immediately in case iframe is already loaded
    try {
      const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document;
      if (iframeDoc && iframeDoc.head) {
        const style = iframeDoc.createElement('style');
        style.textContent = `
          @keyframes scrollTitle {
            0%, 20% { transform: translateY(0); }
            80%, 100% { transform: translateY(calc(-100% + 40px)); }
          }
          .shopify-buy__product__title {
            max-height: 40px !important;
            min-height: 40px !important;
            overflow: hidden !important;
            position: relative !important;
            transition: all 0.3s ease !important;
          }
          .shopify-buy__product__title:hover {
            overflow: visible !important;
            max-height: none !important;
            animation: scrollTitle 3s ease-in-out infinite alternate !important;
          }
        `;
        iframeDoc.head.appendChild(style);
      }
    } catch (e) {
      // Cross-origin iframe - cannot inject styles
    }
  }
}
