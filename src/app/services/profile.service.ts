import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {
  private baseUrl = 'api/users';
  constructor(private http: HttpClient) { }
  getUserProfile(userId: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/${userId}`);
  }

  updateUserProfile(userId: string, userData: any): Observable<any> {
    return this.http.patch(`${this.baseUrl}/${userId}`, userData);
  }

}
