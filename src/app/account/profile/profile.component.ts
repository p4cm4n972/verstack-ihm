import { Component, inject, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { AuthenticationService } from '../../services/authentication.service';
import { ProfileService } from '../../services/profile.service';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDialog } from '@angular/material/dialog';
import { EditProfileComponent } from './edit-profile/edit-profile.component';
import { MatListModule } from '@angular/material/list';
import { MatChipsModule } from '@angular/material/chips';
import { MatSnackBar } from '@angular/material/snack-bar';
import {MatDividerModule} from '@angular/material/divider';

@Component({
  selector: 'app-profile',
  imports: [
    MatIconModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatListModule,
    MatChipsModule,
    ReactiveFormsModule,
    MatDividerModule
  ],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss',
})
export class ProfileComponent implements OnInit {
  profileForm: FormGroup;
  isEditMode: boolean = false;
  defaultProfilePicture: string = 'https://placehold.co/10x10';
  favoris: string[] = [];
  userData: any;


  private isBrowser: boolean;

  constructor(
    private fb: FormBuilder,
    private profileService: ProfileService,
    private authService: AuthenticationService,
    private dialog: MatDialog,
    @Inject(PLATFORM_ID) platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
    this.profileForm = this.fb.group({
      pseudo: ['', Validators.required],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: [''],
      job: [''],
      favoris: [''],
      profilePicture: [null],
    });
  }

  ngOnInit(): void {
    this.loadUserProfile();
  }

  loadUserProfile() {
    const userId = this.authService.getUserId();
    this.profileService.getUserProfile(userId).subscribe({
      next: (data) => {
        this.userData = data;
        this.storeUserData(data);
      },
      error: (err) => {
        console.error(
          'Erreur lors de la récupération des données utilisateur',
          err
        );
      },
    });
  }

  openEditProfileDialog(): void {
    const dialogRef = this.dialog.open(EditProfileComponent, {
      data: { ...this.userData },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.profileService
          .updateUserProfile(this.userData._id, result)
          .subscribe(() => {
            this.openSnackBar('Profil mis à jour avec succès !');
            this.loadUserProfile(); // Recharger les données utilisateur
          });
      }
    });
  }

  private storeUserData(response: any) {
    if (this.isBrowser) {
      localStorage.setItem('user', JSON.stringify(response));
      localStorage.setItem('favoris', JSON.stringify(response.favoris));
    }
  }

  toggleEditMode(): void {
    this.isEditMode = !this.isEditMode;
  }

  enableEditMode(): void {
    this.isEditMode = true;
    this.profileForm.enable(); // Assure que le formulaire est bien activé
  }

  cancelEdit(): void {
    this.isEditMode = false;
    this.profileForm.patchValue(this.userData); // Restaurer les anciennes données
    this.profileForm.markAsPristine(); // Marque le formulaire comme inchangé
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        this.defaultProfilePicture = reader.result as string;
      };
      reader.readAsDataURL(file);
    }
  }

  saveProfile(): void {
    if (this.profileForm.valid) {
      const updatedData = {
        ...this.profileForm.value,
        profilePicture: this.defaultProfilePicture,
      };
      this.profileService
        .updateUserProfile(this.userData._id, updatedData)
        .subscribe({
          next: () => {
            this.openSnackBar('Profil mis à jour avec succès !');

            // Met à jour les données locales pour refléter les changements
            this.userData = { ...this.userData, ...updatedData };

            // Synchronise le formulaire avec les nouvelles données
            this.profileForm.patchValue(this.userData);

            // Sort du mode édition
            this.isEditMode = false;
          },
          error: (err) => {
            console.error('Erreur lors de la mise à jour du profil :', err);
            this.openSnackBar('La mise à jour a échoué.');
          },
        });
    } else {
      this.openSnackBar('Veuillez remplir les champs requis.');
    }
  }

  private _snackBar = inject(MatSnackBar);

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
