import { Component, inject, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { AuthenticationService } from '../../services/authentication.service';
import { ProfileService } from '../../services/profile.service';
import { MatDialog } from '@angular/material/dialog';
import { EditProfileComponent } from './edit-profile/edit-profile.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SharedMaterialModule } from '../../shared/material.module';
import { PlatformService } from '../../core/services/platform.service';
import { SeoService } from '../../services/seo.service';
import { UserProfile } from '../../models/user.interface';

@Component({
  selector: 'app-profile',
  imports: [
    ReactiveFormsModule,
    SharedMaterialModule
  ],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss',
})
export class ProfileComponent implements OnInit {
  profileForm: FormGroup;
  isEditMode: boolean = false;
  defaultProfilePicture: string = 'https://placehold.co/10x10';
  favoris: string[] = [];
  userData: UserProfile | null = null;
  activeTab: string = 'overview';
  selectedTabIndex: number = 0;

  constructor(
    private fb: FormBuilder,
    private profileService: ProfileService,
    private authService: AuthenticationService,
    private dialog: MatDialog,
    private platformService: PlatformService,
    private seoService: SeoService
  ) {
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
    this.initSEO();
  }

  private initSEO(): void {
    this.seoService.updateMetaData({
      title: 'Mon Profil - Verstack.io',
      description: 'Gérez votre profil développeur, vos technologies favorites et vos projets sur Verstack.io',
      keywords: 'profil développeur, technologies, favoris, projets, compétences',
      url: 'https://verstack.io/profile',
      image: this.platformService.isBrowser ? `${this.platformService.getCurrentOrigin()}/assets/icons/logo-banniere-RS.png` : undefined
    });
  }

  loadUserProfile() {
    const userId = this.authService.getUserId();
    this.profileService.getUserProfile(userId).subscribe({
      next: (data: UserProfile) => {
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
    if (!this.userData) return;
    
    const dialogRef = this.dialog.open(EditProfileComponent, {
      data: { ...this.userData },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.profileService
          .updateUserProfile(this.userData!._id, result)
          .subscribe(() => {
            this.openSnackBar('Profil mis à jour avec succès !');
            this.loadUserProfile(); // Recharger les données utilisateur
          });
      }
    });
  }

  private storeUserData(response: UserProfile) {
    this.platformService.setJson('user', response);
    this.platformService.setJson('favoris', response.favoris);
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
    if (this.userData) {
      this.profileForm.patchValue(this.userData); // Restaurer les anciennes données
    }
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
        .updateUserProfile(this.userData!._id, updatedData)
        .subscribe({
          next: () => {
            this.openSnackBar('Profil mis à jour avec succès !');

            // Met à jour les données locales pour refléter les changements
            this.userData = { ...this.userData, ...updatedData };

            // Synchronise le formulaire avec les nouvelles données
            if (this.userData) {
              this.profileForm.patchValue(this.userData);
            }

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
    if (!this.platformService.isBrowser) return;
    this._snackBar.open(message, '', {
      duration: this.durationInSeconds * 1000,
      horizontalPosition: 'center',
      verticalPosition: 'top',
    });
  }

  // Navigation methods
  setActiveTab(tab: string) {
    this.activeTab = tab;
  }

  getTabIndex(): number {
    return this.selectedTabIndex;
  }

  onTabChange(event: any): void {
    this.selectedTabIndex = event.index;
    const tabs = ['overview', 'stack', 'projects', 'activity'];
    this.activeTab = tabs[event.index] || 'overview';
  }

  // Profile utility methods
  getUserRole(): string {
    if (this.userData?.role) {
      return this.userData.role;
    }
    // Détermine le rôle basé sur les données utilisateur
    const techCount = this.userData?.favoris?.length || 0;
    if (techCount >= 10) return 'Expert Développeur';
    if (techCount >= 5) return 'Développeur Senior';
    if (techCount >= 2) return 'Développeur';
    return 'Débutant';
  }

  formatDate(date: any): string {
    if (!date) return 'Non renseigné';
    return new Date(date).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long'
    });
  }

  getProjectCount(): number {
    // Pour la démo, retourne un nombre basé sur les technologies
    return Math.floor((this.userData?.favoris?.length || 0) / 2) + 2;
  }

  getFriendsCount(): number {
    // Simulation d'un nombre d'amis pour la démo
    return Math.floor(Math.random() * 20) + 5;
  }

  getExperienceLevel(): number {
    // Calcule le niveau d'expérience basé sur les données
    const techCount = this.userData?.favoris?.length || 0;
    return Math.min(Math.floor(techCount / 2) + 1, 10);
  }

  // Avatar methods
  changeAvatar(): void {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = (event: any) => {
      const file = event.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e: any) => {
          this.defaultProfilePicture = e.target.result;
          // Ici vous pourriez aussi mettre à jour le profil via le service
          this.openSnackBar('Avatar mis à jour !');
        };
        reader.readAsDataURL(file);
      }
    };
    input.click();
  }

  shareProfile(): void {
    if (!this.platformService.isBrowser) return;
    
    const currentUrl = this.platformService.getCurrentUrl();
    if (navigator.share) {
      navigator.share({
        title: `Profil de ${this.userData?.pseudo}`,
        text: `Découvrez le profil de ${this.userData?.pseudo} sur Verstack`,
        url: currentUrl
      });
    } else {
      // Fallback pour les navigateurs qui ne supportent pas l'API Share
      navigator.clipboard.writeText(currentUrl);
      this.openSnackBar('Lien du profil copié dans le presse-papiers !');
    }
  }

  // Stack/Technology methods
  addTechnology(): void {
    this.openSnackBar('Fonction d\'ajout de technologie en développement');
    // TODO: Implémenter un dialog pour ajouter une technologie
  }

  getTechLevel(techName: string): number {
    // Simule un niveau de compétence pour la démo
    const levels = ['Angular', 'TypeScript', 'JavaScript', 'HTML', 'CSS'];
    const baseLevel = levels.includes(techName) ? 80 : 60;
    return baseLevel + Math.floor(Math.random() * 20);
  }

  getLevelText(level: number): string {
    if (level >= 90) return 'Expert';
    if (level >= 70) return 'Avancé';
    if (level >= 50) return 'Intermédiaire';
    if (level >= 30) return 'Débutant';
    return 'Novice';
  }

  // Project methods
  addProject(): void {
    this.openSnackBar('Fonction d\'ajout de projet en développement');
    // TODO: Implémenter un dialog pour ajouter un projet
  }

  viewProject(projectId: string): void {
    this.openSnackBar(`Consultation du projet ${projectId}`);
    // TODO: Naviguer vers la page du projet
  }

  editProject(projectId: string): void {
    this.openSnackBar(`Modification du projet ${projectId}`);
    // TODO: Ouvrir le dialog d'édition du projet
  }

  // Utility methods for statistics
  getProfileCompletion(): number {
    if (!this.userData) return 0;
    
    let completion = 0;
    const fields: (keyof UserProfile)[] = ['pseudo', 'email', 'job'];
    
    fields.forEach(field => {
      if (this.userData![field]) completion += 25;
    });
    
    // Vérification des favoris
    if (this.userData.favoris?.length > 0) completion += 25;
    
    return completion;
  }

  getActivityScore(): number {
    // Calcule un score d'activité basé sur diverses métriques
    const techCount = this.userData?.favoris?.length || 0;
    const projectCount = this.getProjectCount();
    const profileCompletion = this.getProfileCompletion();
    
    return Math.min((techCount * 10) + (projectCount * 5) + profileCompletion, 100);
  }

  // Achievement methods
  hasAchievement(achievementId: string): boolean {
    // Logique simple pour déterminer si un achievement est débloqué
    switch (achievementId) {
      case 'first-code':
        return (this.userData?.favoris?.length || 0) > 0;
      case 'full-stack':
        return (this.userData?.favoris?.length || 0) >= 5;
      case 'progress':
        return this.getProfileCompletion() >= 80;
      case 'social':
        return this.getFriendsCount() >= 10;
      case 'expert':
        return (this.userData?.favoris?.length || 0) >= 10;
      case 'productive':
        return this.getProjectCount() >= 20;
      default:
        return false;
    }
  }

  getAchievementProgress(achievementId: string): string {
    switch (achievementId) {
      case 'social':
        return `${this.getFriendsCount()}/10`;
      case 'expert':
        return `${this.userData?.favoris?.length || 0}/10`;
      case 'productive':
        return `${this.getProjectCount()}/20`;
      default:
        return '0/1';
    }
  }

  // Settings/Preferences methods
  toggleNotification(type: string): void {
    this.openSnackBar(`Notifications ${type} mises à jour`);
    // TODO: Mettre à jour les préférences utilisateur
  }

  togglePrivacy(setting: string): void {
    this.openSnackBar(`Paramètre de confidentialité ${setting} mis à jour`);
    // TODO: Mettre à jour les paramètres de confidentialité
  }

  // Data export methods
  exportProfile(): void {
    const profileData = {
      user: this.userData,
      stats: {
        technologies: this.userData?.favoris?.length || 0,
        projects: this.getProjectCount(),
        friends: this.getFriendsCount(),
        level: this.getExperienceLevel()
      },
      exportDate: new Date().toISOString()
    };

    const dataStr = JSON.stringify(profileData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `profil_${this.userData?.pseudo || 'user'}_${Date.now()}.json`;
    link.click();
    URL.revokeObjectURL(url);

    this.openSnackBar('Profil exporté avec succès !');
  }
}
