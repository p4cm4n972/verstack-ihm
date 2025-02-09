import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';


@Component({
  selector: 'app-politique',
  imports: [MatDialogModule, MatButtonModule],
  templateUrl: './politique.component.html',
  styleUrl: './politique.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PolitiqueComponent {

}
