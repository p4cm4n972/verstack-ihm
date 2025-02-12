import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ProfileService {
  private baseUrl = 'users';
  constructor(private http: HttpClient) {}
  getUserProfile(userId: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/${userId}`);
  }

  updateUserProfile(userId: string, updatedData: any): Observable<any> {
    console.log(updatedData);
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

    return this.http.patch(`${this.baseUrl}/${userId}`, updatedData).pipe(
      tap((response) => {
        if (response) {
          console.log(response);
        }
      })
    );
  }
}
