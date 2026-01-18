import { Component, Inject, PLATFORM_ID, OnInit, OnDestroy } from '@angular/core';
import { isPlatformBrowser, DOCUMENT } from '@angular/common';
import { Chart, ChartType, registerables } from 'chart.js';
import { Subject } from 'rxjs';
import { takeUntil, map } from 'rxjs/operators';
import { StatService } from '../../services/stat.service';
import { PopularityTrend, TrendsResponse, DataSource } from '../../models/popularity-trend.model';

Chart.register(...registerables);

type ViewMode = 'source' | 'history';

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

  // Mode de vue
  viewMode: ViewMode = 'source';

  // Filtre par source (mode source)
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

  // Filtre par année (mode history)
  selectedYear = 'animation';

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
            this.updateChart();
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
   * Change le mode de vue
   */
  setViewMode(mode: ViewMode): void {
    this.viewMode = mode;
    this.updateChart();
  }

  /**
   * Toggle une source (mode source)
   */
  toggleSource(sourceId: DataSource): void {
    const source = this.availableSources.find(s => s.id === sourceId);
    if (source) {
      source.enabled = !source.enabled;
      this.updateChart();
    }
  }

  /**
   * Retourne les sources activées
   */
  getEnabledSources(): SourceInfo[] {
    return this.availableSources.filter(s => s.enabled);
  }

  /**
   * Change l'année sélectionnée (mode history)
   */
  onYearChange(event: Event): void {
    this.selectedYear = (event.target as HTMLSelectElement).value;
    this.updateChart();
  }

  /**
   * Met à jour le graphique selon le mode
   */
  updateChart(): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    if (!this.fullData || this.fullData.length === 0) {
      console.warn('Aucune donnée disponible pour créer le graphique');
      return;
    }

    const canvasElement = this.document.getElementById('languageChart');
    if (!canvasElement) {
      if (this.chartRetryCount < this.MAX_CHART_RETRIES) {
        this.chartRetryCount++;
        setTimeout(() => this.updateChart(), 50);
        return;
      } else {
        this.error = 'render failed: canvas element not available';
        return;
      }
    }

    this.chartRetryCount = 0;
    this.resetColors();

    if (this.chart) {
      this.chart.destroy();
    }

    if (this.viewMode === 'source') {
      this.createSourceChart();
    } else {
      this.createHistoryChart();
    }
  }

  /**
   * Crée le graphique en mode source (barres groupées par source)
   */
  private createSourceChart(): void {
    const enabledSources = this.getEnabledSources();

    let datasets: any[];
    let labels: string[];

    if (enabledSources.length === 0) {
      datasets = [];
      labels = [];
    } else {
      labels = this.fullData.map(lang => lang.name);
      datasets = enabledSources.map(source => ({
        label: source.label,
        data: this.fullData.map(lang => lang.sources?.[source.id] || 0),
        backgroundColor: this.adjustColorOpacity(source.color, 0.7),
        borderColor: source.color,
        borderWidth: 1,
      }));
    }

    this.chart = new Chart('languageChart', {
      type: 'bar',
      data: { labels, datasets },
      options: this.getChartOptions('languages', 'score (0-100)', 100)
    });
  }

  /**
   * Crée le graphique en mode historique (lignes par langage)
   */
  private createHistoryChart(): void {
    let datasets: any[];
    let labels: string[];
    let chartType: ChartType;

    if (this.selectedYear === 'animation') {
      // Mode animation : lignes avec toutes les années
      chartType = 'line';
      labels = this.years;
      datasets = this.fullData.map((language) => ({
        label: language.name,
        data: language.popularity,
        borderColor: language.metadata?.color || this.getDistinctColor(),
        backgroundColor: this.adjustColorOpacity(language.metadata?.color || this.getDistinctColor(), 0.1),
        borderWidth: 2,
        tension: 0.3,
        fill: false,
        pointRadius: 3,
        pointHoverRadius: 5,
      }));
    } else {
      // Mode année spécifique : barres
      chartType = 'bar';
      const yearIndex = this.years.indexOf(this.selectedYear);
      if (yearIndex === -1) {
        console.warn(`Année ${this.selectedYear} non trouvée`);
        return;
      }

      labels = this.fullData.map(lang => lang.name);
      datasets = [{
        label: `popularity ${this.selectedYear}`,
        data: this.fullData.map(lang => lang.popularity[yearIndex]),
        backgroundColor: this.fullData.map(lang =>
          this.adjustColorOpacity(lang.metadata?.color || this.getDistinctColor(), 0.7)
        ),
        borderColor: this.fullData.map(lang => lang.metadata?.color || this.getDistinctColor()),
        borderWidth: 1,
      }];
    }

    const xLabel = this.selectedYear === 'animation' ? 'years' : 'languages';

    this.chart = new Chart('languageChart', {
      type: chartType,
      data: { labels, datasets },
      options: this.getChartOptions(xLabel, 'popularity (%)', undefined)
    });
  }

  /**
   * Options communes du graphique
   */
  private getChartOptions(xLabel: string, yLabel: string, yMax?: number): any {
    return {
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
              size: window.innerWidth < 768 ? 10 : 12,
              family: "'Courier New', monospace",
            },
            boxWidth: window.innerWidth < 768 ? 25 : 40,
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
            label: (context: any) => {
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
            text: xLabel,
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
          max: yMax,
          title: {
            display: true,
            text: yLabel,
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
    };
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
