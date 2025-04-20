import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthenticationService } from '../../services/authentication.service';
import { MatInputModule } from '@angular/material/input';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-reset-password',
  imports: [ReactiveFormsModule, MatFormFieldModule, MatInputModule, CommonModule, MatButtonModule],
  templateUrl: './reset-password.component.html',
  styleUrl: './reset-password.component.scss'
})
export class ResetPasswordComponent {
  resetPasswordForm: FormGroup;
  token: string = '';
  passwordStrengthClass = '';
  passwordStrengthLabel = '';

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private authService: AuthenticationService,
    private router: Router
  ) {
    this.resetPasswordForm = this.fb.group({
      newPassword: [
        '',
        [
          Validators.required,
          Validators.minLength(8),
          Validators.pattern(
            '(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[@$!%*?&_:]).{8,}'
          ),
        ],
      ],
    });

    this.token = this.route.snapshot.queryParamMap.get('token') || '';
  }

  onSubmit() {
    if (this.resetPasswordForm.valid && this.token) {
      this.authService.resetPassword(this.token, this.resetPasswordForm.value.newPassword).subscribe({
        next: () => {
          alert('Mot de passe réinitialisé avec succès.');
          this.router.navigate(['/signup']);
        },
        error: (err) => console.error(err),
      });
    }
  }


  

  checkPasswordStrength(): void {
    const password = this.resetPasswordForm.get('newPassword')?.value || '';
    const lengthValid = password.length >= 8;
    const hasUpper = /[A-Z]/.test(password);
    const hasLower = /[a-z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSpecial = /[@$!%*?&]/.test(password);

    const strength = [lengthValid, hasUpper, hasLower, hasNumber, hasSpecial].filter(Boolean).length;

    if (strength <= 2) {
      this.passwordStrengthClass = 'weak';
      this.passwordStrengthLabel = 'Faible';
    } else if (strength === 3 || strength === 4) {
      this.passwordStrengthClass = 'medium';
      this.passwordStrengthLabel = 'Moyenne';
    } else {
      this.passwordStrengthClass = 'strong';
      this.passwordStrengthLabel = 'Forte';
    }
  }

}
