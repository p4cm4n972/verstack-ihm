import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class LangagesService {

  private apiLangagesUrl = 'api/langages/all';

  constructor(private http: HttpClient) { }

  getAllLangages(): Observable<any[]> {
    return this.http.get<any[]>(this.apiLangagesUrl);
  }
}
