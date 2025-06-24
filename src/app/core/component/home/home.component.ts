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
  bgLoaded = false;




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

  private getLocalStorageItem(key: string): string | null {
    return this.isBrowser ? localStorage.getItem(key) : null;
  }

  private setLocalStorageItem(key: string, value: string): void {
    if (this.isBrowser) {
      localStorage.setItem(key, value);
    }
  }

  private getJson<T>(key: string, defaultValue: T): T {
    const item = this.getLocalStorageItem(key);
    if (!item) {
      return defaultValue;
    }
    try {
      return JSON.parse(item) as T;
    } catch {
      return defaultValue;
    }
  }

  ngOnInit(): void {
    this.preloadBackgroundImage();
    this.seo.updateMetaData({
      title: 'Accueil – Verstack.io',
      description: 'Découvrez les meilleurs outils et stacks pour développeurs modernes.Maintenez vos applications: suivez régulièrement les versions de langage et de framework ',
      keywords: `verstack, langages, outils, développeurs, version Angular, version React, version Vue.js, version Node.js, version Python, version Java,
      version C#, version PHP, version Ruby, version Go, version Rust, version JavaScript, version TypeScript, version Bash, version Shell, version Perl,
      version Kotlin, version Swift, version Scala, version Dart, version Objective-C, version C, version C++, version R, version MATLAB, version Julia,
      version Haskell, version Elixir, version Erlang, version F#, version Groovy, version PowerShell, version Assembly, version SQL, version HTML,
      version CSS, version SASS, version LESS, version Docker, version Kubernetes, version Terraform, version Ansible, version Jenkins, version Git,
      version GitHub Actions, version Travis CI, version CircleCI, version Webpack, version Babel, version ESLint, version Prettier, version Nginx,
      version Apache, version PostgreSQL, version MySQL, version MongoDB, version Redis, version GraphQL, version Firebase, version Supabase,
      version Netlify, version Vercel, version AWS, version Azure, version GCP, outils de développement, gestion de versions, mise à jour des stacks,
      suivi des versions, gestion des dépendances, développement web,
      développement logiciel, développement mobile, développement backend, développement frontend, outils de productivité, gestion de projet,
      collaboration en équipe, intégration continue, déploiement continu , DevOps, meilleures pratiques de développement, ressources pour développeurs,
      communauté de développeurs`,
      image: this.isBrowser ? `${window.location.origin}/assets/slider/slider1.png` : undefined,
      url: 'https://verstack.io/home'
    });

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

    this.userData = this.getJson<any>('user', null);
    this.userFavoris = this.getJson<any[]>('favoris', []);
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
    this.userFavoris = this.getJson<any[]>('favoris', []);
  }

  private storeUserData(response: any) {
    this.setLocalStorageItem('favoris', JSON.stringify(response.favoris));
  }

  private preloadBackgroundImage(): void {
    if (!this.isBrowser) {
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
