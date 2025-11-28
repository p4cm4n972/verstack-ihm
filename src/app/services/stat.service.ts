import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, shareReplay, tap } from 'rxjs/operators';
import { PopularityTrend, TrendsResponse, TrendsFilterParams } from '../models/popularity-trend.model';

@Injectable({
  providedIn: 'root'
})
export class StatService {
  private apiBaseUrl = 'http://localhost:3000/api/stats'; // Backend API URL
  private trendsCache: TrendsResponse | null = null;
  private trends$: Observable<TrendsResponse> | null = null;

  constructor(private http: HttpClient) {}

  /**
   * Récupère les données de tendances de popularité depuis l'API
   * Utilise un cache et shareReplay pour éviter les requêtes multiples
   */
  getTrends(): Observable<TrendsResponse> {
    // Retourner depuis le cache si disponible
    if (this.trendsCache) {
      return of(this.trendsCache);
    }

    // Retourner l'observable existant si une requête est en cours
    if (this.trends$) {
      return this.trends$;
    }

    // Nouvelle requête
    this.trends$ = this.http.get<TrendsResponse>(`${this.apiBaseUrl}/trends`).pipe(
      tap(response => {
        this.trendsCache = response;
      }),
      catchError(error => {
        console.error('Erreur lors du chargement des tendances:', error);
        // Fallback sur les données JSON si l'API échoue
        return this.getFallbackTrends();
      }),
      shareReplay(1)
    );

    return this.trends$;
  }

  /**
   * Récupère les tendances filtrées par année
   */
  getTrendsByYear(year: string): Observable<PopularityTrend[]> {
    return this.http.get<PopularityTrend[]>(
      `${this.apiBaseUrl}/trends/by-year/${year}`
    ).pipe(
      catchError(error => {
        console.error(`Erreur lors du chargement des tendances pour ${year}:`, error);
        return of([]);
      })
    );
  }

  /**
   * Récupère les tendances pour un langage spécifique
   */
  getTrendsByLanguage(language: string): Observable<PopularityTrend> {
    return this.http.get<PopularityTrend>(
      `${this.apiBaseUrl}/trends/language/${language}`
    ).pipe(
      catchError(error => {
        console.error(`Erreur lors du chargement des tendances pour ${language}:`, error);
        return of({ name: language, popularity: [] });
      })
    );
  }

  /**
   * Récupère les tendances avec filtres
   */
  getTrendsFiltered(params: TrendsFilterParams): Observable<TrendsResponse> {
    const queryParams = new URLSearchParams();
    
    if (params.year) queryParams.append('year', params.year);
    if (params.language) queryParams.append('language', params.language);
    if (params.limit) queryParams.append('limit', params.limit.toString());
    if (params.sort) queryParams.append('sort', params.sort);

    return this.http.get<TrendsResponse>(
      `${this.apiBaseUrl}/trends?${queryParams.toString()}`
    ).pipe(
      catchError(error => {
        console.error('Erreur lors du chargement des tendances filtrées:', error);
        return this.getFallbackTrends();
      })
    );
  }

  /**
   * Fallback vers les données JSON statiques si l'API est indisponible
   */
  private getFallbackTrends(): Observable<TrendsResponse> {
    return this.http.get<TrendsResponse>('json/popularity-trends.json').pipe(
      tap(response => {
        // Transformer le format JSON en TrendsResponse
        const trends = Array.isArray(response) ? response : response.data || [];
        this.trendsCache = {
          data: trends as PopularityTrend[],
          years: ['2015', '2016', '2017', '2018', '2019', '2020', '2021', '2022', '2023', '2024', '2025'],
          metadata: {
            sources: [
              'Source 1: TIOBE Index - https://www.tiobe.com/tiobe-index/',
              'Source 2: Stack Overflow Developer Survey 2025 - https://insights.stackoverflow.com/survey',
              'Source 3: GitHub Octoverse 2025 - https://octoverse.github.com/'
            ],
            lastUpdated: new Date().toISOString()
          }
        };
        return this.trendsCache!;
      }),
      catchError(error => {
        console.error('Erreur fallback:', error);
        throw new Error('Impossible de charger les données de tendances');
      })
    );
  }

  /**
   * Efface le cache (utile pour forcer un refresh)
   */
  clearCache(): void {
    this.trendsCache = null;
    this.trends$ = null;
  }
}
