import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { Chart, ChartItem, ChartOptions, ChartType, registerables } from 'chart.js';

Chart.register(...registerables);


@Component({
  selector: 'app-chart',
  imports: [],
  templateUrl: './chart.component.html',
  styleUrl: './chart.component.scss'
})
export class ChartComponent {
  chart: Chart | undefined;
  chartItem: ChartItem = document.getElementById('languageChart') as ChartItem

  // Données du graphique
  chartColors: string[] = ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF',
    '#FF9F40', '#E67E22', '#2ECC71', '#3498DB', '#9B59B6',
    '#F1C40F', '#1ABC9C', '#E74C3C', '#8E44AD', '#2C3E50',
    '#D35400', '#7F8C8D', '#C0392B', '#27AE60', '#2980B9'];

  // Configuration de Chart.js
  chartType!: ChartType; // 'bar', 'pie', 'line', etc.
  chartOptions: ChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: true,
        position: 'top',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Popularité (%)',
        },
      },
      x: {
        title: {
          display: true,
          text: 'Année',
        },
      },
    },
  };

  labels = ['2015', '2016', '2017', '2018', '2019', '2020', '2021', '2022', '2023', '2024', '2025'];
  fullData: any[] = [];

  constructor(private http: HttpClient) {

  }

  ngOnInit(): void {
    this.loadTrendsData();
  }

  loadTrendsData(): void {
    this.http.get('json/popularity-trends.json').subscribe((trends: any) => {
      this.fullData = trends;
      this.updateChart('animation'); // Charge par défaut l'animation
    });
  }


  updateChart(filter: string): void {
    const chartType = filter === 'animation' ? 'line' : 'bar';

    let datasets: any[];
    let labels: string[];

    if (filter === 'animation') {
      // Animation : Un dataset par langage avec toutes les années
      datasets = this.fullData.map((language) => ({
        label: language.name,
        data: language.popularity,
        borderColor: this.getDistinctColor(),
        borderWidth: 2,
        tension: 0.3,
        fill: false,
      }));
      labels = this.labels; // Années pour l'axe X
    } else {
      // Année spécifique : Un seul dataset contenant tous les langages
      const yearIndex = this.labels.indexOf(filter);
      datasets = [
        {
          label: `Popularité des langages en ${filter}`,
          data: this.fullData.map((language) => language.popularity[yearIndex]),
          backgroundColor: this.fullData.map(() => this.getDistinctColor()),
        },
      ];
      labels = this.fullData.map((language) => language.name); // Langages pour l'axe X
    }

    // Détruire l'ancien graphique avant de recréer
    if (this.chart) this.chart.destroy();

    // Sources utilisées pour les données
  const sources = [
    "Source 1: TIOBE Index - https://www.tiobe.com/tiobe-index/",
    "Source 2: Stack Overflow Developer Survey 2025 - https://insights.stackoverflow.com/survey",
    "Source 3: GitHub Octoverse 2025 - https://octoverse.github.com/"
  ];

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

    // Ajouter une section de sources en bas du graphique
  this.addSourcesToPage(sources);
  }

  onYearChange(event: Event): void {
    const filter = (event.target as HTMLSelectElement).value;
    this.updateChart(filter);
  }

  private colorPalette: string[] = [
    '#FF5733', '#33FF57', '#3357FF', '#FF33A1', '#A133FF', '#FF9133',
    '#33FFF4', '#F4FF33', '#FF3385', '#FF8533', '#33FF8F', '#8F33FF',
    '#F4A533', '#33F4A5', '#A533F4', '#F433FF', '#33FF9E', '#9E33FF', 
    '#FF33E0', '#33E0FF'
  ];
  
  private colorIndex: number = 0;
  
  getDistinctColor(): string {
    const color = this.colorPalette[this.colorIndex];
    this.colorIndex = (this.colorIndex + 1) % this.colorPalette.length; // Recycle si on atteint la fin
    return color;
  }
  
  resetColors(): void {
    this.colorIndex = 0; // Réinitialisation de l'index
  }

  // Fonction pour afficher les sources en dessous du graphique
addSourcesToPage(sources: string[]): void {
  const sourcesContainer = document.getElementById('sources-container');
  const regex = /https:\/\/([^ ]+)/g;
  if (sourcesContainer) {
    sourcesContainer.innerHTML = '<em>Sources utilisées :</em>' + sources.map(source => {  return`<p><a href='${source.match(regex)} ' target=_blank>${source}</a></p>`; }).join('');
  
  }
}

}
