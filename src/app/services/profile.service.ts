import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ErrorMessageStrategy, DefaultErrorStrategy, strategyMap } from '../shared/strategies/error-message.strategy';
import { catchError, Observable, tap, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ProfileService {
  private baseUrl = 'api/users';
  private header = new HttpHeaders({ 'content-type': 'application/json' });
  

  
  constructor(private http: HttpClient) {}
  getUserProfile(userId: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/${userId}`);
  }

  updateUserProfile(userId: string, updatedData: any): Observable<any> {
    const formData = new FormData();
    
    // Ajouter les champs texte
    for (const key in updatedData) {
      if (updatedData[key] !== null && key !== 'profilePicture') {
        formData.append(key, updatedData[key]);
      }
    }
    
    // Ajouter la photo de profil si présente
    if (updatedData.profilePicture) {
      formData.append('profilePicture', updatedData.profilePicture);
    }
    
    return this.http.patch<any | any[]>(`${this.baseUrl}/${userId}`, updatedData, {headers: this.header}).pipe(
      tap((response) => {
        if (response) {
          console.log(response);
        }
      }),
      catchError((error: HttpErrorResponse) => {
        console.error('erreur');
        let errorMessage = 'Une erreur inconnue est survenue.';

        if (error.error instanceof ErrorEvent) {
          errorMessage = `Erreur client : ${error.error.message}`;
        } else {
          const strategy: ErrorMessageStrategy =
            strategyMap.get(error.status) || new DefaultErrorStrategy();
          errorMessage = strategy.getMessage(error);
        }

        alert(errorMessage);
        return throwError(() => new Error(errorMessage));
      })
      
    );
  }
}
