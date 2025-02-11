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
import {MatTooltipModule} from '@angular/material/tooltip'

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
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatTooltipModule
  ],
  templateUrl: './edit-profile.component.html',
  styleUrl: './edit-profile.component.scss',
})
export class EditProfileComponent {
  profileForm: FormGroup;
  selectedFile!: string;
  profilePicture!: string;
  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<EditProfileComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.profileForm = this.fb.group({
      lastName: [data.lastName || ''],
      firstName: [data.firstName || ''],
      pseudo: [data.pseudo, Validators.required],
      
    });
    this.profilePicture = data.profilePicture;
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0];
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
      profilePicture: this.selectedFile,
    };
    this.dialogRef.close(updatedData);
  }
}
