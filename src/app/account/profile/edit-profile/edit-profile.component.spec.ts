import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

import { EditProfileComponent } from './edit-profile.component';

describe('EditProfileComponent', () => {
  let component: EditProfileComponent;
  let fixture: ComponentFixture<EditProfileComponent>;
  let mockDialogRef: jasmine.SpyObj<MatDialogRef<EditProfileComponent>>;

  const mockDialogData = {
    pseudo: 'testuser',
    email: 'test@example.com',
    firstName: 'John',
    lastName: 'Doe',
    job: 'frontend',
    experience: '2-3',
    salaryRange: '40-50k',
    ageRange: '25-34',
    profilePicture: 'https://example.com/avatar.jpg'
  };

  beforeEach(async () => {
    mockDialogRef = jasmine.createSpyObj('MatDialogRef', ['close']);

    await TestBed.configureTestingModule({
      imports: [
        EditProfileComponent,
        ReactiveFormsModule,
        NoopAnimationsModule
      ],
      providers: [
        { provide: MatDialogRef, useValue: mockDialogRef },
        { provide: MAT_DIALOG_DATA, useValue: mockDialogData }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(EditProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  describe('Component Creation', () => {
    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should have a profile form', () => {
      expect(component.profileForm).toBeTruthy();
    });
  });

  describe('Form Initialization', () => {
    it('should initialize form with provided data', () => {
      expect(component.profileForm.get('pseudo')?.value).toBe('testuser');
      expect(component.profileForm.get('email')?.value).toBe('test@example.com');
      expect(component.profileForm.get('firstName')?.value).toBe('John');
      expect(component.profileForm.get('lastName')?.value).toBe('Doe');
      expect(component.profileForm.get('job')?.value).toBe('frontend');
      expect(component.profileForm.get('experience')?.value).toBe('2-3');
      expect(component.profileForm.get('salaryRange')?.value).toBe('40-50k');
      expect(component.profileForm.get('ageRange')?.value).toBe('25-34');
    });

    it('should set profilePicture from data', () => {
      expect(component.profilePicture).toBe('https://example.com/avatar.jpg');
    });

    it('should initialize with empty values when data is missing', async () => {
      const emptyDataFixture = TestBed.createComponent(EditProfileComponent);
      // Override the injected data
      TestBed.resetTestingModule();
      await TestBed.configureTestingModule({
        imports: [
          EditProfileComponent,
          ReactiveFormsModule,
          NoopAnimationsModule
        ],
        providers: [
          { provide: MatDialogRef, useValue: mockDialogRef },
          { provide: MAT_DIALOG_DATA, useValue: { pseudo: 'minimal' } }
        ]
      }).compileComponents();

      const minimalFixture = TestBed.createComponent(EditProfileComponent);
      const minimalComponent = minimalFixture.componentInstance;
      minimalFixture.detectChanges();

      expect(minimalComponent.profileForm.get('pseudo')?.value).toBe('minimal');
      expect(minimalComponent.profileForm.get('email')?.value).toBe('');
      expect(minimalComponent.profileForm.get('firstName')?.value).toBe('');
      expect(minimalComponent.profileForm.get('lastName')?.value).toBe('');
      expect(minimalComponent.profileForm.get('job')?.value).toBe('');
      expect(minimalComponent.profileForm.get('experience')?.value).toBe('');
      expect(minimalComponent.profileForm.get('salaryRange')?.value).toBe('');
      expect(minimalComponent.profileForm.get('ageRange')?.value).toBe('');
    });
  });

  describe('Form Validation', () => {
    it('should require pseudo field', () => {
      const pseudoControl = component.profileForm.get('pseudo');
      pseudoControl?.setValue('');
      expect(pseudoControl?.valid).toBeFalse();
      expect(pseudoControl?.errors?.['required']).toBeTrue();
    });

    it('should be valid when pseudo is provided', () => {
      const pseudoControl = component.profileForm.get('pseudo');
      pseudoControl?.setValue('newuser');
      expect(pseudoControl?.valid).toBeTrue();
    });

    it('should have valid form when all required fields are filled', () => {
      expect(component.profileForm.valid).toBeTrue();
    });

    it('should have invalid form when pseudo is empty', () => {
      component.profileForm.get('pseudo')?.setValue('');
      expect(component.profileForm.valid).toBeFalse();
    });
  });

  describe('Form Fields', () => {
    it('should have all expected form controls', () => {
      expect(component.profileForm.get('pseudo')).toBeTruthy();
      expect(component.profileForm.get('email')).toBeTruthy();
      expect(component.profileForm.get('firstName')).toBeTruthy();
      expect(component.profileForm.get('lastName')).toBeTruthy();
      expect(component.profileForm.get('job')).toBeTruthy();
      expect(component.profileForm.get('experience')).toBeTruthy();
      expect(component.profileForm.get('salaryRange')).toBeTruthy();
      expect(component.profileForm.get('ageRange')).toBeTruthy();
    });

    it('should allow updating form values', () => {
      component.profileForm.patchValue({
        pseudo: 'updateduser',
        email: 'updated@example.com',
        job: 'backend'
      });

      expect(component.profileForm.get('pseudo')?.value).toBe('updateduser');
      expect(component.profileForm.get('email')?.value).toBe('updated@example.com');
      expect(component.profileForm.get('job')?.value).toBe('backend');
    });
  });

  describe('Options Arrays', () => {
    it('should have job options', () => {
      expect(component.jobOptions.length).toBeGreaterThan(0);
      expect(component.jobOptions.some(j => j.value === 'frontend')).toBeTrue();
      expect(component.jobOptions.some(j => j.value === 'backend')).toBeTrue();
      expect(component.jobOptions.some(j => j.value === 'fullstack')).toBeTrue();
    });

    it('should have experience options', () => {
      expect(component.experienceOptions.length).toBeGreaterThan(0);
      expect(component.experienceOptions.some(e => e.value === '0-1')).toBeTrue();
      expect(component.experienceOptions.some(e => e.value === '10+')).toBeTrue();
    });

    it('should have salary options', () => {
      expect(component.salaryOptions.length).toBeGreaterThan(0);
      expect(component.salaryOptions.some(s => s.value === '0-30k')).toBeTrue();
      expect(component.salaryOptions.some(s => s.value === '80k+')).toBeTrue();
    });

    it('should have age options', () => {
      expect(component.ageOptions.length).toBeGreaterThan(0);
      expect(component.ageOptions.some(a => a.value === '18-24')).toBeTrue();
      expect(component.ageOptions.some(a => a.value === '55+')).toBeTrue();
    });
  });

  describe('Profile Picture - onFileSelected', () => {
    it('should not update selectedFile when no file is selected', () => {
      const event = { target: { files: [] } };
      component.onFileSelected(event);
      expect(component.selectedFile).toBeUndefined();
    });

    it('should not update selectedFile when files array is null', () => {
      const event = { target: { files: null } };
      component.onFileSelected(event);
      expect(component.selectedFile).toBeUndefined();
    });

    it('should read file and set selectedFile as base64 data URL', fakeAsync(() => {
      const mockFile = new File(['test image content'], 'test.png', { type: 'image/png' });
      const mockBase64 = 'data:image/png;base64,dGVzdCBpbWFnZSBjb250ZW50';

      // Create a mock FileReader
      const mockFileReader = {
        result: mockBase64,
        onload: null as ((event: ProgressEvent<FileReader>) => void) | null,
        readAsDataURL: function(file: Blob) {
          // Simulate async file reading
          setTimeout(() => {
            if (this.onload) {
              this.onload({ target: { result: this.result } } as ProgressEvent<FileReader>);
            }
          }, 0);
        }
      };

      spyOn(window, 'FileReader').and.returnValue(mockFileReader as unknown as FileReader);

      const event = { target: { files: [mockFile] } };
      component.onFileSelected(event);

      tick(10); // Allow async operation to complete

      expect(component.selectedFile).toBe(mockBase64);
    }));

    it('should handle jpeg image type', fakeAsync(() => {
      const mockFile = new File(['content'], 'test.jpg', { type: 'image/jpeg' });
      const mockBase64 = 'data:image/jpeg;base64,Y29udGVudA==';

      const mockFileReader = {
        result: mockBase64,
        onload: null as ((event: ProgressEvent<FileReader>) => void) | null,
        readAsDataURL: function() {
          setTimeout(() => {
            if (this.onload) {
              this.onload({ target: { result: this.result } } as ProgressEvent<FileReader>);
            }
          }, 0);
        }
      };

      spyOn(window, 'FileReader').and.returnValue(mockFileReader as unknown as FileReader);

      const event = { target: { files: [mockFile] } };
      component.onFileSelected(event);

      tick(10);

      expect(component.selectedFile).toBe(mockBase64);
    }));
  });

  describe('saveChanges', () => {
    it('should close dialog with updated form data', () => {
      component.profileForm.patchValue({
        pseudo: 'newpseudo',
        email: 'new@example.com',
        firstName: 'Jane',
        lastName: 'Smith',
        job: 'devops',
        experience: '6-10',
        salaryRange: '60-80k',
        ageRange: '35-44'
      });

      component.saveChanges();

      expect(mockDialogRef.close).toHaveBeenCalledWith({
        pseudo: 'newpseudo',
        email: 'new@example.com',
        firstName: 'Jane',
        lastName: 'Smith',
        job: 'devops',
        experience: '6-10',
        salaryRange: '60-80k',
        ageRange: '35-44',
        profilePicture: 'https://example.com/avatar.jpg',
        useGravatar: false
      });
    });

    it('should include new profile picture when file is selected', fakeAsync(() => {
      const mockBase64 = 'data:image/png;base64,newimagedata';

      const mockFileReader = {
        result: mockBase64,
        onload: null as ((event: ProgressEvent<FileReader>) => void) | null,
        readAsDataURL: function() {
          setTimeout(() => {
            if (this.onload) {
              this.onload({ target: { result: this.result } } as ProgressEvent<FileReader>);
            }
          }, 0);
        }
      };

      spyOn(window, 'FileReader').and.returnValue(mockFileReader as unknown as FileReader);

      const mockFile = new File(['new image'], 'new.png', { type: 'image/png' });
      component.onFileSelected({ target: { files: [mockFile] } });

      tick(10);

      component.saveChanges();

      expect(mockDialogRef.close).toHaveBeenCalledWith(
        jasmine.objectContaining({
          profilePicture: mockBase64
        })
      );
    }));

    it('should keep existing profile picture when no new file is selected', () => {
      component.saveChanges();

      expect(mockDialogRef.close).toHaveBeenCalledWith(
        jasmine.objectContaining({
          profilePicture: 'https://example.com/avatar.jpg'
        })
      );
    });

    it('should include all form fields in saved data', () => {
      component.saveChanges();

      const savedData = mockDialogRef.close.calls.mostRecent().args[0];

      expect(savedData).toEqual(jasmine.objectContaining({
        pseudo: jasmine.any(String),
        email: jasmine.any(String),
        firstName: jasmine.any(String),
        lastName: jasmine.any(String),
        job: jasmine.any(String),
        experience: jasmine.any(String),
        salaryRange: jasmine.any(String),
        ageRange: jasmine.any(String),
        profilePicture: jasmine.any(String)
      }));
    });
  });

  describe('Dialog Actions', () => {
    it('should have access to dialogRef for closing', () => {
      expect(component.dialogRef).toBeTruthy();
    });

    it('should close dialog when close is called', () => {
      component.dialogRef.close();
      expect(mockDialogRef.close).toHaveBeenCalled();
    });

    it('should close dialog with no data when cancelled', () => {
      component.dialogRef.close();
      expect(mockDialogRef.close).toHaveBeenCalledWith();
    });
  });

  describe('Gravatar Functionality', () => {
    it('should initialize useGravatar from data', () => {
      expect(component.useGravatar).toBeFalse(); // Default when not provided
    });

    it('should generate gravatar URL on init', () => {
      expect(component.gravatarUrl).toContain('https://www.gravatar.com/avatar/');
    });

    it('should enable gravatar when useGravatarAvatar is called', () => {
      component.useGravatarAvatar();
      expect(component.useGravatar).toBeTrue();
    });

    it('should clear selected file when using gravatar', () => {
      component.selectedFile = 'data:image/png;base64,test';
      component.useGravatarAvatar();
      expect(component.selectedFile).toBe('');
    });

    it('should disable gravatar when uploading a file', fakeAsync(() => {
      component.useGravatar = true;

      const mockBase64 = 'data:image/png;base64,uploaded';
      const mockFileReader = {
        result: mockBase64,
        onload: null as ((event: ProgressEvent<FileReader>) => void) | null,
        readAsDataURL: function() {
          setTimeout(() => {
            if (this.onload) {
              this.onload({ target: { result: this.result } } as ProgressEvent<FileReader>);
            }
          }, 0);
        }
      };

      spyOn(window, 'FileReader').and.returnValue(mockFileReader as unknown as FileReader);

      const mockFile = new File(['content'], 'test.png', { type: 'image/png' });
      component.onFileSelected({ target: { files: [mockFile] } });

      tick(10);

      expect(component.useGravatar).toBeFalse();
    }));

    it('should clear avatar when clearAvatar is called', () => {
      component.useGravatar = true;
      component.selectedFile = 'data:image/png;base64,test';
      component.profilePicture = 'https://example.com/avatar.jpg';

      component.clearAvatar();

      expect(component.useGravatar).toBeFalse();
      expect(component.selectedFile).toBe('');
      expect(component.profilePicture).toBe('');
    });

    describe('getDisplayAvatar', () => {
      it('should return selectedFile when available', () => {
        component.selectedFile = 'data:image/png;base64,uploaded';
        component.useGravatar = true;
        component.profilePicture = 'https://example.com/avatar.jpg';

        expect(component.getDisplayAvatar()).toBe('data:image/png;base64,uploaded');
      });

      it('should return gravatar URL when useGravatar is true and no file selected', () => {
        component.selectedFile = '';
        component.useGravatar = true;
        component.gravatarUrl = 'https://www.gravatar.com/avatar/abc123';
        component.profilePicture = 'https://example.com/avatar.jpg';

        expect(component.getDisplayAvatar()).toBe('https://www.gravatar.com/avatar/abc123');
      });

      it('should return profilePicture when no file and gravatar disabled', () => {
        component.selectedFile = '';
        component.useGravatar = false;
        component.profilePicture = 'https://example.com/avatar.jpg';

        expect(component.getDisplayAvatar()).toBe('https://example.com/avatar.jpg');
      });

      it('should return placeholder when nothing is set', () => {
        component.selectedFile = '';
        component.useGravatar = false;
        component.profilePicture = '';

        expect(component.getDisplayAvatar()).toBe('https://placehold.co/120x120');
      });
    });

    it('should include useGravatar in saved data', () => {
      component.useGravatar = true;
      component.saveChanges();

      expect(mockDialogRef.close).toHaveBeenCalledWith(
        jasmine.objectContaining({
          useGravatar: true
        })
      );
    });

    it('should clear profilePicture when saving with gravatar enabled', () => {
      component.useGravatar = true;
      component.selectedFile = '';
      component.profilePicture = 'https://example.com/avatar.jpg';

      component.saveChanges();

      expect(mockDialogRef.close).toHaveBeenCalledWith(
        jasmine.objectContaining({
          profilePicture: '',
          useGravatar: true
        })
      );
    });
  });
});
