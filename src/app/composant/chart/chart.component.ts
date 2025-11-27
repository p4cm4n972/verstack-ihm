import { Component, Inject, PLATFORM_ID, OnInit, OnDestroy } from '@angular/core';
import { isPlatformBrowser, DOCUMENT } from '@angular/common';
import { Chart, ChartType, registerables } from 'chart.js';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { TrendsAggregationService } from '../../services/trends-aggregation.service';
import { PopularityTrend, TrendsResponse } from '../../models/popularity-trend.model';

Chart.register(...registerables);

@Component({
  selector: 'app-chart',
  imports: [],
  templateUrl: './chart.component.html',
  styleUrl: './chart.component.scss'
})
export class ChartComponent implements OnInit, OnDestroy {
  chart: Chart | undefined;
  isLoading = true;
  error: string | null = null;

  // Données du graphique
  fullData: PopularityTrend[] = [];
  years: string[] = [];
  sources: string[] = [];

  private colorPalette: string[] = [
    '#FF5733', '#33FF57', '#3357FF', '#FF33A1', '#A133FF', '#FF9133',
    '#33FFF4', '#F4FF33', '#FF3385', '#FF8533', '#33FF8F', '#8F33FF',
    '#F4A533', '#33F4A5', '#A533F4', '#F433FF', '#33FF9E', '#9E33FF',
    '#FF33E0', '#33E0FF'
  ];
  private colorIndex: number = 0;
  private destroy$ = new Subject<void>();

  constructor(
    private trendsAggregationService: TrendsAggregationService,
    @Inject(PLATFORM_ID) private platformId: object,
    @Inject(DOCUMENT) private document: Document
  ) {}

  ngOnInit(): void {
    this.loadTrendsData();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    if (this.chart) {
      this.chart.destroy();
    }
  }

  /**
   * Charge les données de tendances via l'API
   */
  loadTrendsData(): void {
    this.isLoading = true;
    this.error = null;

    this.trendsAggregationService.getEnrichedTrends()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response: TrendsResponse) => {
          this.fullData = response.data;
          this.years = response.years;
          this.sources = response.metadata?.sources || [];
          this.isLoading = false;
          this.updateChart('animation'); // Charge par défaut le graphique d'animation
        },
        error: (err: unknown) => {
          console.error('Erreur lors du chargement des données:', err);
          this.error = 'Impossible de charger les données de tendances. Veuillez réessayer.';
          this.isLoading = false;
        }
      });
  }

  /**
   * Met à jour le graphique selon le filtre sélectionné
   */
  updateChart(filter: string): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    if (!this.fullData || this.fullData.length === 0) {
      console.warn('Aucune donnée disponible pour créer le graphique');
      return;
    }

    this.resetColors();
    const chartType = filter === 'animation' ? 'line' : 'bar';

    let datasets: any[];
    let labels: string[];

    if (filter === 'animation') {
      // Mode animation : Un dataset par langage avec toutes les années
      datasets = this.fullData.map((language) => ({
        label: language.name,
        data: language.popularity,
        borderColor: this.getDistinctColor(),
        borderWidth: 2,
        tension: 0.3,
        fill: false,
      }));
      labels = this.years;
    } else {
      // Mode année spécifique : Un seul dataset avec tous les langages
      const yearIndex = this.years.indexOf(filter);
      if (yearIndex === -1) {
        console.warn(`Année ${filter} non trouvée`);
        return;
      }

      datasets = [
        {
          label: `Popularité des langages en ${filter}`,
          data: this.fullData.map((language) => language.popularity[yearIndex]),
          backgroundColor: this.fullData.map(() => this.getDistinctColor()),
        },
      ];
      labels = this.fullData.map((language) => language.name);
    }

    // Détruire l'ancien graphique avant de recréer
    if (this.chart) {
      this.chart.destroy();
    }

    this.chart = new Chart('languageChart', {
      type: chartType as ChartType,
      data: {
        labels: labels,
        datasets: datasets,
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            display: true,
            position: 'top',
          },
        },
        scales: {
          x: {
            type: 'category',
            title: {
              display: true,
              text: filter === 'animation' ? 'Années' : 'Langages',
            },
            ticks: {
              autoSkip: false,
            },
          },
          y: {
            beginAtZero: true,
            title: {
              display: true,
              text: 'Popularité (%)',
            },
          },
        },
      },
    });

    this.addSourcesToPage(this.sources);
  }

  /**
   * Gère le changement d'année/filtre
   */
  onYearChange(event: Event): void {
    const filter = (event.target as HTMLSelectElement).value;
    this.updateChart(filter);
  }

  /**
   * Retourne la prochaine couleur distincte de la palette
   */
  private getDistinctColor(): string {
    const color = this.colorPalette[this.colorIndex];
    this.colorIndex = (this.colorIndex + 1) % this.colorPalette.length;
    return color;
  }

  /**
   * Réinitialise l'index de couleur
   */
  private resetColors(): void {
    this.colorIndex = 0;
  }

  /**
   * Affiche les sources en dessous du graphique
   */
  private addSourcesToPage(sources: string[]): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    const sourcesContainer = this.document.getElementById('sources-container');
    if (!sourcesContainer || !sources || sources.length === 0) {
      return;
    }

    const regex = /https:\/\/([^ ]+)/g;
    sourcesContainer.innerHTML =
      '<em>Sources utilisées :</em>' +
      sources
        .map((source) => {
          const urlMatch = source.match(regex);
          const url = urlMatch ? urlMatch[0] : '#';
          return `<p><a href='${url}' target='_blank' rel='noopener'>${source}</a></p>`;
        })
        .join('');
  }

  /**
   * Forcer un refresh des données (efface le cache du service)
   */
  refreshData(): void {
    this.trendsAggregationService.clearCache();
    this.loadTrendsData();
  }
}
