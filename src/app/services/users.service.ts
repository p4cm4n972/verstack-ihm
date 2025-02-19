import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UsersService {
  private baseUrl = 'api/users';

  constructor(private http: HttpClient) { }

  update(userId: any, updatedData: any[]): Observable<any> {
    const formData = new FormData();
    for (const key in updatedData) {
      if (updatedData[key] !== null && key !== 'favoris') {
        formData.append(key, updatedData[key]);
      }
    }
    return this.http.patch(`${this.baseUrl}/${userId}`, {"favoris": [...updatedData]},  {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
    });
  }
}