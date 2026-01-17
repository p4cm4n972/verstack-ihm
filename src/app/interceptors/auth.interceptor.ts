import { inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpHandlerFn,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { catchError, Observable, switchMap, throwError } from 'rxjs';
import { AuthenticationService } from '../services/authentication.service';


// URLs externes à exclure de l'authentification
const EXTERNAL_URLS = [
  'dev.to',
  'hacker-news.firebaseio.com',
  'api.github.com',
  'gravatar.com'
];

function isExternalUrl(url: string): boolean {
  return EXTERNAL_URLS.some(domain => url.includes(domain));
}

export function authInterceptor(req: HttpRequest<unknown>, next: HttpHandlerFn): Observable<HttpEvent<unknown>>{

  const platformId = inject(PLATFORM_ID);
  const isBrowser = isPlatformBrowser(platformId);
  const refresh = inject(AuthenticationService).refreshToken();

  // Ne pas ajouter d'Authorization pour les APIs externes
  if (isExternalUrl(req.url)) {
    return next(req);
  }

    const accessToken = isBrowser ? localStorage.getItem('access_token') : null;

    let request = req;
    if (accessToken) {
      request = req.clone({
        setHeaders: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
    }
    return next(request).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401 && !req.url.includes('/refresh-tokens')) {
          return refresh.pipe(
            switchMap((tokens: any) => {
              const clonedReq = req.clone({
                setHeaders: {
                  Authorization: `Bearer ${tokens.accessToken}`,
                },
              });

              return next(clonedReq);
            }),
            catchError(() => {
              return throwError(() => error);
            })
          );
        }
        return throwError(() => error);
      })
    );
  
}
