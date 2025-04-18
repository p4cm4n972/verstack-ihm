import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
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
import { addMonths, differenceInMonths, parseISO } from 'date-fns';

@Component({
  selector: 'app-version',
  imports: [
    MatTabsModule,
    MatCardModule,
    MatGridListModule,
    MatIconModule,
    MatTooltipModule,
    CommonModule,
    MatProgressBarModule,
  ],
  templateUrl: './version.component.html',
  styleUrl: './version.component.scss',
})
export class VersionComponent implements OnInit {
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
    'backend',
  ];
  toggle: boolean = false;
  fields: Field[] = [];
  selectedDomain: string = 'Web';

  authStatus: boolean = false;
  userData: any;
  userFavoris: any;

  constructor(
    private _langagesService: LangagesService,
    private authService: AuthenticationService,
    private profileService: ProfileService
  ) {}

  ngOnInit(): void {
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
    const storedUserData = localStorage.getItem('user');
    if (storedUserData) {
      this.userData = JSON.parse(storedUserData);
    } else {
      this.userData = null;
    }
  }

  private loadUserFavoris(): void {
    const storedUserFavoris = localStorage.getItem('favoris');

    if (storedUserFavoris && storedUserFavoris.length !== 0) {
      this.userFavoris = JSON.parse(localStorage.getItem('favoris') || '[]');
    } else {
      this.userFavoris = null;
    }
  }

  private loadLangages(): void {
    this._langagesService.getAllLangages().subscribe((langages) => {
      this.langages = langages;
      this.filteredLangages = langages;
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
    console.log('userData', this.userData);
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

  domainLangages(langages: any[], selectedDomain: string, index: number) {
    let filtered: any[] = [];
    langages.forEach((langage) => {
      if (langage.domain.includes(this.domaines[index])) {
        filtered = [...filtered, langage];
      }
    });
    return filtered;
  }

  pinnedLangages: Set<string> = new Set();

  pinLanguage(language: any): void {
    if (
      (this.userFavoris &&
        this.userFavoris?.some((elm: any) => elm.name == language.name)) ||
      this.pinnedLangages.has(language.name)
    ) {
      console.log('DELETE favoris');
      const index = this.userFavoris.findIndex(
        (elm: any) => elm.name == language.name
      );
      console.log('delete', index);
      this.userFavoris.splice(index, 1);
      const updatedData = {
        favoris: [...this.userFavoris],
      };
      this.updateUserFavoris(updatedData);
      this.pinnedLangages.delete(language);
    } else {
      const { name, logoUrl } = language;
      console.log(...this.userData.favoris);
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
    // localStorage.setItem('user', JSON.stringify(response));
    localStorage.setItem('favoris', JSON.stringify(response.favoris));
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

  toggler() {
    this.toggle = !this.toggle;
  }

  calculateEndSupport(releaseDateStr: string, supportTimeMonths: number): Date {
    const releaseDate = new Date(releaseDateStr);
    const endSupport = new Date(releaseDate);
    endSupport.setMonth(releaseDate.getMonth() + supportTimeMonths);
    return endSupport;
  }

  getSupportPercentageFromDuration(
    releaseDateStr: string,
    supportTimeMonths: number
  ): number {
    const releaseDate = new Date(releaseDateStr);
    const today = new Date();
  
    const totalMonths = supportTimeMonths;
  
    const diffInMonths =
      (today.getFullYear() - releaseDate.getFullYear()) * 12 +
      (today.getMonth() - releaseDate.getMonth());
  
    const remainingMonths = Math.max(0, totalMonths - diffInMonths);
    const ratio = 100 - (remainingMonths / totalMonths) * 100 ;

    if(ratio === 0) { return  1} 
  
    return ratio;
  }
  
  
  

  getSupportColor(releaseDate: string, supportTime: number): string {
    const release = parseISO(releaseDate);
    const now = new Date();
    const totalMonths = supportTime;
    const monthsPassed = differenceInMonths(now, release);
    const monthsLeft = totalMonths - monthsPassed;
    if(supportTime ===  0 || supportTime === null || supportTime === undefined) {
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

  getSupportTooltip(releaseDate: string, supportTime: number): string {
    const release = parseISO(releaseDate);
    const now = new Date();
    const monthsPassed = differenceInMonths(now, release);
    const monthsLeft = supportTime - monthsPassed;

    if(supportTime ===  0 || supportTime === null || supportTime === undefined) {
      return 'Living Standard';
    }
  
    if (monthsLeft <= 0) {
      return 'Support terminé';
    } else if (monthsLeft === 1) {
      return 'Dernier mois de support';
    } else {
      return `${monthsLeft} mois restants avant la fin du support`;
    }
  }

  getMode(duration: number): any {
    if(duration > 0) {
      return 'determinate';
    } 
    return 'indeterminate';
  }
}
