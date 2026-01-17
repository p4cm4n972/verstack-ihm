import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
  ValidatorFn,
  AbstractControl,
} from '@angular/forms';

import { Component, EventEmitter, inject, Output, ViewEncapsulation, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { TermesComponent } from '../../composant/termes/termes.component';
import { AuthenticationService } from '../../services/authentication.service';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SharedMaterialModule } from '../../shared/material.module';
import { PlatformService } from '../../core/services/platform.service';

@Component({
  selector: 'app-signin',
  imports: [
    ReactiveFormsModule,
    SharedMaterialModule
  ],
  templateUrl: './signin.component.html',
  styleUrl: './signin.component.scss',
  encapsulation: ViewEncapsulation.None,
})
export class SigninComponent implements OnInit {
  @Output() signUpComplete = new EventEmitter<void>();
  
  readonly dialog = inject(MatDialog);
  private _snackBar = inject(MatSnackBar);
  durationInSeconds = 5;
  selected: number = 0;

  openPrivacyTermeDialog() {
    const dialogRef = this.dialog.open(TermesComponent);

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.signupForm.get('acceptTerms')?.setValue(true);
      }
    });
  }

  signupForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private authService: AuthenticationService,
    private router: Router,
    private platformService: PlatformService
  ) {
    this.signupForm = this.fb.group(
      {
        pseudo: ['', Validators.required],
        email: ['', [Validators.required, Validators.email]],
        password: [
          '',
          [
            Validators.required,
            Validators.minLength(8),
            Validators.pattern(
              '(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[@$!%*?&_:]).{8,}'
            ),
          ],
        ],
        confirmPassword: ['', [Validators.required]],
        acceptTerms: [false, Validators.requiredTrue],
      },
      { validators: passwordMatchValidator }
    );
  }

  ngOnInit(): void {
    // Form simplifiée - les utilisateurs complèteront leur profil après inscription
  }

  onSignup() {
    if (this.signupForm.valid) {
      const signupData = {
        pseudo: this.signupForm.value.pseudo,
        email: this.signupForm.value.email,
        password: this.signupForm.value.password,
        acceptTerms: this.signupForm.value.acceptTerms,
      };

      this.authService.signup(signupData).subscribe({
        next: (response) => {
          this.signupForm.reset();
          this.onSignUpSuccess();
          this.openSnackBar('Inscription réussie');
        },
        error: (error) => {
          
          this.openSnackBar("Erreur d'inscription: " + error.error.message);
          console.error("Erreur d'inscription", error.error.message);
        },
      });
    } else {
      console.warn('Formulaire invalide');
    }
  }

  onSignUpSuccess() {
    
    this.signUpComplete.emit();
  }


  openSnackBar(message: string) {
    if (!this.platformService.isBrowser) return;
    this._snackBar.open(message, '', {
      duration: this.durationInSeconds * 1000,
      horizontalPosition: 'center',
      verticalPosition: 'top',
    });
  }
}

export const passwordMatchValidator: ValidatorFn = (
  formGroup: AbstractControl
): { [key: string]: boolean } | null => {
  const password = formGroup.get('password');
  const confirmPassword = formGroup.get('confirmPassword');
  if (password && confirmPassword && password.value !== confirmPassword.value) {
    return { passwordMismatch: true };
  }
  return null;
};
