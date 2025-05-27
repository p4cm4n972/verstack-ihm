import { Component } from '@angular/core';
import { MatTabsModule } from '@angular/material/tabs';
import { GlobeComponent } from '../../../composant/globe/globe.component';
import { TapeTextConsoleComponent } from '../../../composant/tape-text-console/tape-text-console.component';
import { Router, RouterModule } from '@angular/router';
import { AuthenticationService } from '../../../services/authentication.service';
import { Title, Meta } from '@angular/platform-browser';
import { MatCardModule } from '@angular/material/card';
import { CommonModule } from '@angular/common';
import { VersionComponent } from '../version/version.component';
import { LangagesService } from '../../../services/langages.service';
import { ProfileService } from '../../../services/profile.service';
import { SeoService } from '../../../services/seo.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterModule, CommonModule, MatTabsModule, GlobeComponent, MatCardModule, VersionComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent {
  authStatus: boolean = false;
  userData: any;
  userFavoris: any;

  constructor(
    private authService: AuthenticationService,
    private router: Router,
    private title: Title, private meta: Meta,
    private _langagesService: LangagesService,
    private profileService: ProfileService,
    private seo: SeoService
  ) { }

  ngOnInit(): void {
    this.seo.updateMetaData({
    title: 'Accueil – Verstack.io',
    description: 'Découvrez les meilleurs outils et stacks pour développeurs modernes.',
    keywords: 'verstack, langages, outils, développeurs, Angular, React',
    image: 'public/assets/slider/slider-1.jpg',
    url: 'https://verstack.io'
  });
    this.authService.getAuthStatus().subscribe((status) => {
      if (status) {
        this.authStatus = status;
        this.loadUserProfile()
        this.loadUserFavoris();
      }
    });
    const storedUserData = localStorage.getItem('user');
    if (storedUserData) {
      this.userData = JSON.parse(storedUserData);
    } else {
      this.userData = null;
    }
  }

  private loadUserProfile(): void {
    if (this.userData?.id) {
      this.profileService.getUserProfile(this.userData.id).subscribe({
        next: (data) => {
          this.userData = data;
          this.storeUserData(data);
        },
        error: (err) =>
          console.error(
            'Erreur lors de la récupération des données utilisateur',
            err
          ),
      });
    }
  }

  private loadUserFavoris(): void {
    const storedUserFavoris = localStorage.getItem('favoris');

    if (storedUserFavoris && storedUserFavoris.length !== 0) {
      this.userFavoris = JSON.parse(localStorage.getItem('favoris') || '[]');
    } else {
      this.userFavoris = null;
    }
  }

  private storeUserData(response: any) {
    localStorage.setItem('favoris', JSON.stringify(response.favoris));
  }


}
