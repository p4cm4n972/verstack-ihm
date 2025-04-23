import { MatCardModule } from '@angular/material/card';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
  ValidatorFn,
  AbstractControl,
} from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatTabsModule } from '@angular/material/tabs';
import { MatCheckboxModule } from '@angular/material/checkbox';

import { Component, EventEmitter, inject, Output, ViewEncapsulation } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { TermesComponent } from '../../composant/termes/termes.component';
import { AuthenticationService } from '../../services/authentication.service';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import {MatRadioModule} from '@angular/material/radio';

@Component({
  selector: 'app-signin',
  imports: [
    MatToolbarModule,
    MatTabsModule,
    MatCheckboxModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatSelectModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatDialogModule,
    MatRadioModule
  ],
  templateUrl: './signin.component.html',
  styleUrl: './signin.component.scss',
  encapsulation: ViewEncapsulation.None,
})
export class SigninComponent {
  @Output() signUpComplete = new EventEmitter<void>();
  
  readonly dialog = inject(MatDialog);
  private _snackBar = inject(MatSnackBar);
  durationInSeconds = 5;
  selected: number = 0

  openPrivacyTermeDialog() {
    const dialogRef = this.dialog.open(TermesComponent);

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.signupForm.get('acceptTerms')?.setValue(true);
      }
    });
  }

  signupForm: FormGroup;
  jobList: string[] = [
    'Développeur Frontend',
    'Développeur Backend',
    'Développeur Fullstack',
    'Développeur Mobile',
    'Développeur JavaScript',
    'Développeur Python',
    'Développeur Java',
    'Développeur .NET',
    'Développeur PHP',
    'Développeur Go',
    'Développeur Rust',
    'Développeur C/C++',
    'Développeur Swift',
    'Développeur Kotlin',
    'Développeur Blockchain',
    'Développeur Smart Contract',
    'Ingénieur DevOps',
    'Architecte Cloud',
    'Ingénieur Cloud',
    'Architecte Logiciel',
    'Data Scientist',
    'Data Engineer',
    'Data Analyst',
    'Machine Learning Engineer',
    'Consultant Big Data',
    'Ingénieur IA (Intelligence Artificielle)',
    'Administrateur Système et Réseaux',
    'Ingénieur Sécurité Informatique',
    "Pentester (Testeur d'intrusion)",
    'Consultant Cybersécurité',
    'Administrateur Base de Données',
    'Analyste Sécurité',
    'Product Owner',
    'Scrum Master',
    'Chef de Projet IT',
    'UX/UI Designer',
    'Designer Graphique',
    'Spécialiste Accessibilité Web',
    'Webmaster',
    'Expert SEO',
    'Ingénieur Réseaux',
    'Responsable Support Informatique',
    'Analyste Fonctionnel',
    'Testeur Logiciel',
    'Automatisation des Tests QA',
    'Ingénieur Virtualisation',
    'Ingénieur IoT (Internet des Objets)',
    'Technicien Informatique',
    'Rédacteur Technique',
    'Community Manager',
    'Growth Hacker',
    'Spécialiste No-Code/Low-Code',
    'Game Developer',
    'Concepteur de Jeux Vidéo',
    'Ingénieur VR/AR (Réalité Virtuelle/Augmentée)',
    'Spécialiste IT Freelance',
  ];
  experienceList: string[] = [
    '0-1 an',
    '2-3 ans',
    '4-5 ans',
    '6-10 ans',
    '10 ans et plus',
  ];
  ageRanges: string[] = [
    '18-25 ans',
    '26-35 ans',
    '36-45 ans',
    '46 ans et plus',
  ];
  salaryRanges: string[] = [
    '20k€ - 30k€',
    '31k€ - 40k€',
    '41k€ - 50k€',
    '51k€ - 70k€',
    '70k€ et plus',
  ];

  constructor(
    private fb: FormBuilder,
    private authService: AuthenticationService,
    private router: Router
  ) {
    this.signupForm = this.fb.group(
      {
        sexe: [''],
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
        confirmPassword: ['', [Validators.required, passwordMatchValidator]],
        job: ['', Validators.required],
        ageRange: ['', Validators.required],
        salaryRange: ['', Validators.required],
        experience: ['', Validators.required],
        acceptTerms: [false, Validators.requiredTrue],
      },
      { validators: passwordMatchValidator }
    );
  }

  onSignup() {
    if (this.signupForm.valid) {
      const signupData = {
        sexe: this.signupForm.value.sexe,
        pseudo: this.signupForm.value.pseudo,
        email: this.signupForm.value.email,
        password: this.signupForm.value.password,
        job: this.signupForm.value.job,
        ageRange: this.signupForm.value.ageRange,
        salaryRange: this.signupForm.value.salaryRange,
        experience: this.signupForm.value.experience,
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
