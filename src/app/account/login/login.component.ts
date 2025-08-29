import { Component, inject, Inject, PLATFORM_ID, OnInit } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
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
import { Router, RouterModule, ActivatedRoute } from '@angular/router';
import {MatSnackBar} from '@angular/material/snack-bar';

@Component({
  selector: 'app-login',
    imports: [RouterModule,MatButtonModule, MatToolbarModule,MatButtonModule, MatTabsModule,MatCheckboxModule, MatCardModule,MatFormFieldModule,MatInputModule, MatIconModule, MatSelectModule , ReactiveFormsModule],
  
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  private _snackBar = inject(MatSnackBar);
  private isBrowser: boolean;
  private returnUrl: string = '/home';

  constructor(
    private fb: FormBuilder,
    private readonly authService: AuthenticationService,
    private router: Router,
    private route: ActivatedRoute,
    @Inject(PLATFORM_ID) platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(platformId);

    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });

    // Récupérer l'URL de retour depuis les paramètres de requête
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/home';
  }

  ngOnInit() {
    // Afficher un message informatif si l'utilisateur a été redirigé
    const message = this.route.snapshot.queryParams['message'];
    if (message) {
      this.openSnackBar(message);
    } else if (this.returnUrl !== '/home') {
      this.openSnackBar('Veuillez vous connecter pour accéder à cette page');
    }
  }

  onLogin() {
    if (this.loginForm.valid) {
      this.authService.login(this.loginForm.value).subscribe({
        next: (response) => {
          // Rediriger vers l'URL de retour ou la page d'accueil par défaut
          this.router.navigateByUrl(this.returnUrl);
          this.openSnackBar('   ✅ Connexion réussie !')
        },
        error: (error) => {
          const message = error.error.message
          this.openSnackBar(message)
          console.error('Login failed', error.error.message);
        }
      })
    }
  }


  durationInSeconds = 5;

  openSnackBar(message: string) {
    if (!this.isBrowser) return;
    this._snackBar.open(message, '', {
      duration: this.durationInSeconds * 1000,
      horizontalPosition: 'center',
      verticalPosition: 'top',
    });
  }

}
