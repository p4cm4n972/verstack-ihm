import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FieldService } from '../../../services/field.service';
import { Field } from '../../../models/field.model';
import { LangagesService } from '../../../services/langages.service';
import { MatTabsModule } from '@angular/material/tabs';
import { MatCardModule } from '@angular/material/card';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { AuthenticationService } from '../../../services/authentication.service';
import { ProfileService } from '../../../services/profile.service';

@Component({
  selector: 'app-version',
  imports: [
    MatTabsModule,
    MatCardModule,
    MatGridListModule,
    MatIconModule,
    MatTooltipModule,
  ],
  templateUrl: './version.component.html',
  styleUrl: './version.component.scss',
})
export class VersionComponent implements OnInit {
  langages: any[] = [];
  filteredLangages: any[] = [];
  selectedDomainIndex: number = 0;
  domaines: string[] = ['web', 'mobile', 'embedded', 'datascience', 'ia', 'game'];
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
    this.loadUserData();
    this.loadUserFavoris();
    this.loadLangages();
    this.subscribeToAuthStatus();
    this.loadUserProfile();
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
      this.userFavoris = JSON.parse(storedUserFavoris);
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

  private subscribeToAuthStatus(): void {
    this.authService.getAuthStatus().subscribe((status) => {
      this.authStatus = status;
    });
  }

  private loadUserProfile(): void {
    if (this.userData?._id) {
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
    localStorage.setItem('user', JSON.stringify(response));
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
}
