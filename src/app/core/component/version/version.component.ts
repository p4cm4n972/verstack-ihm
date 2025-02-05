import { Component, OnInit } from '@angular/core';
import { FieldService } from '../../../services/field.service';
import { Field } from '../../../models/field.model';
import { LangagesService } from '../../../services/langages.service';
import {MatTabsModule} from '@angular/material/tabs';
import {MatCardModule} from '@angular/material/card';
import {MatGridListModule} from '@angular/material/grid-list';

@Component({
  selector: 'app-version',
  imports: [MatTabsModule, MatCardModule, MatGridListModule],
  templateUrl: './version.component.html',
  styleUrl: './version.component.scss'
})
export class VersionComponent implements OnInit {
  langages: any[] = [];
  filteredLangages: any[] = [];
  selectedDomainIndex: number = 0;
  domaines: string[] = ['Tous', 'Web', 'Frontend', 'Backend', 'Mobile', 'Data Science'];
  toggle: boolean = false;
  fields: Field [] = [];
  selectedDomain: string = 'Tous';

  constructor( private _fieldService: FieldService, private _langagesService: LangagesService) {
    

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

  filterLanguages(event: any) {
    const selectedDomain = this.domaines[event.index];
    this.filteredLangages =
      selectedDomain === 'Tous'
        ? this.langages
        : this.langages.filter((langage) => langage.domain.includes(selectedDomain));
  }




  redirectTo(url: string): void {
    window.open(url, '_blank');
  }

  toggler() {
    this.toggle = !this.toggle;
  }
}
