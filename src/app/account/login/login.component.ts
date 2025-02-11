import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatTabsModule } from '@angular/material/tabs';
import { MatToolbarModule } from '@angular/material/toolbar';
import { AuthenticationService } from '../../services/authentication.service';
import { Router } from '@angular/router';
import {MatSnackBar} from '@angular/material/snack-bar';

@Component({
  selector: 'app-login',
    imports: [MatToolbarModule,MatButtonModule, MatTabsModule,MatCheckboxModule, MatCardModule,MatFormFieldModule,MatInputModule, MatIconModule, MatSelectModule , ReactiveFormsModule],
  
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  loginForm: FormGroup;

  constructor(private fb: FormBuilder, private readonly authService: AuthenticationService, private router: Router) {

    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  onLogin() {
    if (this.loginForm.valid) {
      this.authService.login(this.loginForm.value).subscribe({
        next: (response) => {
          localStorage.setItem('token', response.token);
          this.router.navigate(['/home']);
          this.openSnackBar()
        },
        error: (error) => {
          console.error('Login failed', error);
        }
      })
    }
  }

  private _snackBar = inject(MatSnackBar);

  durationInSeconds = 5;

  openSnackBar() {
    this._snackBar.open('Bienvenue', '', {
      duration: this.durationInSeconds * 1000,
      horizontalPosition: 'center',
      verticalPosition: 'top',
    });
  }

}
