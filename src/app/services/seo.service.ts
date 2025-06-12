import { Injectable, Inject } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { DOCUMENT } from '@angular/common';

@Injectable({ providedIn: 'root' })
export class SeoService {
  constructor(private title: Title, private meta: Meta, @Inject(DOCUMENT) private doc: Document) {}

  updateMetaData(options: {
    title: string;
    description: string;
    keywords?: string;
    image?: string;
    url?: string;
    robots?: string;
    canonical?: string;
  }) {
    this.title.setTitle(options.title);

    // Meta tags standard
    this.meta.updateTag({ name: 'description', content: options.description });
    if (options.keywords) {
      this.meta.updateTag({ name: 'keywords', content: options.keywords });
    }
    if (options.robots) {
      this.meta.updateTag({ name: 'robots', content: options.robots });
    }

    // Open Graph tags
    this.meta.updateTag({ property: 'og:title', content: options.title });
    this.meta.updateTag({ property: 'og:description', content: options.description });
    if (options.image) {
      this.meta.updateTag({ property: 'og:image', content: options.image });
    }
    if (options.url) {
      this.meta.updateTag({ property: 'og:url', content: options.url });
    }
    this.meta.updateTag({ property: 'og:type', content: 'website' });

    // Twitter card (bonus)
    this.meta.updateTag({ name: 'twitter:card', content: 'summary_large_image' });
    this.meta.updateTag({ name: 'twitter:title', content: options.title });
    this.meta.updateTag({ name: 'twitter:description', content: options.description });
    if (options.image) {
      this.meta.updateTag({ name: 'twitter:image', content: options.image });
    }

    if (options.canonical) {
      let link = this.doc.querySelector<HTMLLinkElement>('link[rel="canonical"]');
      if (!link) {
        link = this.doc.createElement('link');
        link.setAttribute('rel', 'canonical');
        this.doc.head.appendChild(link);
      }
      link.setAttribute('href', options.canonical);
    }
  }
}
