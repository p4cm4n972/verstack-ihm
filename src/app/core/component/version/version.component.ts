import { Component, OnInit } from '@angular/core';
import { FieldService } from '../../../services/field.service';
import { Field } from '../../../models/field.model';
import { LangagesService } from '../../../services/langages.service';
import { MatTabsModule } from '@angular/material/tabs';
import { MatCardModule } from '@angular/material/card';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatIconModule } from '@angular/material/icon';
import {MatTooltipModule} from '@angular/material/tooltip';

@Component({
  selector: 'app-version',
  imports: [MatTabsModule, MatCardModule, MatGridListModule, MatIconModule, MatTooltipModule],
  templateUrl: './version.component.html',
  styleUrl: './version.component.scss',
})
export class VersionComponent implements OnInit {
  langages: any[] = [];
  filteredLangages: any[] = [];
  selectedDomainIndex: number = 0;
  domaines: string[] = [
    'Tous',
    'Web',
    'Frontend',
    'Backend',
    'Mobile',
    'Data Science',
  ];
  toggle: boolean = false;
  fields: Field[] = [];
  selectedDomain: string = 'Tous';

  

  constructor(
    private _fieldService: FieldService,
    private _langagesService: LangagesService
  ) {
    //  this._fieldService.getField().subscribe((fields) => {
    //   this.fields = fields;
    //  }) ;
  }

  ngOnInit(): void {
    this._langagesService.getAllLangages().subscribe((langages) => {
      this.langages = langages;
      this.filteredLangages = langages;
    });
  }

  pinnedLangages: Set<string> = new Set();

  pinLanguage(language: any): void {
    console.log(language);
    const languageName = language.name;

    if (this.pinnedLangages.has(languageName)) {
      this.pinnedLangages.delete(languageName); // Supprimer des favoris
    } else {
      this.pinnedLangages.add(languageName); // Ajouter en favoris
    }
    console.log(this.pinnedLangages);
  }

  isPinned(language: any): boolean {
    return this.pinnedLangages.has(language.name);
  }

  redirectTo(url: string): void {
    window.open(url, '_blank');
  }

  toggler() {
    this.toggle = !this.toggle;
  }
}
