import { Injectable, Inject } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { DOCUMENT } from '@angular/common';

export interface SeoMetadata {
  title: string;
  description: string;
  keywords?: string;
  image?: string;
  url?: string;
  robots?: string;
  canonical?: string;
  type?: 'website' | 'article';
  author?: string;
  publishedTime?: string;
  modifiedTime?: string;
}

@Injectable({ providedIn: 'root' })
export class SeoService {
  constructor(private title: Title, private meta: Meta, @Inject(DOCUMENT) private doc: Document) {}

  updateMetaData(options: SeoMetadata) {
    this.title.setTitle(options.title);

    // Meta tags standard
    this.meta.updateTag({ name: 'description', content: options.description });
    if (options.keywords) {
      this.meta.updateTag({ name: 'keywords', content: options.keywords });
    }
    if (options.robots) {
      this.meta.updateTag({ name: 'robots', content: options.robots });
    }
    if (options.author) {
      this.meta.updateTag({ name: 'author', content: options.author });
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
    this.meta.updateTag({ property: 'og:type', content: options.type || 'website' });

    // Article specific tags
    if (options.type === 'article') {
      if (options.publishedTime) {
        this.meta.updateTag({ property: 'article:published_time', content: options.publishedTime });
      }
      if (options.modifiedTime) {
        this.meta.updateTag({ property: 'article:modified_time', content: options.modifiedTime });
      }
      if (options.author) {
        this.meta.updateTag({ property: 'article:author', content: options.author });
      }
    }

    // Twitter card
    this.meta.updateTag({ name: 'twitter:card', content: 'summary_large_image' });
    this.meta.updateTag({ name: 'twitter:title', content: options.title });
    this.meta.updateTag({ name: 'twitter:description', content: options.description });
    if (options.image) {
      this.meta.updateTag({ name: 'twitter:image', content: options.image });
    }
    if (options.url) {
      this.meta.updateTag({ property: 'twitter:url', content: options.url });
    }

    // Canonical URL
    const canonicalUrl = options.canonical || options.url;
    if (canonicalUrl) {
      let link = this.doc.querySelector<HTMLLinkElement>('link[rel="canonical"]');
      if (!link) {
        link = this.doc.createElement('link');
        link.setAttribute('rel', 'canonical');
        this.doc.head.appendChild(link);
      }
      link.setAttribute('href', canonicalUrl);
    }
  }
}
