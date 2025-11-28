import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap, shareReplay } from 'rxjs';
import { jwtDecode } from 'jwt-decode';
import { PlatformService } from '../core/services/platform.service';
import { LoginCredentials, SignupData, AuthResponse, DecodedToken, UserProfile } from '../models/user.interface';

@Injectable({
  providedIn: 'root',
})
export class AuthenticationService {
  private baseUrl = '/api/authentication';
  // authStatusSubject = new BehaviorSubject<boolean>(this.isLoggedIn());

  private isAuthenticated$ = new BehaviorSubject<boolean>(false);
  private userRole$ = new BehaviorSubject<string>('');

  constructor(
    private http: HttpClient,
    private platformService: PlatformService
  ) {
    // Initialiser le statut d'authentification après injection des dépendances
    this.isAuthenticated$.next(this.hasValidAccessToken());
    // Initialiser le rôle au démarrage
    this.userRole$.next(this.getUserRole());
  }

  // Observable public pour que les composants puissent s'abonner
  get userRoleObservable(): Observable<string> {
    return this.userRole$.asObservable();
  }



  signup(data: SignupData): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.baseUrl}/signup`, data, {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
    });
  }

  login(credentials: LoginCredentials): Observable<AuthResponse> {
    return this.http
      .post<AuthResponse>(`${this.baseUrl}/signin`, credentials, {
        headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
      })
      .pipe(
        tap((response: AuthResponse) => {
          if (response.accessToken && response.refreshToken) {
            this.storeUserData(response);
            this.isAuthenticated$.next(true);
            this.updateAuthStatus(true);
            const decodedToken = this.getDecodedToken();
            const userId = decodedToken ? decodedToken.id : '';
            if (userId) {
              this.http.get<UserProfile>(`/api/users/${userId}`).subscribe({
                next: (profile: UserProfile) => {
                  const favoris = profile.favoris ?? [];
                  this.platformService.setJson('favoris', favoris);
                }
                , error: (error) => {
                  console.error('Error fetching user data:', error);
                }
              });
            }

            // Émettre le nouveau rôle pour mettre à jour l'UI de façon réactive
            const role = decodedToken?.role || '';
            this.userRole$.next(role);
          }
        }),
        shareReplay()
      );
  }

  refreshToken(): Observable<AuthResponse> {
    const refreshToken = this.platformService.getLocalStorageItem('refresh_token');
    return this.http.post<AuthResponse>(`${this.baseUrl}/refresh-tokens`, { refreshToken }).pipe(
      tap((response: AuthResponse) => {
        this.storeUserData(response);
        const decodedToken = this.getDecodedToken();
        // Émettre le nouveau rôle pour mettre à jour l'UI de façon réactive
        const role = decodedToken?.role || '';
        this.userRole$.next(role);
      })
    );
  }

  verifyEmail(token: string): Observable<{ message: string }> {
    console.log(token)
    return this.http.post<{ message: string }>(`${this.baseUrl}/verify-email`, { token }).pipe(
      tap((response: { message: string }) => {
        console.log(response)
      })
    )
  }


  logout() {
    this.platformService.removeLocalStorageItem('access_token');
    this.platformService.removeLocalStorageItem('refresh_token');
    this.platformService.removeLocalStorageItem('user');
    this.platformService.removeLocalStorageItem('userId');
    this.platformService.removeLocalStorageItem('favoris');
    this.isAuthenticated$.next(false);
    this.updateAuthStatus(false);
  }

  storeUserData(response: AuthResponse) {
    this.platformService.setLocalStorageItem('access_token', response.accessToken);
    this.platformService.setLocalStorageItem('refresh_token', response.refreshToken);
    this.getUserData();
  }

  getAccessToken(): string | null {
    return this.platformService.getLocalStorageItem('access_token');
  }
  
  getRefreshToken(): string | null {
    return this.platformService.getLocalStorageItem('refresh_token');
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

  getDecodedToken(): DecodedToken | null {
    if (!this.platformService.isBrowser) {
      return null;
    }

    const token = this.getAccessToken();
    const decodedToken: DecodedToken | null = token ? jwtDecode<DecodedToken>(token) : null;
    if (decodedToken) {
      this.platformService.setJson('user', decodedToken);
      this.platformService.setLocalStorageItem('userId', decodedToken.id);
    }
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

  getCurrentUser(): DecodedToken | null {
    return this.platformService.getJson('user', null);
  }

  checkAuthOnStartup() {
    const user = this.getCurrentUser();
    const isValidToken = this.hasValidAccessToken();
    if (!isValidToken) {
      this.logout();
      this.updateAuthStatus(false);
    } else {
      this.updateAuthStatus(!!user && !!user.id);
    }
  }





}
