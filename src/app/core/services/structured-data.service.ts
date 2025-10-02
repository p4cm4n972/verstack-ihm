import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser, DOCUMENT } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class StructuredDataService {
  private scriptId = 'structured-data';

  constructor(
    @Inject(DOCUMENT) private document: Document,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  addStructuredData(data: any): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    // Remove existing structured data if present
    this.removeStructuredData();

    // Create and append new structured data
    const script = this.document.createElement('script');
    script.type = 'application/ld+json';
    script.id = this.scriptId;
    script.text = JSON.stringify(data);
    this.document.head.appendChild(script);
  }

  removeStructuredData(): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    const existingScript = this.document.getElementById(this.scriptId);
    if (existingScript) {
      existingScript.remove();
    }
  }

  // Helper method to create Organization structured data
  createOrganizationSchema(): any {
    return {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      name: 'Verstack',
      url: 'https://verstack.io',
      logo: 'https://verstack.io/assets/icons/logo-banniere-RS.png',
      description: 'Plateforme centralisée pour suivre les versions et tendances des langages de programmation, frameworks et outils dédiés au développement.',
      sameAs: [
        // Add social media URLs if available
      ]
    };
  }

  // Helper method to create WebSite structured data
  createWebSiteSchema(): any {
    return {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      name: 'Verstack',
      url: 'https://verstack.io',
      description: 'Plateforme centralisée pour suivre les versions et tendances des langages de programmation, frameworks et outils dédiés au développement.',
      potentialAction: {
        '@type': 'SearchAction',
        target: 'https://verstack.io/version?search={search_term_string}',
        'query-input': 'required name=search_term_string'
      }
    };
  }

  // Helper method to create Article structured data
  createArticleSchema(article: {
    title: string;
    description: string;
    image: string;
    datePublished: string;
    dateModified?: string;
    author?: string;
    url: string;
  }): any {
    return {
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: article.title,
      description: article.description,
      image: article.image,
      datePublished: article.datePublished,
      dateModified: article.dateModified || article.datePublished,
      author: {
        '@type': 'Person',
        name: article.author || 'P4cm4n972'
      },
      publisher: {
        '@type': 'Organization',
        name: 'Verstack',
        logo: {
          '@type': 'ImageObject',
          url: 'https://verstack.io/assets/icons/logo-banniere-RS.png'
        }
      },
      mainEntityOfPage: {
        '@type': 'WebPage',
        '@id': article.url
      }
    };
  }

  // Helper method to create BreadcrumbList structured data
  createBreadcrumbSchema(items: Array<{ name: string; url: string }>): any {
    return {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: items.map((item, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        name: item.name,
        item: item.url
      }))
    };
  }
}
