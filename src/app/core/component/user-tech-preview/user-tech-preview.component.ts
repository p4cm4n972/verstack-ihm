import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedMaterialModule } from '../../../shared/material.module';
import { AuthenticationService } from '../../../services/authentication.service';
import { PlatformService } from '../../services/platform.service';
import { LangagesService } from '../../../services/langages.service';
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { differenceInMonths, parseISO } from 'date-fns';

interface TechWithPopularity {
  _id: string;
  name: string;
  logoUrl: string;
  versions: any[];
  domain: string[];
  popularity?: number;
  rank?: number;
  trending?: 'up' | 'down' | 'stable';
}

@Component({
  selector: 'app-user-tech-preview',
  standalone: true,
  imports: [CommonModule, SharedMaterialModule, MatProgressSpinnerModule, MatProgressBarModule, MatTooltipModule],
  templateUrl: './user-tech-preview.component.html',
  styleUrl: './user-tech-preview.component.scss'
})
export class UserTechPreviewComponent implements OnInit {
  userFavoris: any[] = [];
  userTechnologies: TechWithPopularity[] = [];
  topThree: TechWithPopularity[] = [];
  otherTechnologies: TechWithPopularity[] = [];
  isLoading = true;

  // Simuler les données de popularité (en attendant l'API)
  private readonly popularityData: Record<string, { popularity: number; rank: number; trending: 'up' | 'down' | 'stable' }> = {
    'JavaScript': { popularity: 95, rank: 1, trending: 'stable' },
    'TypeScript': { popularity: 88, rank: 2, trending: 'up' },
    'Python': { popularity: 85, rank: 3, trending: 'up' },
    'HTML': { popularity: 92, rank: 4, trending: 'stable' },
    'CSS': { popularity: 90, rank: 5, trending: 'stable' },
    'Node.js': { popularity: 82, rank: 6, trending: 'up' },
    'Angular': { popularity: 75, rank: 7, trending: 'stable' },
    'React': { popularity: 87, rank: 8, trending: 'up' },
    'Vue.js': { popularity: 72, rank: 9, trending: 'down' },
    'MongoDB': { popularity: 68, rank: 10, trending: 'stable' },
    'C': { popularity: 65, rank: 11, trending: 'stable' },
    'Express.js': { popularity: 70, rank: 12, trending: 'stable' },
    'NestJS': { popularity: 62, rank: 13, trending: 'up' }
  };

  private readonly iconMap: Record<string, { type: string; color: string }> = {
    language: { type: 'code_blocks', color: 'icon-language' },
    framework: { type: 'home_repair_service', color: 'icon-framework' },
    tools: { type: 'construction', color: 'icon-tools' },
    database: { type: 'storage', color: 'icon-database' },
  };

  constructor(
    private authService: AuthenticationService,
    private platformService: PlatformService,
    private langagesService: LangagesService
  ) {}

  ngOnInit(): void {
    this.loadUserTechnologies();
  }

  private loadUserTechnologies(): void {
    const favoris = this.platformService.getJson('favoris', []);
    this.userFavoris = Array.isArray(favoris) ? favoris : [];

    if (this.userFavoris.length === 0) {
      this.isLoading = false;
      return;
    }

    this.langagesService.getAllLangages().subscribe({
      next: (allLangages) => {
        const favorisNames = this.userFavoris.map((f: any) => f.name);
        const filteredTechs = allLangages.filter(lang =>
          favorisNames.includes(lang.name)
        );

        // Enrichir avec les données de popularité
        this.userTechnologies = filteredTechs.map(tech => ({
          ...tech,
          popularity: this.popularityData[tech.name]?.popularity || 50,
          rank: this.popularityData[tech.name]?.rank || 999,
          trending: this.popularityData[tech.name]?.trending || 'stable'
        }));

        // Trier par popularité
        this.userTechnologies.sort((a, b) => (b.popularity || 0) - (a.popularity || 0));

        // Séparer TOP 3 et les autres
        this.topThree = this.userTechnologies.slice(0, 3);
        this.otherTechnologies = this.userTechnologies.slice(3);

        this.isLoading = false;
      },
      error: (err) => {
        console.error('Erreur lors du chargement des technologies', err);
        this.isLoading = false;
      }
    });
  }

