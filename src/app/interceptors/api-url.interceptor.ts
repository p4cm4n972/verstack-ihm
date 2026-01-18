import { inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpEvent, HttpHandlerFn, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';

/**
 * Intercepteur HTTP qui transforme les URLs relatives /api/*
 * en URLs absolues vers api.verstack.io en production
 */

function getApiBaseUrl(platformId: Object): string {
  // Côté client (browser)
  if (isPlatformBrowser(platformId)) {
    const hostname = window.location.hostname;
    // Production : Vercel ou verstack.io
    if (hostname === 'verstack.io' ||
        hostname === 'www.verstack.io' ||
        hostname.includes('vercel.app')) {
      return 'https://api.verstack.io';
    }
    // Développement local : pas de préfixe (proxy Angular)
    return '';
  }

  // Côté serveur (SSR) : toujours utiliser l'URL complète
  return 'https://api.verstack.io';
}

export function apiUrlInterceptor(req: HttpRequest<unknown>, next: HttpHandlerFn): Observable<HttpEvent<unknown>> {
  const platformId = inject(PLATFORM_ID);

  // Ne transformer que les URLs commençant par /api/
  if (req.url.startsWith('/api/')) {
    const baseUrl = getApiBaseUrl(platformId);

    if (baseUrl) {
      const newUrl = `${baseUrl}${req.url}`;
      const clonedReq = req.clone({ url: newUrl });
      return next(clonedReq);
    }
  }

  return next(req);
}
