import { Component, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { MatTabsModule } from '@angular/material/tabs';
import { GlobeComponent } from '../../../composant/globe/globe.component';
import { Router, RouterModule } from '@angular/router';
import { AuthenticationService } from '../../../services/authentication.service';
import { Title, Meta } from '@angular/platform-browser';
import { MatCardModule } from '@angular/material/card';
import { CommonModule } from '@angular/common';
import { VersionComponent } from '../version/version.component';
import { LangagesService } from '../../../services/langages.service';
import { ProfileService } from '../../../services/profile.service';
import { SeoService } from '../../../services/seo.service';
import { Observable, tap } from 'rxjs';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterModule, CommonModule, MatTabsModule, GlobeComponent, MatCardModule, VersionComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent {
  authStatus: boolean = false;
  authStatus$: Observable<boolean>;
  userData: any;
  userFavoris: any = [];




  private isBrowser: boolean;

  constructor(
    private authService: AuthenticationService,
    private router: Router,
    private title: Title, private meta: Meta,
    private _langagesService: LangagesService,
    private profileService: ProfileService,
    private seo: SeoService,
    @Inject(PLATFORM_ID) platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
    this.authStatus$ = this.authService.getAuthStatus();
  }

  ngOnInit(): void {
    this.seo.updateMetaData({
      title: 'Accueil – Verstack.io',
      description: 'Découvrez les meilleurs outils et stacks pour développeurs modernes.',
      keywords: 'verstack, langages, outils, développeurs, Angular, React',
      image: this.isBrowser ? `${window.location.origin}/assets/slider/slider-1.jpg` : undefined,
      url: 'https://verstack.io/home'
    });

    this.authService.getAuthStatus().subscribe((status) => {
      if (status) {
        console.log('Utilisateur authentifié');
        this.authStatus = status;
        this.loadUserProfile().subscribe({
          next: () => {
            this.loadUserFavoris();
          },
          error: (err) => {
            console.error('Erreur lors du chargement du profil utilisateur', err);
          }
        });
      }
    });

    const storedUserData = this.isBrowser ? localStorage.getItem('user') : null;
    if (storedUserData) {
      this.userData = JSON.parse(storedUserData);
    } else {
      this.userData = null;
    }

    // Always initialize userFavoris as an array to avoid null issues
    const storedUserFavoris = this.isBrowser ? localStorage.getItem('favoris') : null;
    if (storedUserFavoris) {
      try {
        this.userFavoris = JSON.parse(storedUserFavoris) || [];
      } catch {
        this.userFavoris = [];
      }
    } else {
      this.userFavoris = [];
    }
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
    const storedUserFavoris = this.isBrowser ? localStorage.getItem('favoris') : null;

    if (storedUserFavoris && storedUserFavoris.length !== 0) {
      this.userFavoris = JSON.parse(storedUserFavoris || '[]');
    } else {
      this.userFavoris = JSON.parse(storedUserFavoris || '[]');
    }
  }

  private storeUserData(response: any) {
    if (this.isBrowser) {
      localStorage.setItem('favoris', JSON.stringify(response.favoris));
    }
  }


}
