import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthenticationService {
  private baseUrl = 'api/authentication';
  private authStatusSubject = new BehaviorSubject<boolean>(false);
authStatus$ = this.authStatusSubject.asObservable();
  constructor(private http: HttpClient) {}

  signup(data: any): Observable<any> {
    console.log(data);
    return this.http.post(`${this.baseUrl}/signup`, data, {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
    });
  }

  login(credentials: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/signin`, credentials, {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
    }).pipe(
      tap((response: any) => {
        if (response) {
          this.updateAuthStatus(true); // Mise à jour de l'état
         // this.authService.login(response.token); // Mise à jour de l'état
        }
      })
    );
  }

  logout() {
    localStorage.removeItem('token');
    this.authStatusSubject.next(false);
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('token');
  }

  updateAuthStatus(status: boolean) {
    this.authStatusSubject.next(status);
  }
}
