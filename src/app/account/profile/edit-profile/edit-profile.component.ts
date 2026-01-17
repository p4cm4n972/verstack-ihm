import { Component, Inject } from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'app-edit-profile',
  imports: [
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    MatIconModule,
    MatCardModule,
    MatButtonModule,
    MatListModule,
    MatTooltipModule,
    MatSelectModule
  ],
  templateUrl: './edit-profile.component.html',
  styleUrl: './edit-profile.component.scss',
})
export class EditProfileComponent {
  profileForm: FormGroup;
  selectedFile!: string;
  profilePicture!: string;

  // Options pour les sélecteurs
  jobOptions = [
    { value: 'frontend', label: 'Développeur Frontend' },
    { value: 'backend', label: 'Développeur Backend' },
    { value: 'fullstack', label: 'Développeur Fullstack' },
    { value: 'mobile', label: 'Développeur Mobile' },
    { value: 'devops', label: 'DevOps / SRE' },
    { value: 'data', label: 'Data Engineer / Scientist' },
    { value: 'security', label: 'Security Engineer' },
    { value: 'architect', label: 'Architecte Logiciel' },
    { value: 'lead', label: 'Tech Lead / Manager' },
    { value: 'student', label: 'Étudiant / Apprenti' },
    { value: 'other', label: 'Autre' }
  ];

  experienceOptions = [
    { value: '0-1', label: '0-1 an (Junior)' },
    { value: '2-3', label: '2-3 ans' },
    { value: '4-5', label: '4-5 ans (Confirmé)' },
    { value: '6-10', label: '6-10 ans (Senior)' },
    { value: '10+', label: '10+ ans (Expert)' }
  ];

  salaryOptions = [
    { value: '0-30k', label: 'Moins de 30k €' },
    { value: '30-40k', label: '30k - 40k €' },
    { value: '40-50k', label: '40k - 50k €' },
    { value: '50-60k', label: '50k - 60k €' },
    { value: '60-80k', label: '60k - 80k €' },
    { value: '80k+', label: '80k € et plus' },
    { value: 'nc', label: 'Ne souhaite pas répondre' }
  ];

  ageOptions = [
    { value: '18-24', label: '18-24 ans' },
    { value: '25-34', label: '25-34 ans' },
    { value: '35-44', label: '35-44 ans' },
    { value: '45-54', label: '45-54 ans' },
    { value: '55+', label: '55 ans et plus' },
    { value: 'nc', label: 'Ne souhaite pas répondre' }
  ];

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<EditProfileComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.profileForm = this.fb.group({
      pseudo: [data.pseudo, Validators.required],
      email: [data.email || ''],
      firstName: [data.firstName || ''],
      lastName: [data.lastName || ''],
      job: [data.job || ''],
      experience: [data.experience || ''],
      salaryRange: [data.salaryRange || ''],
      ageRange: [data.ageRange || ''],
    });
    this.profilePicture = data.profilePicture;
  }

  onFileSelected(event: any): void {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        this.selectedFile = reader.result as string;
      };
      reader.readAsDataURL(file);
    }
  }

  saveChanges(): void {
    const updatedData = {
      ...this.profileForm.value,
      profilePicture: this.selectedFile || this.profilePicture,
    };
    this.dialogRef.close(updatedData);
  }
}
