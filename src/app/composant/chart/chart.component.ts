import { Component, Inject, PLATFORM_ID, OnInit, OnDestroy } from '@angular/core';
import { isPlatformBrowser, DOCUMENT } from '@angular/common';
import { Chart, ChartType, registerables } from 'chart.js';
import { Subject } from 'rxjs';
import { takeUntil, map } from 'rxjs/operators';
import { StatService } from '../../services/stat.service';
import { PopularityTrend, TrendsResponse, DataSource } from '../../models/popularity-trend.model';

Chart.register(...registerables);

interface SourceInfo {
  id: DataSource;
  label: string;
  description: string;
  color: string;
  enabled: boolean;
}

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

  // Filtre par source
  availableSources: SourceInfo[] = [
    {
      id: 'stackoverflow',
      label: 'Stack Overflow',
      description: 'questions tagged (live API)',
      color: '#f48024',
      enabled: true
    },
    {
      id: 'tiobe',
      label: 'TIOBE',
      description: 'search engine rankings (monthly)',
      color: '#00a86b',
      enabled: true
    },
    {
      id: 'github',
      label: 'GitHub',
      description: 'repository count (estimated)',
      color: '#6e5494',
      enabled: true
    }
  ];

  currentYearFilter = 'animation';

  private chartRetryCount = 0;
  private readonly MAX_CHART_RETRIES = 10;

  private colorPalette: string[] = [
    '#FF5733', '#33FF57', '#3357FF', '#FF33A1', '#A133FF', '#FF9133',
    '#33FFF4', '#F4FF33', '#FF3385', '#FF8533', '#33FF8F', '#8F33FF',
    '#F4A533', '#33F4A5', '#A533F4', '#F433FF', '#33FF9E', '#9E33FF',
    '#FF33E0', '#33E0FF'
  ];
  private colorIndex: number = 0;
  private destroy$ = new Subject<void>();

  constructor(
    private statService: StatService,
    @Inject(PLATFORM_ID) private platformId: object,
    @Inject(DOCUMENT) private document: Document
  ) {}

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.loadTrendsData();
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    if (this.chart) {
      this.chart.destroy();
    }
  }

  /**
   * Charge les données de tendances via l'API backend
   */
  loadTrendsData(): void {
    this.isLoading = true;
    this.error = null;

    this.statService.getTrends()
      .pipe(
        takeUntil(this.destroy$),
        map((response: any) => {
          const transformedData: PopularityTrend[] = response.data.map((item: any) => ({
            name: item.language,
            popularity: item.popularity,
            sources: item.sources,
            average: item.average,
            trend: item.trend,
            metadata: item.metadata
          }));

          return {
            data: transformedData,
            years: response.years,
            metadata: response.metadata
          } as TrendsResponse;
        })
      )
      .subscribe({
        next: (response: TrendsResponse) => {
          this.fullData = response.data;
          this.years = response.years;
          this.sources = response.metadata?.sources || [];
          this.isLoading = false;

          setTimeout(() => {
            this.updateChart(this.currentYearFilter);
          }, 0);
        },
        error: (err: unknown) => {
          console.error('Erreur lors du chargement des données:', err);
          this.error = 'connection failed: unable to fetch trends data';
          this.isLoading = false;
        }
      });
  }

  /**
   * Toggle une source
   */
  toggleSource(sourceId: DataSource): void {
    const source = this.availableSources.find(s => s.id === sourceId);
    if (source) {
      source.enabled = !source.enabled;
      this.updateChart(this.currentYearFilter);
    }
  }

  /**
   * Retourne les sources activées
   */
  getEnabledSources(): SourceInfo[] {
    return this.availableSources.filter(s => s.enabled);
  }

  /**
   * Met à jour le graphique selon le filtre sélectionné
   */
  updateChart(filter: string): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    this.currentYearFilter = filter;

    if (!this.fullData || this.fullData.length === 0) {
      console.warn('Aucune donnée disponible pour créer le graphique');
      return;
    }

    const canvasElement = this.document.getElementById('languageChart');
    if (!canvasElement) {
      if (this.chartRetryCount < this.MAX_CHART_RETRIES) {
        this.chartRetryCount++;
        setTimeout(() => this.updateChart(filter), 50);
        return;
      } else {
        this.error = 'render failed: canvas element not available';
        return;
      }
    }

    this.chartRetryCount = 0;
    this.resetColors();

    const enabledSources = this.getEnabledSources();
    const chartType: ChartType = 'bar';

    let datasets: any[];
    let labels: string[];

    if (enabledSources.length === 0) {
      // Aucune source sélectionnée - afficher message
      datasets = [];
      labels = [];
    } else {
      // Créer un dataset par source sélectionnée
      labels = this.fullData.map(lang => lang.name);

      datasets = enabledSources.map(source => ({
        label: source.label,
        data: this.fullData.map(lang => lang.sources?.[source.id] || 0),
        backgroundColor: this.adjustColorOpacity(source.color, 0.7),
        borderColor: source.color,
        borderWidth: 1,
      }));
    }

    if (this.chart) {
      this.chart.destroy();
    }

    this.chart = new Chart('languageChart', {
      type: chartType,
      data: {
        labels: labels,
        datasets: datasets,
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        interaction: {
          mode: 'index',
          intersect: false,
        },
        plugins: {
          legend: {
            display: true,
            position: 'top',
            labels: {
              padding: 15,
              font: {
                size: window.innerWidth < 768 ? 11 : 12,
                family: "'Courier New', monospace",
              },
              boxWidth: window.innerWidth < 768 ? 30 : 40,
              color: 'rgba(255, 255, 255, 0.8)',
            },
          },
          tooltip: {
            enabled: true,
            backgroundColor: 'rgba(0, 0, 0, 0.9)',
            titleFont: {
              size: window.innerWidth < 768 ? 12 : 14,
              family: "'Courier New', monospace",
            },
            bodyFont: {
              size: window.innerWidth < 768 ? 11 : 13,
              family: "'Courier New', monospace",
            },
            padding: window.innerWidth < 768 ? 8 : 12,
            callbacks: {
              label: (context) => {
                const value = context.parsed.y ?? 0;
                return `${context.dataset.label}: ${value.toFixed(1)}%`;
              }
            }
          },
        },
        scales: {
          x: {
            type: 'category',
            title: {
              display: true,
              text: 'languages',
              font: {
                size: window.innerWidth < 768 ? 12 : 14,
                weight: 'bold',
                family: "'Courier New', monospace",
              },
              color: '#00bcd4',
              padding: { top: 10 },
            },
            ticks: {
              autoSkip: window.innerWidth < 768,
              maxRotation: 45,
              minRotation: 45,
              font: {
                size: window.innerWidth < 768 ? 9 : 11,
                family: "'Courier New', monospace",
              },
              color: 'rgba(255, 255, 255, 0.7)',
            },
            grid: {
              display: false,
            },
          },
          y: {
            beginAtZero: true,
            max: 100,
            title: {
              display: true,
              text: 'score (0-100)',
              font: {
                size: window.innerWidth < 768 ? 12 : 14,
                weight: 'bold',
                family: "'Courier New', monospace",
              },
              color: '#00bcd4',
              padding: { bottom: 10 },
            },
            ticks: {
              font: {
                size: window.innerWidth < 768 ? 10 : 12,
                family: "'Courier New', monospace",
              },
              color: 'rgba(255, 255, 255, 0.7)',
            },
            grid: {
              color: 'rgba(0, 188, 212, 0.1)',
            },
          },
        },
      },
    });
  }

  /**
   * Ajuste l'opacité d'une couleur hex
   */
  private adjustColorOpacity(hexColor: string, opacity: number): string {
    const hex = hexColor.replace('#', '');
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);
    return `rgba(${r}, ${g}, ${b}, ${opacity})`;
  }

  /**
   * Gère le changement d'année/filtre
   */
  onYearChange(event: Event): void {
    const filter = (event.target as HTMLSelectElement).value;
    this.updateChart(filter);
  }

  private getDistinctColor(): string {
    const color = this.colorPalette[this.colorIndex];
    this.colorIndex = (this.colorIndex + 1) % this.colorPalette.length;
    return color;
  }

  private resetColors(): void {
    this.colorIndex = 0;
  }

  refreshData(): void {
    this.statService.clearCache();
    this.loadTrendsData();
  }
}
