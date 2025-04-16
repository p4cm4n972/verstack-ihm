import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap, shareReplay } from 'rxjs';
import { jwtDecode } from 'jwt-decode';

@Injectable({
  providedIn: 'root',
})
export class AuthenticationService {
  private baseUrl = 'api/authentication';
  // authStatusSubject = new BehaviorSubject<boolean>(this.isLoggedIn());

  private isAuthenticated$ = new BehaviorSubject<boolean>(this.hasValidAccessToken());

  constructor(private http: HttpClient) {}

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
            // this.updateAuthStatus(true);
          }
        }),
        shareReplay()
      );
  }

  refreshToken(): Observable<any> {
    const refreshToken = localStorage.getItem('refresh_token');
    return this.http.post(`${this.baseUrl}/refresh-tokens`, { refreshToken }).pipe(
      tap((response: any) => {
        this.storeUserData(response);
        this.getDecodedToken()
      })
    )
  }

  logout() {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user');
    localStorage.removeItem('userId');
    this.isAuthenticated$.next(false);
    // this.updateAuthStatus(false);
  }

  storeUserData(response: any) {
    localStorage.setItem('access_token', response.accessToken);
    localStorage.setItem('refresh_token', response.refreshToken);
    this.getUserData();

  }

  getAccessToken(): string | null {
    return localStorage.getItem('access_token');
  }
  getRefreshToken(): string | null {
    return localStorage.getItem('refresh_token');
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
    const token = this.getAccessToken();
    const decodedToken: any = token ? jwtDecode(token) : null;
    localStorage.setItem('user', decodedToken ? JSON.stringify(decodedToken) : '');
    localStorage.setItem('userId', decodedToken ? decodedToken.id : '');
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

    // const userData = localStorage.getItem('user');
    return  info.pseudo ? info.pseudo : '';
  }

  getUserId(): string {
    const info = this.getDecodedToken();

    // const userData = localStorage.getItem('user');
    return info.id ? info.id : '';
  }

  

  
}
