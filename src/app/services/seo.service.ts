import { Injectable } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';

@Injectable({ providedIn: 'root' })
export class SeoService {
  constructor(private title: Title, private meta: Meta) {}

  updateMetaData(options: {
    title: string;
    description: string;
    keywords?: string;
    image?: string;
    url?: string;
  }) {
    this.title.setTitle(options.title);

    // Meta tags standard
    this.meta.updateTag({ name: 'description', content: options.description });
    if (options.keywords) {
      this.meta.updateTag({ name: 'keywords', content: options.keywords });
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
  }
}
