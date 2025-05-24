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
  ) { }

  ngOnInit(): void {
    this.title.setTitle('Verstack.io – L’univers des stacks');
    this.meta.addTags([
      { name: 'description', content: 'Référentiel des dernières versions à jour pour tous les langages et frameworks.' },
      { name: 'keywords', content: 'frameworks, langages, versions, verstack, Angular, React, Node.js, javascript, JS, JAVA, PHP' }
    ]);
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
