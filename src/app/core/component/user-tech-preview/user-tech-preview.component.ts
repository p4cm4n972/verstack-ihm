import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedMaterialModule } from '../../../shared/material.module';
import { AuthenticationService } from '../../../services/authentication.service';
import { PlatformService } from '../../services/platform.service';
import { LangagesService } from '../../../services/langages.service';
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";

@Component({
  selector: 'app-user-tech-preview',
  standalone: true,
  imports: [CommonModule, SharedMaterialModule, MatProgressSpinnerModule],
  templateUrl: './user-tech-preview.component.html',
  styleUrl: './user-tech-preview.component.scss'
})
export class UserTechPreviewComponent implements OnInit {
  userFavoris: any[] = [];
  userTechnologies: any[] = [];
  isLoading = true;

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
        this.userTechnologies = allLangages.filter(lang => 
          favorisNames.includes(lang.name)
        );
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
}