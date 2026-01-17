import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ErrorMessageStrategy, DefaultErrorStrategy, strategyMap } from '../shared/strategies/error-message.strategy';
import { catchError, Observable, throwError } from 'rxjs';
import { UserProfile } from '../models/user.interface';

@Injectable({
  providedIn: 'root',
})
export class ProfileService {
  private readonly baseUrl = '/api/users';
  private readonly headers = new HttpHeaders({ 'Content-Type': 'application/json' });

  constructor(private http: HttpClient) {}

  /**
   * Get user profile by ID
   */
  getUserProfile(userId: string): Observable<UserProfile> {
    return this.http.get<UserProfile>(`${this.baseUrl}/${userId}`);
  }

  /**
   * Update user profile and return the updated profile
   */
  updateUserProfile(userId: string, updatedData: Partial<UserProfile>): Observable<UserProfile> {
    return this.http.patch<UserProfile>(
      `${this.baseUrl}/${userId}`,
      updatedData,
      { headers: this.headers }
    ).pipe(
      catchError((error: HttpErrorResponse) => {
        console.error('Profile update error:', error);
        let errorMessage = 'Une erreur inconnue est survenue.';

        if (error.error instanceof ErrorEvent) {
          errorMessage = `Erreur client : ${error.error.message}`;
        } else {
          const strategy: ErrorMessageStrategy =
            strategyMap.get(error.status) || new DefaultErrorStrategy();
          errorMessage = strategy.getMessage(error);
        }

        return throwError(() => new Error(errorMessage));
      })
    );
  }
}
