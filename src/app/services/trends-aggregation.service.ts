import { Injectable } from '@angular/core';
import { Observable, forkJoin } from 'rxjs';
import { map, tap, shareReplay } from 'rxjs/operators';
import { ExternalDataSourceService } from './external-data-source.service';
import { PopularityTrend, TrendsResponse } from '../models/popularity-trend.model';

/**
 * Service pour agréger et enrichir les données de popularité
 * Combine les données externes + historique + enrichissement
 */
@Injectable({
  providedIn: 'root'
})
export class TrendsAggregationService {

  private readonly SUPPORTED_LANGUAGES = [
    'Python', 'JavaScript', 'Java', 'C++', 'C#', 
    'Go', 'Rust', 'TypeScript', 'PHP', 'R',
    'C', 'Swift', 'Kotlin', 'Ruby', 'Scala',
    'Dart', 'MATLAB', 'Shell', 'Objective-C', 'Perl'
  ];

  private years = ['2015', '2016', '2017', '2018', '2019', '2020', '2021', '2022', '2023', '2024', '2025'];
  private aggregatedCache: TrendsResponse | null = null;
  private lastUpdate: Date | null = null;
  private cacheDuration = 3600000; // 1 heure

  constructor(private externalDataService: ExternalDataSourceService) {}

  /**
   * Récupère les tendances enrichies depuis toutes les sources
   */
  getEnrichedTrends(): Observable<TrendsResponse> {
    // Retourner le cache si valide
    if (this.aggregatedCache && this.lastUpdate && 
        (Date.now() - this.lastUpdate.getTime()) < this.cacheDuration) {
      return new Observable(observer => {
        observer.next(this.aggregatedCache!);
        observer.complete();
      });
    }

    return forkJoin([
      this.externalDataService.getAggregatedPopularity(this.SUPPORTED_LANGUAGES),
      this.getHistoricalTrendsForAllLanguages()
    ]).pipe(
      map(([currentData, historicalData]) => {
        const enrichedData: PopularityTrend[] = this.SUPPORTED_LANGUAGES.map(language => {
          const current = currentData.find(d => d.language === language);
          const history = historicalData.get(language.toLowerCase()) || [];

          return {
            name: language,
            popularity: history.length > 0 ? history : this.getDefaultPopularity(language),
            metadata: {
              color: this.getLanguageColor(language),
              category: this.getLanguageCategory(language),
              // Inclure les scores détaillés
              ...current?.sources && { scoreDetails: current.sources }
            }
          };
        });

        const response: TrendsResponse = {
          data: enrichedData,
          years: this.years,
          metadata: {
            sources: [
              'Stack Overflow API - https://api.stackexchange.com/docs/tags',
              'TIOBE Index - https://www.tiobe.com/tiobe-index/',
              'GitHub Octoverse - https://octoverse.github.com/',
              'Verstack Database - Internal historical data'
            ],
            lastUpdated: new Date().toISOString()
          }
        };

        this.aggregatedCache = response;
        this.lastUpdate = new Date();
        return response;
      }),
      shareReplay(1)
    );
  }

  /**
   * Récupère les tendances historiques pour tous les langages
   */
  private getHistoricalTrendsForAllLanguages(): Observable<Map<string, number[]>> {
    const requests = this.SUPPORTED_LANGUAGES.map(lang =>
      this.externalDataService.getHistoricalTrends(lang).pipe(
        map(data => [lang.toLowerCase(), data] as [string, number[]])
      )
    );

    return forkJoin(requests).pipe(
      map(results => new Map(results))
    );
  }

  /**
   * Récupère la popularité par défaut d'un langage
   */
  private getDefaultPopularity(language: string): number[] {
    const defaults: Map<string, number[]> = new Map([
      ['Python', [5.0, 6.0, 7.5, 9.0, 10.5, 12.0, 13.5, 14.8, 15.6, 16.0, 16.3]],
      ['JavaScript', [12.5, 13.0, 13.5, 14.0, 14.5, 14.8, 15.0, 15.2, 15.4, 15.6, 15.7]],
      ['Java', [16.0, 15.8, 15.5, 15.0, 14.8, 14.5, 14.3, 14.0, 13.9, 13.8, 13.7]],
      ['C++', [7.5, 7.6, 7.8, 8.0, 8.2, 8.4, 8.5, 8.6, 8.7, 8.8, 8.9]],
      ['C#', [8.0, 8.2, 8.5, 8.7, 8.9, 9.0, 9.1, 9.2, 9.3, 9.4, 9.5]],
      ['Go', [0.5, 1.0, 1.5, 2.0, 3.0, 4.0, 5.0, 5.5, 6.0, 6.5, 7.0]],
      ['Rust', [0.0, 0.5, 1.0, 1.5, 2.0, 2.5, 3.0, 3.5, 4.0, 4.5, 5.0]],
      ['TypeScript', [0.5, 1.0, 1.5, 2.0, 3.0, 4.5, 5.5, 6.5, 7.0, 7.5, 8.0]],
      ['PHP', [9.0, 8.8, 8.6, 8.5, 8.4, 8.3, 8.2, 8.1, 8.0, 7.9, 7.8]],
      ['R', [4.0, 4.5, 5.0, 5.5, 6.0, 6.5, 7.0, 7.5, 8.0, 8.5, 8.6]],
    ]);

    return defaults.get(language) || Array(11).fill(5);
  }

  /**
   * Récupère la couleur associée à un langage
   */
  private getLanguageColor(language: string): string {
    const colors: Map<string, string> = new Map([
      ['Python', '#3776ab'],
      ['JavaScript', '#f7df1e'],
      ['Java', '#007396'],
      ['C++', '#00599c'],
      ['C#', '#239120'],
      ['Go', '#00add8'],
      ['Rust', '#ce422b'],
      ['TypeScript', '#3178c6'],
      ['PHP', '#777bb4'],
      ['R', '#276dc3'],
      ['C', '#a8b9cc'],
      ['Swift', '#fa7343'],
      ['Kotlin', '#7f52ff'],
      ['Ruby', '#cc342d'],
      ['Scala', '#dc322f'],
      ['Dart', '#01a14e'],
      ['MATLAB', '#0076a8'],
      ['Shell', '#4eaa25'],
      ['Objective-C', '#438eff'],
      ['Perl', '#0673a5'],
    ]);

    return colors.get(language) || '#cccccc';
  }

  /**
   * Récupère la catégorie d'un langage
   */
  private getLanguageCategory(language: string): string {
    const categories: Map<string, string> = new Map([
      ['Python', 'General Purpose'],
      ['JavaScript', 'Web/Frontend'],
      ['Java', 'General Purpose'],
      ['C++', 'System'],
      ['C#', 'General Purpose'],
      ['Go', 'System'],
      ['Rust', 'System'],
      ['TypeScript', 'Web/Frontend'],
      ['PHP', 'Web/Backend'],
      ['R', 'Data Science'],
      ['C', 'System'],
      ['Swift', 'Mobile'],
      ['Kotlin', 'Mobile'],
      ['Ruby', 'Web/Backend'],
      ['Scala', 'General Purpose'],
      ['Dart', 'Mobile'],
      ['MATLAB', 'Data Science'],
      ['Shell', 'Scripting'],
      ['Objective-C', 'Mobile'],
      ['Perl', 'Scripting'],
    ]);

    return categories.get(language) || 'Other';
  }

  /**
   * Force un refresh des données (efface le cache)
   */
  clearCache(): void {
    this.aggregatedCache = null;
    this.lastUpdate = null;
    this.externalDataService.clearCache();
  }
}
