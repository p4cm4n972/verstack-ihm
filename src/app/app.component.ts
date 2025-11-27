import { Component, ElementRef, OnInit, Renderer2, ViewChild, inject } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { HeaderComponent } from './navigation/header/header.component';
import {MatSidenavModule} from '@angular/material/sidenav';
import { LayoutComponent } from './ui/layout/layout.component';
import { SidenavComponent } from './navigation/sidenav/sidenav.component';
import { CommonModule } from '@angular/common';
import { FooterComponent } from "./navigation/footer/footer.component";
import { SharedModule } from './shared/shared.module';
import { AdvertisementService } from './services/advertisement.service';
import { PlatformService } from './core/services/platform.service';

@Component({
  selector: 'app-root',
  imports: [CommonModule, MatSidenavModule, RouterOutlet, LayoutComponent, HeaderComponent, SidenavComponent, SharedModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  title = 'verstack-ihm';
  @ViewChild('sidenavContent') sidenavContent!: ElementRef;

  private adService = inject(AdvertisementService);
  private platformService = inject(PlatformService);

  constructor(private router: Router, private renderer: Renderer2) {}

  ngOnInit(): void {
    // Charger le script AdSense uniquement si l'utilisateur doit voir les pubs
    if (this.platformService.isBrowser && this.adService.shouldShowAds()) {
      this.loadAdSenseScript();
    }
  }

  private loadAdSenseScript(): void {
    const script = this.renderer.createElement('script');
    script.src = 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-3195351081459490';
    script.async = true;
    script.crossOrigin = 'anonymous';
    this.renderer.appendChild(document.head, script);
  }

}