  getDefaultLogo(techName: string): string {
    return `https://raw.githubusercontent.com/devicons/devicon/master/icons/${techName.toLowerCase()}/${techName.toLowerCase()}-original.svg`;
  }

  onImageError(event: Event): void {
    const img = event.target as HTMLImageElement;
    if (img) {
      img.src = '/assets/icons/default-tech.svg';
    }
  }

  getIconType(domain: string[]): string {
    return domain
      .map((d) => this.iconMap[d]?.type)
      .find((v) => !!v) || 'code';
  }

  getIconColor(domain: string[]): string {
    return domain
      .map((d) => this.iconMap[d]?.color)
      .find((v) => !!v) || 'icon-language';
  }

  // Fonctions pour le système de couleurs selon le support
  private getMonthsLeft(releaseDate: string, supportTime: number): number {
    if (!supportTime) {
      return Infinity;
    }
    const release = parseISO(releaseDate);
    const now = new Date();
    return supportTime - differenceInMonths(now, release);
  }

  getSupportPercentageFromDuration(releaseDateStr: string, supportTimeMonths: number): number {
    if (!releaseDateStr || !supportTimeMonths) {
      return 0;
    }
    const releaseDate = new Date(releaseDateStr);
    const diffInMonths = differenceInMonths(new Date(), releaseDate);
    const remainingMonths = Math.max(0, supportTimeMonths - diffInMonths);
    const ratio = 100 - (remainingMonths / supportTimeMonths) * 100;
    return ratio === 0 ? 1 : ratio;
  }

  getSupportColor(releaseDate: string, supportTime: number): string {
    if (!releaseDate || !supportTime) {
      return 'support-primary';
    }
    const monthsLeft = this.getMonthsLeft(releaseDate, supportTime);

    if (supportTime == null || supportTime === 0) {
      return 'support-primary'; // 🟢 Living Standard
    }

    if (monthsLeft <= 0) {
      return 'support-warn'; // 🔴 Support terminé
    } else if (monthsLeft === 1) {
      return 'support-warn'; // 🔴 Dernier mois
    } else if (monthsLeft === 2) {
      return 'support-accent'; // 🟠 Avant-dernier mois
    } else {
      return 'support-primary'; // 🟢 OK
    }
  }

  getSupportTooltip(releaseDate: string, supportTime: number, type: string): string {
    if (!releaseDate || !supportTime) {
      return type;
    }
    const monthsLeft = this.getMonthsLeft(releaseDate, supportTime);

    if (supportTime === 0 || supportTime === null || supportTime === undefined) {
      return 'Living Standard';
    }

    if (monthsLeft <= 0) {
      return `Support ${type} terminé`;
    } else if (monthsLeft === 1) {
      return `Dernier mois de support ${type} !`;
    } else {
      return `${monthsLeft} mois restants avant la fin du support ${type}`;
    }
  }

  getProgressMode(duration: number): any {
    if (duration > 0) {
      return 'determinate';
    }
    return 'indeterminate';
  }

  getSupportColorClass(releaseDate: string, supportTime: number): string {
    if (!releaseDate || !supportTime) {
      return 'support-ok';
    }
    const monthsLeft = this.getMonthsLeft(releaseDate, supportTime);

    if (supportTime == null || supportTime === 0) {
      return 'support-ok';
    }

    if (monthsLeft <= 0) {
      return 'support-danger';
    } else if (monthsLeft <= 2) {
      return 'support-warning';
    } else {
      return 'support-ok';
    }
  }
}