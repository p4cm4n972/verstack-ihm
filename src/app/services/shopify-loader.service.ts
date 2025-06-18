import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser, DOCUMENT } from '@angular/common';

@Injectable({ providedIn: 'root' })
export class ShopifyLoaderService {
  private loaderPromise: Promise<void> | null = null;

  constructor(@Inject(PLATFORM_ID) private platformId: Object,
              @Inject(DOCUMENT) private document: Document) {}

  load(): Promise<void> {
    if (!isPlatformBrowser(this.platformId)) {
      return Promise.resolve();
    }

    if (this.loaderPromise) {
      return this.loaderPromise;
    }

    if ((window as any).ShopifyBuy && (window as any).ShopifyBuy.UI) {
      this.loaderPromise = Promise.resolve();
      return this.loaderPromise;
    }

    // Check if a valid Shopify script already exists to avoid duplicates or
    // empty `src` errors when the script fails to load correctly.
    const existing = Array.from(this.document.scripts).find((s) =>
      s.src.includes('buy-button-storefront.min.js')
    );
    if (existing) {
      this.loaderPromise = Promise.resolve();
      return this.loaderPromise;
    }

    this.loaderPromise = new Promise<void>((resolve, reject) => {
      const script = this.document.createElement('script');
      script.async = true;
      script.src =
        'https://sdks.shopifycdn.com/buy-button/latest/buy-button-storefront.min.js';

      // Fallback: ensure the src is not empty before appending the script
      if (!script.src) {
        script.src =
          'https://sdks.shopifycdn.com/buy-button/latest/buy-button-storefront.min.js';
      }

      script.onload = () => resolve();
      script.onerror = () => reject();
      this.document.head.appendChild(script);
    });

    return this.loaderPromise;
  }
}
