import { NgModule } from '@angular/core';

// Material Modules les plus utilisés
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTabsModule } from '@angular/material/tabs';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSelectModule } from '@angular/material/select';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatRadioModule } from '@angular/material/radio';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatChipsModule } from '@angular/material/chips';
import { MatBadgeModule } from '@angular/material/badge';

const MATERIAL_MODULES = [
  MatButtonModule,
  MatCardModule,
  MatIconModule,
  MatFormFieldModule,
  MatInputModule,
  MatToolbarModule,
  MatTabsModule,
  MatCheckboxModule,
  MatSelectModule,
  MatDialogModule,
  MatSnackBarModule,
  MatSidenavModule,
  MatListModule,
  MatMenuModule,
  MatProgressBarModule,
  MatPaginatorModule,
  MatRadioModule,
  MatSlideToggleModule,
  MatTableModule,
  MatTooltipModule,
  MatChipsModule,
  MatBadgeModule,
];

@NgModule({
  imports: MATERIAL_MODULES,
  exports: MATERIAL_MODULES,
})
export class SharedMaterialModule { }