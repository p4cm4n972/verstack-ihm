import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, forkJoin, of } from 'rxjs';
import { map, catchError, shareReplay, tap } from 'rxjs/operators';
import {
  StackOverflowResponse,
  StackOverflowTag,
  TIOBEIndexResponse,
  TIOBEEntry,
  GitHubOctoVerseResponse,
  AggregatedPopularity
} from '../models/external-api.model';

/**
 * Service pour récupérer les données de popularité depuis les APIs externes
 * Intègre : Stack Overflow, TIOBE Index, GitHub Octoverse, Google Trends
 */
@Injectable({
  providedIn: 'root'
})
export class ExternalDataSourceService {
  
  // URLs des APIs
  private readonly STACKOVERFLOW_API = 'https://api.stackexchange.com/2.3/tags';
  private readonly TIOBE_API = 'https://www.tiobe.com/api/tiobe/api.php'; // Public API
  private readonly GITHUB_API = 'https://api.github.com';

  // Cache
  private stackOverflowCache: Map<string, any> = new Map();
  private tiobeCache: any = null;
  private githubCache: any = null;

  constructor(private http: HttpClient) {}

  /**
   * Récupère les tags populaires depuis Stack Overflow
   * https://api.stackexchange.com/docs/tags
   */
  getStackOverflowTrends(): Observable<Map<string, number>> {
    const cacheKey = 'so-trends';
    
    if (this.stackOverflowCache.has(cacheKey)) {
      return of(this.stackOverflowCache.get(cacheKey));
    }

    let params = new HttpParams()
      .set('order', 'desc')
      .set('sort', 'popular')
      .set('site', 'stackoverflow')
      .set('pagesize', '100');

    return this.http.get<StackOverflowResponse>(this.STACKOVERFLOW_API, { params })
      .pipe(
        map(response => {
          // Normaliser les données Stack Overflow (0-100)
          const maxCount = Math.max(...response.items.map(item => item.count));
          const tagScores = new Map<string, number>();

          response.items.forEach(tag => {
            const normalized = (tag.count / maxCount) * 100;
            tagScores.set(tag.name.toLowerCase(), normalized);
          });

          this.stackOverflowCache.set(cacheKey, tagScores);
          return tagScores;
        }),
        catchError(error => {
          console.error('Erreur Stack Overflow API:', error);
          return of(new Map()); // Retourner une map vide en cas d'erreur
        }),
        shareReplay(1)
      );
  }

  /**
   * Récupère l'index TIOBE
   * Note: TIOBE n'a pas d'API publique libre. 
   * Alternative: web scraping ou utilisation de données manuelles
   */
  getTIOBETrends(): Observable<Map<string, number>> {
    // Données TIOBE simulées (novembre 2024)
    // Source: https://www.tiobe.com/tiobe-index/
    const tiobeData: TIOBEEntry[] = [
      { rank: 1, name: 'Python', rating: 14.54, change: '+2.41%' },
      { rank: 2, name: 'C', rating: 11.36, change: '+1.26%' },
      { rank: 3, name: 'Java', rating: 10.31, change: '+0.76%' },
      { rank: 4, name: 'C++', rating: 8.88, change: '-0.11%' },
      { rank: 5, name: 'C#', rating: 7.63, change: '+0.23%' },
      { rank: 6, name: 'JavaScript', rating: 2.56, change: '+0.11%' },
      { rank: 7, name: 'Go', rating: 2.15, change: '+0.16%' },
      { rank: 8, name: 'SQL', rating: 2.15, change: '+0.16%' },
      { rank: 9, name: 'Rust', rating: 1.89, change: '+0.16%' },
      { rank: 10, name: 'PHP', rating: 1.56, change: '-0.11%' },
    ];

    // Normaliser les ratings TIOBE (0-100)
    const maxRating = 14.54; // Python
    const tiobeScores = new Map<string, number>();

    tiobeData.forEach(entry => {
      const normalized = (entry.rating / maxRating) * 100;
      tiobeScores.set(entry.name.toLowerCase(), normalized);
    });

    return of(tiobeScores).pipe(
      tap(data => this.tiobeCache = data),
      catchError(error => {
        console.error('Erreur TIOBE:', error);
        return of(new Map());
      }),
      shareReplay(1)
    );
  }

