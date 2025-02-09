import { ChangeDetectionStrategy, Component, ViewEncapsulation, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { PolitiqueComponent } from '../politique/politique.component';

@Component({
  selector: 'app-termes',
  imports: [MatDialogModule, MatButtonModule],
  templateUrl: './termes.component.html',
  styleUrl: './termes.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None,
  
})
export class TermesComponent {
  readonly dialog = inject(MatDialog);
  openPrivacyMentionDialog(){
    const dialogRef = this.dialog.open(PolitiqueComponent);
  }
}
