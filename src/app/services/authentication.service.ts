import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap, shareReplay } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthenticationService {
  private baseUrl = 'api/authentication';
   authStatusSubject = new BehaviorSubject<boolean>(this.isLoggedIn());

  constructor(private http: HttpClient) {}

  signup(data: any): Observable<any> {
    console.log(data);
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
          console.log(response);
          if (response.accessToken) {
            this.updateAuthStatus(true);
            this.storeUserData(response);
          }
        }),
        shareReplay()
      )
  }

  logout() {
    localStorage.removeItem('token');
    this.updateAuthStatus(false);
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('token');
  }

  updateAuthStatus(status: boolean) {
    this.authStatusSubject.next(status);
  }

  getAuthStatus(): Observable<boolean> {
    return this.authStatusSubject.asObservable();
  }

  getUserData(): string {
    const userData = localStorage.getItem('user');
    return userData ? JSON.parse(userData) : '';
  }

  getUserId(): string {
    const userData = localStorage.getItem('user');
    return userData ? JSON.parse(userData)._id : '';
  }

  private storeUserData(response: any) {
    localStorage.setItem('token', response.accessToken);
    localStorage.setItem('user', JSON.stringify(response));
    localStorage.setItem('favoris', JSON.stringify(response.favoris));
  }
}
