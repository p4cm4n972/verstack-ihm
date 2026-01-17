import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatTabsModule } from '@angular/material/tabs';
import { MatIconModule } from '@angular/material/icon';
import { SigninComponent } from '../../../account/signin/signin.component';
import { LoginComponent } from '../../../account/login/login.component';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-signup',
  imports: [MatCardModule, MatTabsModule, MatIconModule, SigninComponent, LoginComponent, MatButtonModule],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.scss',
})
export class SignupComponent {
  selectedTab: number = 0;

  resetTab() {
    this.selectedTab = 0; // Revient à l'onglet "Se connecter"
  }
}
