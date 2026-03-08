import { inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpEvent, HttpHandlerFn, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';

/**
 * Intercepteur HTTP qui transforme les URLs relatives /api/*
 * en URLs absolues vers api.version.itmade.fr en production
 */

function getApiBaseUrl(platformId: Object): string {
  // Côté client (browser)
  if (isPlatformBrowser(platformId)) {
    const hostname = window.location.hostname;
    // Production : version.itmade.fr ou Vercel
    if (hostname === 'version.itmade.fr' ||
        hostname === 'www.version.itmade.fr' ||
        hostname.includes('vercel.app')) {
      return 'https://api.version.itmade.fr';
    }
    // Développement local : pas de préfixe (proxy Angular)
    return '';
  }

  // Côté serveur (SSR) : toujours utiliser l'URL complète
  return 'https://api.version.itmade.fr';
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
