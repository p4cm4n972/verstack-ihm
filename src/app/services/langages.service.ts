import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { map, Observable, of } from 'rxjs';
import { isPlatformServer } from '@angular/common';

@Injectable({
  providedIn: 'root'
})

export class LangagesService {

  private apiLangagesUrl = 'api/langages';

  constructor(private http: HttpClient, @Inject(PLATFORM_ID) private platformId: Object) { }

  getAllLangages(): Observable<any[]> {
    if (isPlatformServer(this.platformId)) {
      return of([]);
    }
    return this.http.get<any[]>(`${this.apiLangagesUrl}/all`).pipe(
      map((langages: any) => {
        return langages.sort((a: any, b: any) => (b.recommendations ?? 0) - (a.recommendations ?? 0));
      })
    );
  }

  createLangage(data: any): Observable<any> {
    return this.http.post(this.apiLangagesUrl, data, {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    });
  }

  deleteLangage(id: string): Observable<any> {
    return this.http.delete(`${this.apiLangagesUrl}/${id}`);
  }

  updateLangage(id: string, data: any): Observable<any> {
    return this.http.patch(`${this.apiLangagesUrl}/${id}`, data, {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    });
  }
}
