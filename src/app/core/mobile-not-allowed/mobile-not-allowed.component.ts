import { isPlatformBrowser } from '@angular/common';
import { Component, Inject, PLATFORM_ID } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatTab, MatTabGroup } from '@angular/material/tabs';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-mobile-not-allowed',
  imports: [RouterModule, MatTabGroup, MatTab, MatButtonModule],
  templateUrl: './mobile-not-allowed.component.html',
  styleUrl: './mobile-not-allowed.component.scss'
})
export class MobileNotAllowedComponent {
  isMobile!: boolean;
  selectedIndex = 0;
  autoplayInterval: any;
  slides = [
    {
      img: 'assets/slider/slide1.png',
      title: 'Bienvenue sur Verstack',
      text: 'Une plateforme dédiée !'
    },
    {
      img: 'assets/slider/slide2.png',
      title: 'Pas d’app, juste du code',
      text: 'Ici on parle framework, backend, frontend, et clavier mécanique.'
    },
    {
      img: 'assets/slider/slide3.png',
      title: 'Passe au bureau',
      text: 'Tu veux rentrer dans le rectangle ? Oublie ton mobile. Connecte-toi depuis un ordi.'
    }
  ];

  constructor(
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    if (isPlatformBrowser(this.platformId)) {
      this.startAutoplay();
    }
  }

  redirectToDesktop() {
    this.router.navigate(['/manifeste']);
  }

  startAutoplay() {
    if (isPlatformBrowser(this.platformId)) {
      this.autoplayInterval = setInterval(() => {
        this.selectedIndex = (this.selectedIndex + 1) % this.slides.length;
      }, 4000);
    }
  }

  stopAutoplay() {
    if (this.autoplayInterval) {
      clearInterval(this.autoplayInterval);
    }
  }

  ngOnDestroy(): void {
    this.stopAutoplay();
  }
}
