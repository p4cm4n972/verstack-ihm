import { inject, Injectable } from '@angular/core';
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


export function authInterceptor(req: HttpRequest<unknown>, next: HttpHandlerFn): Observable<HttpEvent<unknown>>{


  const refresh = inject(AuthenticationService).refreshToken();
 
    
    const accessToken = localStorage.getItem('access_token');

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
