import { Component } from '@angular/core';
import { MatTabsModule } from '@angular/material/tabs';
import { GlobeComponent } from '../../../composant/globe/globe.component';
import { RouterModule } from '@angular/router';
import { AuthenticationService } from '../../../services/authentication.service';
import { MatCardModule } from '@angular/material/card';
import { CommonModule } from '@angular/common';
import { UserTechPreviewComponent } from '../user-tech-preview/user-tech-preview.component';
import { ProfileService } from '../../../services/profile.service';
import { SeoService } from '../../../services/seo.service';
import { PlatformService } from '../../services/platform.service';
import { StructuredDataService } from '../../services/structured-data.service';
import { Observable, tap } from 'rxjs';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterModule, CommonModule, MatTabsModule, GlobeComponent, MatCardModule, UserTechPreviewComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent {
  authStatus: boolean = false;
  authStatus$: Observable<boolean>;
  userData: any;
  userFavoris: any = [];
  bgLoaded = false;




  constructor(
    private authService: AuthenticationService,
    private profileService: ProfileService,
    private seo: SeoService,
    private platformService: PlatformService,
    private structuredDataService: StructuredDataService
  ) {
    this.authStatus$ = this.authService.getAuthStatus();
  }


  ngOnInit(): void {
    this.preloadBackgroundImage();
    this.seo.updateMetaData({
      title: 'Verstack.io - Suivez les versions de vos langages et frameworks préférés',
      description: 'Maintenez vos applications à jour avec Verstack.io. Suivez les versions de Angular, React, Vue.js, Node.js, Python, Java et plus de 50 langages et frameworks. Gérez vos stacks technologiques et ne manquez aucune mise à jour critique.',
      keywords: 'suivi versions logicielles, gestion stack technique, mise à jour framework, Angular version, React version, Vue.js version, Node.js version, Python version, Java version, gestion dépendances, développement web, DevOps, veille technologique',
      image: this.platformService.isBrowser ? `${this.platformService.getCurrentOrigin()}/assets/slider/slider1.png` : undefined,
      url: 'https://verstack.io/home'
    });

    // Add structured data for home page
    const websiteSchema = this.structuredDataService.createWebSiteSchema();
    const organizationSchema = this.structuredDataService.createOrganizationSchema();
    this.structuredDataService.addStructuredData([websiteSchema, organizationSchema]);

    this.authStatus$.subscribe((status) => {
      if (!status) {
        return;
      }
      this.authStatus = status;
      this.loadUserProfile().subscribe({
        next: () => this.loadUserFavoris(),
        error: (err) => console.error('Erreur lors du chargement du profil utilisateur', err)
      });
    });

    this.userData = this.platformService.getJson<any>('user', null);
    this.userFavoris = this.platformService.getJson<any[]>('favoris', []);
  }


  private loadUserProfile(): Observable<any> {

    const userId = this.authService.getUserId();
    return this.profileService.getUserProfile(userId).pipe(
      tap((response: any) => {
        this.userData = response;
        this.storeUserData(response);
      })
    )
  }

  private loadUserFavoris(): void {
    this.userFavoris = this.platformService.getJson<any[]>('favoris', []);
  }

  private storeUserData(response: any) {
    this.platformService.setJson('favoris', response.favoris);
  }

  private preloadBackgroundImage(): void {
    if (!this.platformService.isBrowser) {
      this.bgLoaded = true;
      return;
    }
    const img = new Image();
    img.src = '/assets/bkg/bkg-home-optimized-1920x1080.webp';
    img.onload = () => {
      this.bgLoaded = true;
    };
  }


}
