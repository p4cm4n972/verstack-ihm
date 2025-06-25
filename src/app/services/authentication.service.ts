import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { BehaviorSubject, Observable, tap, shareReplay } from 'rxjs';
import { jwtDecode } from 'jwt-decode';

@Injectable({
  providedIn: 'root',
})
export class AuthenticationService {
  private baseUrl = '/api/authentication';
  // authStatusSubject = new BehaviorSubject<boolean>(this.isLoggedIn());

  private isAuthenticated$ = new BehaviorSubject<boolean>(this.hasValidAccessToken());
  private isBrowser: boolean;
  private get storage(): Storage | null {
    return this.isBrowser ? localStorage : null;
  }

  constructor(private http: HttpClient, @Inject(PLATFORM_ID) private platformId: Object) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }



  signup(data: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/signup`, data, {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
    });
  }

  login(credentials: any): Observable<any> {
    return this.http
      .post(`${this.baseUrl}/signin`, credentials, {
        headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
      })
      .pipe(
        tap((response: any) => {
          if (response.accessToken && response.refreshToken) {
            this.storeUserData(response);
            this.isAuthenticated$.next(true);
            this.updateAuthStatus(true);
            const decodedToken = this.getDecodedToken();
            const userId = decodedToken ? decodedToken.id : '';
            if (userId) {
              this.http.get(`/api/users/${userId}`).subscribe({
                next: (profile: any) => {
                  const favoris = profile.favoris ?? [];
                  this.storage?.setItem('favoris', JSON.stringify(favoris));
                }
                , error: (error) => {
                  console.error('Error fetching user data:', error);
                }
              });
            }
          }
        }),
        shareReplay()
      );
  }

  refreshToken(): Observable<any> {
    const refreshToken = this.storage?.getItem('refresh_token');
    return this.http.post(`${this.baseUrl}/refresh-tokens`, { refreshToken }).pipe(
      tap((response: any) => {
        this.storeUserData(response);
        this.getDecodedToken()
      })
    )
  }

  verifyEmail(token: string): Observable<any> {
    console.log(token)
    return this.http.post(`${this.baseUrl}/verify-email`, { token }).pipe(
      tap((response: any) => {
        console.log(response)
      })
    )
  }


  logout() {
    this.storage?.removeItem('access_token');
    this.storage?.removeItem('refresh_token');
    this.storage?.removeItem('user');
    this.storage?.removeItem('userId');
    this.storage?.removeItem('favoris');
    this.isAuthenticated$.next(false);
    this.storage?.clear();
    this.updateAuthStatus(false);
  }

  storeUserData(response: any) {
    this.storage?.setItem('access_token', response.accessToken);
    this.storage?.setItem('refresh_token', response.refreshToken);
    this.getUserData();

  }

  getAccessToken(): string | null {
    return this.storage?.getItem('access_token') || null;
  }
  getRefreshToken(): string | null {
    return this.storage?.getItem('refresh_token') || null;
  }

  isLoggedIn(): Observable<boolean> {
    return this.isAuthenticated$.asObservable();
  }

  private hasValidAccessToken(): boolean {
    const token = this.getAccessToken();
    if (!token) {
      return false;
    }
    try {
      const decode: any = jwtDecode(token);
      return decode.exp * 1000 > Date.now();
    } catch {
      return false;
    }
  }

  getDecodedToken(): any {
    if (!this.isBrowser) {
      return {};
    }

    const token = this.getAccessToken();
    const decodedToken: any = token ? jwtDecode(token) : {};
    this.storage?.setItem('user', decodedToken ? JSON.stringify(decodedToken) : '');
    this.storage?.setItem('userId', decodedToken ? decodedToken.id : '');
    return decodedToken;
  }

  updateAuthStatus(status: boolean) {
    this.isAuthenticated$.next(status);
  }

  getAuthStatus(): Observable<boolean> {
    return this.isAuthenticated$.asObservable();
  }

  getUserData(): string {
    const info = this.getDecodedToken();
    return info?.pseudo || '';
  }

  getUserId(): string {
    const info = this.getDecodedToken();
    return info?.id || '';
  }

  getUserRole(): string {
    const info = this.getDecodedToken();
    return info?.role || '';
  }

  forgotPassword(email: string) {
    return this.http.post(`${this.baseUrl}/forgot-password`, { email });
  }

  resetPassword(token: string, newPassword: string) {
    return this.http.post(`${this.baseUrl}/reset-password`, {
      token,
      newPassword,
    });
  }

  getCurrentUser(): any {
    if (!this.isBrowser) return null;
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }

  checkAuthOnStartup() {
    const user = this.getCurrentUser();
    this.updateAuthStatus(!!user && !!user.id);
  }





}
