import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthenticationService } from '../../services/authentication.service';
import { ProfileService } from '../../services/profile.service';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-profile',
  imports: [MatIconModule, MatCardModule, MatFormFieldModule, MatInputModule, MatButtonModule, ReactiveFormsModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss'
})
export class ProfileComponent implements OnInit {

  profileForm: FormGroup;
  isEditMode: boolean = false;
  profilePictureUrl: string = 'https://placehold.co/10x10';
  userData: any;

  constructor( private fb: FormBuilder,
    private profileService: ProfileService,
    private authService: AuthenticationService) {
      this.profileForm = this.fb.group({
        firstName: ['', Validators.required],
        lastName: ['', Validators.required],
        email: ['', [Validators.required, Validators.email]],
        job: [''],
        profilePicture: [null],
    });
  }

    ngOnInit(): void {
      this.loadUserProfile();
    }

    async loadUserProfile() {
      const userId = await this.authService.getUserData()
      console.log(userId) ; // Exemple de méthode pour récupérer l'utilisateur connecté
      this.profileService.getUserProfile(userId).subscribe((data: any) => {
        this.userData = data;
        console.log(this.userData)
        this.profilePictureUrl = data.profilePicture || this.profilePictureUrl;
        this.profileForm.patchValue({
          pseudo: data.pseudo,
          firstName: data.firstName,
          lastName: data.lastName,
          email: data.email,
          job: data.job,
        });
      });
    }
  
    toggleEditMode(): void {
      this.isEditMode = !this.isEditMode;
    }
  
    onFileSelected(event: any): void {
      const file = event.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = () => {
          this.profilePictureUrl = reader.result as string;
        };
        reader.readAsDataURL(file);
      }
    }
  
    saveProfile(): void {
      if (this.profileForm.valid) {
        const updatedData = { ...this.profileForm.value, profilePicture: this.profilePictureUrl };
        this.profileService.updateUserProfile(this.userData._id, updatedData).subscribe(() => {
          alert('Profil mis à jour avec succès !');
          this.isEditMode = false;
        });
      } else {
        alert('Veuillez remplir les champs requis.');
      }
    }

}
