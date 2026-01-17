import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Inject, OnDestroy, OnInit, PLATFORM_ID, inject, input, effect } from '@angular/core';
import { Field } from '../../../models/field.model';
import { LangagesService } from '../../../services/langages.service';
import { MatTabsModule } from '@angular/material/tabs';
import { MatCardModule } from '@angular/material/card';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { AuthenticationService } from '../../../services/authentication.service';
import { FavorisService } from '../../../services/favoris.service';
import { CommonModule } from '@angular/common';
import { Observable, Subject, tap, take, takeUntil } from 'rxjs';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { differenceInMonths, parseISO, formatDistanceToNow, differenceInHours } from 'date-fns';
import { fr } from 'date-fns/locale';
import { MatBadgeModule } from '@angular/material/badge';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Title, Meta } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import {
  MatDialog,
  MatDialogModule,
} from '@angular/material/dialog';
import { SeoService } from '../../../services/seo.service';
import { isPlatformBrowser } from '@angular/common';
import { Technology, FavoriteTechnology } from '../../../models/technology.interface';

@Component({
  selector: 'app-version',
  imports: [
    RouterModule,
    MatTabsModule,
    MatCardModule,
    MatGridListModule,
    MatIconModule,
    MatTooltipModule,
    CommonModule,
    MatProgressBarModule,
    MatBadgeModule,
    MatButtonModule,
    MatProgressSpinnerModule,

  ],
  templateUrl: './version.component.html',
  styleUrl: './version.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})

export class VersionComponent implements OnInit, OnDestroy {
  readonly favorisFromHome = input<FavoriteTechnology[]>([]);
  readonly origin = input('');

  readonly dialog = inject(MatDialog);
  readonly favorisService = inject(FavorisService);

  langages: Technology[] = [];
  filteredLangages: Technology[] = [];
  selectedDomainIndex: number = 0;
  domaines: string[] = [
    'web',
    'mobile',
    'embedded',
    'datascience',
    'ia',
    'game',
    'devops',
  ];
  toggle: boolean = false;
  fields: Field[] = [];
  selectedDomain: string = 'Web';

  authStatus: boolean = false;

  isLoading: boolean = true;
  isBrowser: boolean;

  // Expose favoris signals from service
  readonly userFavoris = this.favorisService.favoris;
  readonly isFavorisLoading = this.favorisService.isLoading;

  private destroy$ = new Subject<void>();

  private readonly iconMap: Record<string, { type: string; color: string }> = {
    language: { type: 'code_blocks', color: 'icon-language' },
    framework: { type: 'home_repair_service', color: 'icon-framework' },
    tools: { type: 'construction', color: 'icon-tools' },
    database: { type: 'storage', color: 'icon-database' },
  };

  // Données de tendance (simulées en attendant l'API)
  private readonly trendingData: Record<string, 'up' | 'down' | 'stable'> = {
    'JavaScript': 'stable',
    'TypeScript': 'up',
    'Python': 'up',
    'HTML': 'stable',
    'CSS': 'stable',
    'Node.js': 'up',
    'Angular': 'stable',
    'React': 'up',
    'Vue.js': 'down',
    'MongoDB': 'stable',
    'C': 'stable',
    'C++': 'stable',
    'C#': 'up',
    'Java': 'stable',
    'PHP': 'down',
    'Ruby': 'down',
    'Go': 'up',
    'Rust': 'up',
    'Swift': 'up',
    'Kotlin': 'up',
    'Dart': 'up',
    'Express.js': 'stable',
    'NestJS': 'up',
    'Django': 'stable',
    'Flask': 'stable',
    'Spring': 'stable',
    'Laravel': 'stable',
    'Next.js': 'up',
    'Nuxt.js': 'up',
    'Svelte': 'up',
    'Docker': 'up',
    'Kubernetes': 'up',
    'PostgreSQL': 'up',
    'MySQL': 'stable',
    'Redis': 'up',
    'GraphQL': 'up',
    'Terraform': 'up',
    'Ansible': 'stable',
  };

  constructor(
    private _langagesService: LangagesService,
    private authService: AuthenticationService,
    private title: Title,
    private meta: Meta,
    private seo: SeoService,
    private cdr: ChangeDetectorRef,
    @Inject(PLATFORM_ID) private platformId: Object,
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);

    // Effect to trigger change detection when favoris change
    effect(() => {
      this.favorisService.favoris();
      this.cdr.markForCheck();
    });
  }

  ngOnInit(): void {
    this.seo.updateMetaData({
    title: 'Stack – Verstack.io',
    description: 'Découvrez les meilleurs outils et stacks pour développeurs modernes.',
    keywords: `verstack, langages, outils, développeurs, Angular, React , version Angular, version React, version Vue.js, version Node.js, version Python, version Java,
      version C#, version PHP, version Ruby, version Go, version Rust, version JavaScript, version TypeScript, version Bash, version Shell, version Perl,
      version Kotlin, version Swift, version Scala, version Dart, version Objective-C, version C, version C++, version R, version MATLAB, version Julia,
      version Haskell, version Elixir, version Erlang, version F#, version Groovy, version PowerShell, version Assembly, version SQL, version HTML,
      version CSS, version SASS, version LESS, version Docker, version Kubernetes, version Terraform, version Ansible, version Jenkins, version Git,
      version GitHub Actions, version Travis CI, version CircleCI, version Webpack, version Babel, version ESLint, version Prettier, version Nginx,
      version Apache, version PostgreSQL, version MySQL, version MongoDB, version Redis, version GraphQL, version Firebase, version Supabase,
      version Netlify, version Vercel, version AWS, version Azure, version GCP`,
    image: 'https://verstack.io/assets/slider/slide2.png',
    url: 'https://verstack.io/version'
  });
    this.getAuthStatus().pipe(take(1), takeUntil(this.destroy$)).subscribe((status: boolean) => {
      if (status) {
        // Sync favoris from API when authenticated
        this.favorisService.syncFromApi().pipe(takeUntil(this.destroy$)).subscribe();
      }
      this.loadLangages();
    });
  }

  private loadLangages(): void {
    this._langagesService.getAllLangages().pipe(takeUntil(this.destroy$)).subscribe({
      next: (langages: Technology[]) => {
        const favorisFromHomeValue = this.favorisFromHome();
        if (favorisFromHomeValue && favorisFromHomeValue.length > 0) {
          const favorisNames = favorisFromHomeValue.map((f: FavoriteTechnology) => f.name);
          this.langages = langages.filter(l => favorisNames.includes(l.name));
        } else {
          this.langages = langages;
        }

        this.filteredLangages = this.langages;
        this.isLoading = false;
        this.cdr.markForCheck();
      },
      error: (err) => {
        console.error('Erreur lors de la récupération des langages', err);
        this.isLoading = false;
        this.cdr.markForCheck();
      }
    });
  }

  private getAuthStatus(): Observable<boolean> {
    return this.authService.getAuthStatus().pipe(
      tap((status: boolean) => {
        this.authStatus = status;
      })
    );
  }

  domainLangages(langages: Technology[], selectedDomain: string, index: number): Technology[] {
    const filtered = langages.filter(langage =>
      langage.domain.includes(this.domaines[index])
    );

    const order = ['language', 'framework', 'tools', 'database'];

    return filtered.sort((a, b) => {
      const aIndex = order.findIndex(type => a.domain.includes(type));
      const bIndex = order.findIndex(type => b.domain.includes(type));

      const scoreA = aIndex === -1 ? 999 : aIndex;
      const scoreB = bIndex === -1 ? 999 : bIndex;

      return scoreA - scoreB;
    });
  }

  /**
   * Toggle a technology in favorites using the centralized FavorisService
   */
  pinLanguage(language: Technology): void {
    this.favorisService.toggleFavoris(language)
      .pipe(takeUntil(this.destroy$))
      .subscribe();
  }

  /**
   * Check if a technology is in favorites using the FavorisService
   */
  isPinned(languageName: string): boolean {
    return this.favorisService.isFavoris(languageName);
  }

  redirectTo(url: string): void {
    window.open(url, '_blank');
  }

  needLoginDialog(): void {
    const dialogRef = this.dialog.open(DialogContent);
  }

  toggler() {
    this.toggle = !this.toggle;
  }

  calculateEndSupport(releaseDateStr: string, supportTimeMonths: number): Date {
    const releaseDate = new Date(releaseDateStr);
    const endSupport = new Date(releaseDate);
    endSupport.setMonth(releaseDate.getMonth() + supportTimeMonths);
    return endSupport;
  }

  private getMonthsLeft(releaseDate: string, supportTime: number): number {
    if (!supportTime) {
      return Infinity;
    }
    const release = parseISO(releaseDate);
    const now = new Date();
    return supportTime - differenceInMonths(now, release);
  }

  getSupportPercentageFromDuration(
    releaseDateStr: string,
    supportTimeMonths: number
  ): number {
    const releaseDate = new Date(releaseDateStr);
    const diffInMonths = differenceInMonths(new Date(), releaseDate);

    const remainingMonths = Math.max(0, supportTimeMonths - diffInMonths);
    const ratio = 100 - (remainingMonths / supportTimeMonths) * 100;

    if (ratio === 0) { return 1 }

    return ratio;
  }




  getSupportColor(releaseDate: string, supportTime: number): string {
    const monthsLeft = this.getMonthsLeft(releaseDate, supportTime);

    if (supportTime == null || supportTime === 0) {
      return 'support-primary'; // 🟢 OK
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

  isDataUpToDate(updatedAt: string | undefined): boolean {
    if (!updatedAt) {
      return false;
    }
    const release = parseISO(updatedAt);
    return differenceInHours(new Date(), release) <= 24;
  }

  getDataStatusClass(updatedAt: string | undefined): string {
    return this.isDataUpToDate(updatedAt) ? 'status-ok' : 'status-ko';
  }

  getDataStatusTooltip(updatedAt: string | undefined): string {
    if (!updatedAt) {
      return 'Date de release inconnue';
    }
    const release = parseISO(updatedAt);
    const distance = formatDistanceToNow(release, { addSuffix: true, locale: fr });
    return this.isDataUpToDate(updatedAt)
      ? `Données à jour \u2014 dernière maj ${distance}`
      : `Mise à jour des données nécessaire \u2014 dernière maj ${distance}`;
  }

  getIconType(domain: string[]): string | undefined {
    return domain
      .map((d) => this.iconMap[d]?.type)
      .find((v) => !!v);
  }

  getIconColor(domain: string[]): string {
    return (
      domain
        .map((d) => this.iconMap[d]?.color)
        .find((v) => !!v) || ''
    );
  }

  getTrending(name: string): 'up' | 'down' | 'stable' {
    return this.trendingData[name] || 'stable';
  }

  getSupportTooltip(releaseDate: string, supportTime: number, type: string): string {
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

  trackP(index: number, item: any) {
  return item.id ?? index; // fallback si id absent
}

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

}

@Component({
  selector: 'dialog',
  templateUrl: 'dialog.html',
  imports: [MatDialogModule, MatButtonModule, RouterModule],
  //changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DialogContent { }