import { Component } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { FooterComponent } from '../../navigation/footer/footer.component';

@Component({
  selector: 'app-layout',
  imports: [MatToolbarModule, FooterComponent],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.scss'
})
export class LayoutComponent {

}
