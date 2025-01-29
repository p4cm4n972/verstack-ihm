import { Component } from '@angular/core';
import { FieldService } from '../../../services/field.service';
import { Field } from '../../../models/field.model';

@Component({
  selector: 'app-version',
  imports: [],
  templateUrl: './version.component.html',
  styleUrl: './version.component.scss'
})
export class VersionComponent {
  toggle: boolean = false;
  fields: Field [] = [];
  constructor( private _fieldService: FieldService) {
   this._fieldService.getField().subscribe((fields) => {
    this.fields = fields;
   }) ;
  }
  redirectTo(url: string): void {
    window.open(url, '_blank');
  }

  toggler() {
    this.toggle = !this.toggle;
  }
}
