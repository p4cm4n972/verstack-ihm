import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, Input, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { Field } from '../../../models/field.model';
import { LangagesService } from '../../../services/langages.service';
import { MatTabsModule } from '@angular/material/tabs';
import { MatCardModule } from '@angular/material/card';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { AuthenticationService } from '../../../services/authentication.service';
import { ProfileService } from '../../../services/profile.service';
import { CommonModule } from '@angular/common';
import { Observable, tap } from 'rxjs';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { differenceInMonths, parseISO } from 'date-fns';
import { MatBadgeModule } from '@angular/material/badge';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Title, Meta } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import {
  MatDialog,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogModule,
  MatDialogRef,
  MatDialogTitle,
} from '@angular/material/dialog';
import { SeoService } from '../../../services/seo.service';
import { isPlatformBrowser } from '@angular/common';

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
})

export class VersionComponent implements OnInit {
  @Input() favorisFromHome: any[] = [];
  @Input() origin: string = '';

  readonly dialog = inject(MatDialog);

  langages: any[] = [];
  filteredLangages: any[] = [];
  selectedDomainIndex: number = 0;
  domaines: string[] = [
    'web',
    'mobile',
    'embedded',
    'datascience',
    'ia',
    'game',
    'devops',
    //'backend',
  ];
  toggle: boolean = false;
  fields: Field[] = [];
  selectedDomain: string = 'Web';

  authStatus: boolean = false;
  userData: any;
  userFavoris: any;

  isLoading: boolean = true;
  isBrowser: boolean;

  private readonly iconMap: Record<string, { type: string; color: string }> = {
    language: { type: 'code_blocks', color: 'icon-language' },
    framework: { type: 'home_repair_service', color: 'icon-framework' },
    tools: { type: 'construction', color: 'icon-tools' },
    database: { type: 'storage', color: 'icon-database' },
  };

  constructor(
    private _langagesService: LangagesService,
    private authService: AuthenticationService,
    private profileService: ProfileService,
    private title: Title, private meta: Meta,
    private seo: SeoService,
    @Inject(PLATFORM_ID) private platformId: Object,
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  ngOnInit(): void {
    this.seo.updateMetaData({
    title: 'Stack – Verstack.io',
    description: 'Découvrez les meilleurs outils et stacks pour développeurs modernes.',
    keywords: 'verstack, langages, outils, développeurs, Angular, React',
    image: 'https://verstack.io/assets/slider/slider-2.jpg',
    url: 'https://verstack.io/version'
  });
    this.getAuthStatus().subscribe((status: any) => {
      if (status) {
        this.loadUserData();
        this.loadUserFavoris();
        this.loadUserProfile();
      }
      this.loadLangages();
    });
  }

  private loadUserData(): void {
    if (this.isBrowser) {
      const storedUserData = localStorage.getItem('user');
      this.userData = storedUserData ? JSON.parse(storedUserData) : null;
    } else {
      this.userData = null;
    }
  }

  private loadUserFavoris(): void {
    if (this.isBrowser) {
      const storedUserFavoris = localStorage.getItem('favoris');
      this.userFavoris = (storedUserFavoris && storedUserFavoris.length !== 0)
        ? JSON.parse(storedUserFavoris)
        : null;
    } else {
      this.userFavoris = null;
    }
  }

 private loadLangages(): void {
  this._langagesService.getAllLangages().subscribe({
    next: (langages) => {
      if (this.favorisFromHome && this.favorisFromHome.length > 0) {
        const favorisNames = this.favorisFromHome.map(f => f.name);
        this.langages = langages.filter(l => favorisNames.includes(l.name));
      } else {
        this.langages = langages;
      }

      this.filteredLangages = this.langages;
      this.isLoading = false;
    },
    error: (err) => {
      console.error('Erreur lors de la récupération des langages', err);
      this.isLoading = false;
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

  private loadUserProfile(): void {
    if (this.userData?.id) {
      this.profileService.getUserProfile(this.userData.id).subscribe({
        next: (data) => {
          this.userData = data;
          this.storeUserData(data);
        },
        error: (err) =>
          console.error(
            'Erreur lors de la récupération des données utilisateur',
            err
          ),
      });
    }
  }

  domainLangages(langages: any[], selectedDomain: string, index: number): any[] {
    const filtered = langages.filter(langage =>
      langage.domain.includes(this.domaines[index])
    );

    const order = ['language', 'framework', 'tools', 'database'];

    return filtered.sort((a, b) => {
      const aIndex = order.findIndex(type => a.domain.includes(type));
      const bIndex = order.findIndex(type => b.domain.includes(type));

      // Si un élément n’a aucun des types, on lui attribue un index très élevé
      const scoreA = aIndex === -1 ? 999 : aIndex;
      const scoreB = bIndex === -1 ? 999 : bIndex;

      return scoreA - scoreB;
    });
  }




  pinnedLangages: Set<string> = new Set();

  pinLanguage(language: any): void {
    if (
      (this.userFavoris &&
        this.userFavoris?.some((elm: any) => elm.name == language.name)) ||
      this.pinnedLangages.has(language.name)
    ) {
      const index = this.userFavoris.findIndex(
        (elm: any) => elm.name == language.name
      );
      this.userFavoris.splice(index, 1);
      const updatedData = {
        favoris: [...this.userFavoris],
      };
      this.updateUserFavoris(updatedData);
      this.pinnedLangages.delete(language);
    } else {
      const { name, logoUrl } = language;
      this.userFavoris = [...this.userData.favoris, { name, logoUrl }];
      const updatedData = {
        favoris: [...this.userData.favoris, { name, logoUrl }],
      };
      this.updateUserFavoris(updatedData);
      this.loadUserFavoris();
      this.pinnedLangages.add(language.name);
    }
  }
  private storeUserData(response: any) {
    if (this.isBrowser) {
      // localStorage.setItem('user', JSON.stringify(response));
      localStorage.setItem('favoris', JSON.stringify(response.favoris));
    }
  }

  private updateUserFavoris(updatedData: any): void {
    this.profileService
      .updateUserProfile(this.userData._id, updatedData)
      .subscribe({
        next: () => {
          console.log('Profil mis à jour avec succès !', this.pinnedLangages);
          this.refreshUserData();
        },
        error: (err) =>
          console.error('Erreur lors de la mise à jour du profil', err),
      });
  }

  private refreshUserData(): void {
    this.profileService.getUserProfile(this.userData._id).subscribe({
      next: (data) => {
        this.userData = data;
        this.storeUserData(data);
      },
      error: (err) =>
        console.error(
          'Erreur lors de la récupération des données utilisateur',
          err
        ),
    });
  }

  isPinned(languageName: any): boolean {
    if (
      (this.userFavoris &&
        this.userFavoris.some((elm: any) => elm.name == languageName)) ||
      this.pinnedLangages.has(languageName)
    ) {
      return true;
    } else {
      return false;
    }
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

}

@Component({
  selector: 'dialog',
  templateUrl: 'dialog.html',
  imports: [MatDialogModule, MatButtonModule, RouterModule],
  //changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DialogContent { }