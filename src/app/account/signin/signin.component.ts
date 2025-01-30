import { Component, ViewEncapsulation } from '@angular/core';
import {MatCardModule} from '@angular/material/card';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatIconModule} from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import {MatTabsModule} from '@angular/material/tabs';
import {MatCheckboxModule} from '@angular/material/checkbox';


@Component({
  selector: 'app-signin',
  imports: [MatToolbarModule,MatTabsModule,MatCheckboxModule, MatCardModule,MatFormFieldModule,MatInputModule, MatIconModule, MatSelectModule , ReactiveFormsModule],
  templateUrl: './signin.component.html',
  styleUrl: './signin.component.scss',
  encapsulation: ViewEncapsulation.None
})
export class SigninComponent {
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
    'Pentester (Testeur d\'intrusion)',
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
    'Spécialiste IT Freelance'
  ];

  constructor(private fb: FormBuilder) {
    this.signupForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phoneNumber: ['', Validators.required],
      password: ['', Validators.required],
      confirmPassword: ['', Validators.required],
      job: ['', Validators.required],
      acceptTerms: [false, Validators.requiredTrue]
    });
  }

  onSubmit() {
    if (this.signupForm.valid) {
      console.log('Form Values:', this.signupForm.value);
    }
  }

  onSignup() {
    if (this.signupForm.valid) {
      console.log('Signup form data:', this.signupForm.value);
    }
  }

  onLogin() {
    if (this.signupForm.valid) {
      console.log('Login form data:', this.signupForm.value);
    }
  }
}
