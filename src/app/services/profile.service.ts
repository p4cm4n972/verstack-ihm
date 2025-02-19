import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
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
    
    console.log(userId, updatedData);
    return this.http.patch<any | any[]>(`${this.baseUrl}/${userId}`, updatedData, {headers: this.header}).pipe(
      tap((response) => {
        if (response) {
          console.log(response);
        }
      }),
      catchError((error: HttpErrorResponse) => {
        console.error('erreur')
        let errorMessage = 'Une erreur inconnue est survenue.';
    
    if (error.error instanceof ErrorEvent) {
      // Erreur côté client
      errorMessage = `Erreur client : ${error.error.message}`;
    } else {
      // Erreur côté serveur
      switch (error.status) {
        case 400:
          errorMessage = 'Requête invalide. Vérifiez les données envoyées.';
          break;
        case 401:
          errorMessage = 'Non autorisé. Veuillez vous connecter.';
          break;
        case 403:
          errorMessage = 'Accès refusé.';
          break;
        case 404:
          errorMessage = "Utilisateur introuvable.";
          break;
        case 500:
          errorMessage = 'Erreur serveur. Veuillez réessayer plus tard.';
          break;
        default:
          errorMessage = `Erreur ${error.status}: ${error.message}`;
      }
    }

    // Affichage d'une alerte ou d'un message d'erreur dans l'UI
    alert(errorMessage);

    return throwError(() => new Error(errorMessage));
      })
      
    );
  }
}
