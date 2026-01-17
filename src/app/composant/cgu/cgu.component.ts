import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { RouterModule } from '@angular/router';
import { PolitiqueComponent } from '../politique/politique.component';

@Component({
  selector: 'app-cgu',
  imports: [RouterModule],
  templateUrl: './cgu.component.html',
  styleUrl: './cgu.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CguComponent {
  readonly dialog = inject(MatDialog);

  openPrivacyDialog(): void {
    this.dialog.open(PolitiqueComponent);
  }
}
