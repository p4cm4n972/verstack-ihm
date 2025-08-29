import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthenticationService } from '../../services/authentication.service';
import { Router, RouterModule, ActivatedRoute } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SharedMaterialModule } from '../../shared/material.module';
import { PlatformService } from '../../core/services/platform.service';

@Component({
  selector: 'app-login',
    imports: [RouterModule, ReactiveFormsModule, SharedMaterialModule],
  
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  private _snackBar = inject(MatSnackBar);
  private returnUrl: string = '/home';

  constructor(
    private fb: FormBuilder,
    private readonly authService: AuthenticationService,
    private router: Router,
    private route: ActivatedRoute,
    private platformService: PlatformService
  ) {

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
    if (!this.platformService.isBrowser) return;
    this._snackBar.open(message, '', {
      duration: this.durationInSeconds * 1000,
      horizontalPosition: 'center',
      verticalPosition: 'top',
    });
  }

}
