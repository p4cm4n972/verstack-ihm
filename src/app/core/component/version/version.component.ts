import { Component, OnInit } from '@angular/core';
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
  domaines: string[] = ['Web', 'Mobile', 'Embedded', 'Data Science', 'IA', ''];
  toggle: boolean = false;
  fields: Field[] = [];
  selectedDomain: string = 'Web';

  authStatus: boolean = false;
  userData: any;

  constructor(
    private _langagesService: LangagesService,
    private authService: AuthenticationService,
    private profileService: ProfileService
  ) {
    //  this._fieldService.getField().subscribe((fields) => {
    //   this.fields = fields;
    //  }) ;
  }

  ngOnInit(): void {
    console.log(this.pinnedLangages)
    this._langagesService.getAllLangages().subscribe((langages) => {
      this.langages = langages;
      this.filteredLangages = langages;
      this.authService.getAuthStatus().subscribe((status) => {
        this.authStatus = status;
      });
    });
    const storedUserData = localStorage.getItem('user');
    if (storedUserData) {
      this.userData = JSON.parse(storedUserData);
    } else {
      this.userData = null;
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
    console.log(language);

    if (this.pinnedLangages.has(language.name)) {
      this.pinnedLangages.delete(language);
    } else {
      const { name, logoUrl } = language
      const updatedData = { favoris: [...this.userData.favoris, { name, logoUrl }] }
      this.profileService.updateUserProfile(this.userData._id, updatedData).subscribe(() => {
        console.log('Profil mis à jour avec succès !', this.pinnedLangages);
        this.pinnedLangages.add(language.name);
      });
    }
    console.log(this.pinnedLangages);
  }

  isPinned(language: any): boolean {
    console.log(language)
    return this.pinnedLangages.has(language.name);
  }

  redirectTo(url: string): void {
    window.open(url, '_blank');
  }

  toggler() {
    this.toggle = !this.toggle;
  }
}