  /**
   * Récupère les données du GitHub Octoverse
   * Note: GitHub n'expose pas d'API directe pour Octoverse
   * Alternative: web scraping ou données manuelles
   */
  getGitHubTrends(): Observable<Map<string, number>> {
    // Données GitHub Octoverse 2024 simulées
    // Source: https://octoverse.github.com/
    const githubLanguages = [
      { language: 'Python', pullRequests: 450000, percentage: 13.5 },
      { language: 'JavaScript', pullRequests: 420000, percentage: 12.8 },
      { language: 'TypeScript', pullRequests: 380000, percentage: 11.5 },
      { language: 'Java', pullRequests: 320000, percentage: 9.7 },
      { language: 'Go', pullRequests: 280000, percentage: 8.5 },
      { language: 'Rust', pullRequests: 260000, percentage: 7.9 },
      { language: 'C++', pullRequests: 240000, percentage: 7.3 },
      { language: 'C#', pullRequests: 220000, percentage: 6.7 },
      { language: 'PHP', pullRequests: 180000, percentage: 5.5 },
      { language: 'Ruby', pullRequests: 150000, percentage: 4.5 },
    ];

    const githubScores = new Map<string, number>();
    
    githubLanguages.forEach(lang => {
      githubScores.set(lang.language.toLowerCase(), lang.percentage * 10); // Convertir en 0-100
    });

    return of(githubScores).pipe(
      tap(data => this.githubCache = data),
      catchError(error => {
        console.error('Erreur GitHub:', error);
        return of(new Map());
      }),
      shareReplay(1)
    );
  }

  /**
   * Agrège les données de toutes les sources
   */
  getAggregatedPopularity(languages: string[]): Observable<AggregatedPopularity[]> {
    return forkJoin([
      this.getStackOverflowTrends(),
      this.getTIOBETrends(),
      this.getGitHubTrends()
    ]).pipe(
      map(([soScores, tiobeScores, githubScores]) => {
        return languages.map(lang => {
          const langLower = lang.toLowerCase();
          
          const soScore = soScores.get(langLower) || 0;
          const tiobeScore = tiobeScores.get(langLower) || 0;
          const githubScore = githubScores.get(langLower) || 0;

          // Moyenne pondérée (poids: 30% SO, 40% TIOBE, 30% GitHub)
          const average = (soScore * 0.3 + tiobeScore * 0.4 + githubScore * 0.3);

          // Déterminer la tendance (simplifié)
          const trend = tiobeScore > 50 ? 'up' : tiobeScore > 30 ? 'stable' : 'down';

          return {
            language: lang,
            sources: {
              stackoverflow: Math.round(soScore),
              tiobe: Math.round(tiobeScore),
              github: Math.round(githubScore)
            },
            average: Math.round(average),
            trend: trend as 'up' | 'down' | 'stable',
            lastUpdated: new Date()
          };
        });
      }),
      catchError(error => {
        console.error('Erreur agrégation:', error);
        return of([]);
      }),
      shareReplay(1)
    );
  }

  /**
   * Récupère les données historiques (pour les graphiques de tendance)
   * Note: Nécessite une base de données pour stocker les données historiques
   */
  getHistoricalTrends(language: string, years: number = 10): Observable<number[]> {
    // Données simulées pour démonstration
    // En production, récupérer depuis une base de données
    const simulatedData: Map<string, number[]> = new Map([
      ['python', [5.0, 6.0, 7.5, 9.0, 10.5, 12.0, 13.5, 14.8, 15.6, 16.0, 16.3]],
      ['javascript', [12.5, 13.0, 13.5, 14.0, 14.5, 14.8, 15.0, 15.2, 15.4, 15.6, 15.7]],
      ['java', [16.0, 15.8, 15.5, 15.0, 14.8, 14.5, 14.3, 14.0, 13.9, 13.8, 13.7]],
      ['go', [0.5, 1.0, 1.5, 2.0, 3.0, 4.0, 5.0, 5.5, 6.0, 6.5, 7.0]],
      ['rust', [0.0, 0.5, 1.0, 1.5, 2.0, 2.5, 3.0, 3.5, 4.0, 4.5, 5.0]],
      ['typescript', [0.5, 1.0, 1.5, 2.0, 3.0, 4.5, 5.5, 6.5, 7.0, 7.5, 8.0]],
      ['c#', [8.0, 8.2, 8.5, 8.7, 8.9, 9.0, 9.1, 9.2, 9.3, 9.4, 9.5]],
      ['c++', [7.5, 7.6, 7.8, 8.0, 8.2, 8.4, 8.5, 8.6, 8.7, 8.8, 8.9]],
      ['php', [9.0, 8.8, 8.6, 8.5, 8.4, 8.3, 8.2, 8.1, 8.0, 7.9, 7.8]],
      ['r', [4.0, 4.5, 5.0, 5.5, 6.0, 6.5, 7.0, 7.5, 8.0, 8.5, 8.6]],
    ]);

    return of(simulatedData.get(language.toLowerCase()) || []).pipe(
      catchError(error => {
        console.error('Erreur récupération tendances historiques:', error);
        return of([]);
      })
    );
  }

  /**
   * Efface tous les caches
   */
  clearCache(): void {
    this.stackOverflowCache.clear();
    this.tiobeCache = null;
    this.githubCache = null;
  }
}
