import { Component, ElementRef, OnDestroy, OnInit, Renderer2, ViewChild, inject } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { HeaderComponent } from './navigation/header/header.component';
import {MatSidenavModule} from '@angular/material/sidenav';
import { LayoutComponent } from './ui/layout/layout.component';
import { SidenavComponent } from './navigation/sidenav/sidenav.component';
import { CommonModule } from '@angular/common';
import { FooterComponent } from "./navigation/footer/footer.component";
import { SharedModule } from './shared/shared.module';
import { AuthenticationService } from './services/authentication.service';
import { PlatformService } from './core/services/platform.service';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-root',
  imports: [CommonModule, MatSidenavModule, RouterOutlet, LayoutComponent, HeaderComponent, SidenavComponent, SharedModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'verstack-ihm';
  @ViewChild('sidenavContent') sidenavContent!: ElementRef;

  private authService = inject(AuthenticationService);
  private platformService = inject(PlatformService);
  private destroy$ = new Subject<void>();
  private adSenseScriptLoaded = false;

  constructor(private router: Router, private renderer: Renderer2) {}

  ngOnInit(): void {
    if (!this.platformService.isBrowser) return;

    // S'abonner aux changements de rôle de façon réactive
    this.authService.userRoleObservable
      .pipe(takeUntil(this.destroy$))
      .subscribe(role => {
        const shouldShowAds = role !== 'subscriber' && role !== 'admin';

        if (shouldShowAds && !this.adSenseScriptLoaded) {
          // Charger le script AdSense pour les utilisateurs réguliers
          this.loadAdSenseScript();
        } else if (!shouldShowAds && this.adSenseScriptLoaded) {
          // Retirer les publicités existantes pour les subscribers/admins
          this.removeAds();
        }
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private loadAdSenseScript(): void {
    const script = this.renderer.createElement('script');
    script.src = 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-3195351081459490';
    script.async = true;
    script.crossOrigin = 'anonymous';
    this.renderer.appendChild(document.head, script);
    this.adSenseScriptLoaded = true;
  }

  private removeAds(): void {
    // Retirer tous les éléments de pub AdSense du DOM
    const adsElements = document.querySelectorAll('.adsbygoogle, ins[class*="adsbygoogle"]');
    adsElements.forEach(ad => ad.remove());
  }

}
