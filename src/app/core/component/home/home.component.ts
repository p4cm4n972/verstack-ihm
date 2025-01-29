import { Component } from '@angular/core';
import {MatTabsModule} from '@angular/material/tabs'; 
import { GlobeComponent } from '../../../composant/globe/globe.component';
import { TapeTextConsoleComponent } from "../../../composant/tape-text-console/tape-text-console.component";

@Component({
  selector: 'app-home',
  imports: [MatTabsModule, GlobeComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {
  public executeSelectedChange = (event: any) => {
    console.log(event);
  }

}
