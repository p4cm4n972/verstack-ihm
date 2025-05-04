import { Component, inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { RouterModule } from '@angular/router';
import { PolitiqueComponent } from '../politique/politique.component';

@Component({
  selector: 'app-mentions',
  imports: [RouterModule],
  templateUrl: './mentions.component.html',
  styleUrl: './mentions.component.scss'
})
export class MentionsComponent {
   readonly dialog = inject(MatDialog);
    openPrivacyMentionDialog(){
      const dialogRef = this.dialog.open(PolitiqueComponent);
    }
}
