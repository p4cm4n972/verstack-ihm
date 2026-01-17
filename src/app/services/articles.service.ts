import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface Article {
  _id: string;
  title: string;
  content: string;
  excerpt?: string;
  description?: string;
  category: string;
  date: string;
  updatedAt?: string;
  img?: string;
  recommendations?: number;
  recommendedBy?: string[];  // IDs des utilisateurs ayant recommandé l'article
  framework?: string;
  image?: string;
}

@Injectable({
  providedIn: 'root'
})
export class ArticlesService {

  private apiUrl = '/api/news';
  
  constructor(private http: HttpClient) { }

  getArticles(): Observable<Article[]> {
    return this.http.get<Article[]>(`${this.apiUrl}/all`);
  }

  getArticleById(id: string): Observable<Article> {
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

  recommendArticle(id: string, userId: string) {
    return this.http.post<{ recommendations: number }>(
      `/api/news/${id}/recommend`,
      { userId }
    );
  }

  unrecommendArticle(id: string, userId: string) {
    return this.http.post<{ recommendations: number }>(
      `/api/news/${id}/unrecommend`,
      { userId }
    );
  }
}
