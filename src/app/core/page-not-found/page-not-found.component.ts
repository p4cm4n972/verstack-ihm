import { Component, OnDestroy, OnInit } from '@angular/core';

import { Router, RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-page-not-found',
  imports: [
    RouterModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule
],
  templateUrl: './page-not-found.component.html',
  styleUrl: './page-not-found.component.scss'
})
export class PageNotFoundComponent implements OnInit, OnDestroy {
  currentUrl: string = '';
  glitchText: string = '404';
  private glitchIntervalId: ReturnType<typeof setInterval> | null = null;

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.currentUrl = this.router.url;
    this.startGlitchAnimation();
  }

  private startGlitchAnimation(): void {
    const chars = '!<>-_\\/[]{}—=+*^?#________';
    let iteration = 0;

    this.glitchIntervalId = setInterval(() => {
      this.glitchText = '404'
        .split('')
        .map((char, index) => {
          if (index < iteration) {
            return '404'[index];
          }
          return chars[Math.floor(Math.random() * chars.length)];
        })
        .join('');

      if (iteration >= 3) {
        this.clearGlitchInterval();
        this.glitchText = '404';
      }

      iteration += 1 / 3;
    }, 30);
  }

  private clearGlitchInterval(): void {
    if (this.glitchIntervalId !== null) {
      clearInterval(this.glitchIntervalId);
      this.glitchIntervalId = null;
    }
  }

  ngOnDestroy(): void {
    this.clearGlitchInterval();
  }

  goToHome(): void {
    this.router.navigate(['/home']);
  }

  goBack(): void {
    window.history.back();
  }

  popularPages = [
    { label: 'Accueil', route: '/home', icon: 'home' },
    { label: 'Stack', route: '/version', icon: 'devices' },
    { label: 'Évolution', route: '/stat', icon: 'insert_chart' },
    { label: 'Actualités', route: '/news', icon: 'newspaper' },
    { label: 'Boutique', route: '/shop', icon: 'storefront' }
  ];
}
