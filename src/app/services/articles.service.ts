import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

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
  
  constructor(private http: HttpClient) { }

  getArticles(): Observable<Article[]> {
    return this.http.get<Article[]>(`${this.apiUrl}/all`);
  }

  getArticleById(id: string): Observable<Article> {
    return this.http.get<Article>(`${this.apiUrl}/${id}`);
  }
}
