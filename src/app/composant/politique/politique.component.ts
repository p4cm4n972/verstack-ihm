import { ChangeDetectionStrategy, Component, inject, Optional } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-politique',
  imports: [MatDialogModule, MatButtonModule, RouterModule, CommonModule],
  templateUrl: './politique.component.html',
  styleUrl: './politique.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PolitiqueComponent {
  private dialogRef = inject(MatDialogRef<PolitiqueComponent>, { optional: true });

  get isDialog(): boolean {
    return !!this.dialogRef;
  }

  close(): void {
    if (this.dialogRef) {
      this.dialogRef.close();
    }
  }
}
