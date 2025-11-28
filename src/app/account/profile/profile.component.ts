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
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-profile',
  imports: [
    ReactiveFormsModule,
    SharedMaterialModule,
    MatProgressSpinnerModule
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
    // Retourne le nombre de projets depuis la BDD
    return this.userData?.projects?.length || 0;
  }

  getFriendsCount(): number {
    // Retourne le nombre de contacts depuis la BDD
    return this.userData?.contacts?.length || 0;
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

  getTechLevel(tech: any): number {
    // Retourne le niveau depuis l'objet tech ou calcule une valeur par défaut
    if (typeof tech === 'object' && tech.level !== undefined) {
      return tech.level;
    }

    // Valeur par défaut basée sur la position dans le tableau (les premiers = plus expérimentés)
    const techName = typeof tech === 'string' ? tech : (tech.name || '');
    const index = this.userData?.favoris?.findIndex((f: any) =>
      (typeof f === 'string' ? f : f.name) === techName
    ) ?? 0;

    // Dégressif: les premières technos ont un niveau plus élevé
    return Math.max(50, 90 - (index * 5));
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

  // Méthodes pour les gauges à aiguilles
  getGaugeArc(percentage: number): string {
    // Arc SVG pour la gauge (demi-cercle)
    // Centre: (100, 100), Rayon: 80
    // Départ: 180° (gauche) → (20, 100)
    // Fin: 180° + (percentage/100)*180° → varie jusqu'à 360° (droite) → (180, 100)

    const clampedPercentage = Math.min(Math.max(percentage, 0), 100);

    // Angle de départ: 180° (à gauche, position 9h)
    const startAngle = 180;
    // Angle balayé: de 0° à 180° selon le percentage
    const sweepAngle = (clampedPercentage / 100) * 180;
    const endAngle = startAngle + sweepAngle;

    // Conversion en radians pour le calcul des coordonnées
    const startRad = (startAngle * Math.PI) / 180;
    const endRad = (endAngle * Math.PI) / 180;

    // Point de départ (toujours à gauche)
    const x1 = 100 + 80 * Math.cos(startRad);
    const y1 = 100 + 80 * Math.sin(startRad);

    // Point d'arrivée (varie selon percentage)
    const x2 = 100 + 80 * Math.cos(endRad);
    const y2 = 100 + 80 * Math.sin(endRad);

    // Large arc flag : 0 car on ne dépasse jamais 180°
    return `M ${x1} ${y1} A 80 80 0 0 1 ${x2} ${y2}`;
  }

  getGaugeNeedleX(percentage: number): number {
    // Aiguille suit le même principe que l'arc
    // De 180° à 360° (0°)
    const clampedPercentage = Math.min(Math.max(percentage, 0), 100);
    const angle = 180 + (clampedPercentage / 100) * 180;
    const radians = (angle * Math.PI) / 180;
    return 100 + 70 * Math.cos(radians);
  }

  getGaugeNeedleY(percentage: number): number {
    // Aiguille suit le même principe que l'arc
    // De 180° à 360° (0°)
    const clampedPercentage = Math.min(Math.max(percentage, 0), 100);
    const angle = 180 + (clampedPercentage / 100) * 180;
    const radians = (angle * Math.PI) / 180;
    return 100 + 70 * Math.sin(radians);
  }

  // Méthode pour les couleurs des technologies
  getTechColor(tech: any): string {
    const colors = [
      '#00ff41', '#00bcd4', '#ff6b6b', '#ffa726',
      '#ab47bc', '#26c6da', '#66bb6a', '#ffa726'
    ];
    const techName = typeof tech === 'string' ? tech : (tech.name || tech);
    const index = techName.length % colors.length;
    return colors[index];
  }

  // Méthode pour calculer les jours d'activité
  getDaysActive(): number {
    if (!this.userData?.createdAt) return 0;
    const created = new Date(this.userData.createdAt);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - created.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  }

  // Méthode pour les vues du profil depuis la BDD
  getRandomViews(): number {
    return this.userData?.profileViews || 0;
  }

  // Exposer Math pour le template
  Math = Math;
}
