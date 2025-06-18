import { HttpClient } from '@angular/common/http';
import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { Observable, of } from 'rxjs';
import { isPlatformServer } from '@angular/common';

interface Article {
  title: string;
  framework: string;
  image: string;
  excerpt: string;
}

@Injectable({
  providedIn: 'root'
})
export class ArticlesService {

  private apiUrl = 'api/news';

  constructor(private http: HttpClient, @Inject(PLATFORM_ID) private platformId: Object) { }

  getArticles(): Observable<Article[]> {
    if (isPlatformServer(this.platformId)) {
      return of([]);
    }
    return this.http.get<Article[]>(`${this.apiUrl}/all`);
  }

  getArticleById(id: string): Observable<Article> {
    if (isPlatformServer(this.platformId)) {
      return of({} as Article);
    }
    return this.http.get<Article>(`${this.apiUrl}/${id}`);
  }

  createArticle(data: any): Observable<any> {
    return this.http.post(this.apiUrl, data);
  }

  deleteArticle(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  updateArticle(id: string, data: any): Observable<any> {
    return this.http.patch(`${this.apiUrl}/${id}`, data);
  }
}
