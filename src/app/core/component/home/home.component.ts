import { Component, OnDestroy, inject, effect } from '@angular/core';
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
import { LangagesService } from '../../../services/langages.service';
import { FavorisService } from '../../../services/favoris.service';
import { Observable, tap } from 'rxjs';
import { differenceInDays, differenceInHours } from 'date-fns';
import { FavoriteTechnology } from '../../../models/technology.interface';

interface TerminalCommand {
  command: string;
  displayedText: string;
  isTyping: boolean;
  isComplete: boolean;
  showOutput: boolean;
}

interface TerminalNotification {
  type: 'release' | 'security' | 'deprecation' | 'info';
  tech: string;
  version?: string;
  message: string;
  timeAgo: string;
  isVisible: boolean;
  trending?: 'up' | 'down' | 'stable';
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterModule, CommonModule, MatTabsModule, GlobeComponent, MatCardModule, UserTechPreviewComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent implements OnDestroy {
  private readonly favorisService = inject(FavorisService);

  authStatus: boolean = false;
  authStatus$: Observable<boolean>;
  userData: any;
  bgLoaded = false;

  // Expose favoris from centralized service
  readonly userFavoris = this.favorisService.favoris;

  // Terminal typing effect
  terminalCommands: TerminalCommand[] = [
    { command: 'whoami', displayedText: '', isTyping: false, isComplete: false, showOutput: false },
    { command: 'tail -f /var/log/releases.log', displayedText: '', isTyping: false, isComplete: false, showOutput: false }
  ];
  typingSpeed = 50; // ms per character
  private typingTimeouts: ReturnType<typeof setTimeout>[] = [];

  // Notifications feed
  notifications: TerminalNotification[] = [];
  showNotificationsSection = false;




  constructor(
    private authService: AuthenticationService,
    private profileService: ProfileService,
    private seo: SeoService,
    private platformService: PlatformService,
    private structuredDataService: StructuredDataService,
    private langagesService: LangagesService
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
        next: () => {
          this.loadUserFavoris();
          // Start typing animation after user data is loaded
          setTimeout(() => this.startTypingAnimation(), 500);
        },
        error: (err) => console.error('Erreur lors du chargement du profil utilisateur', err)
      });
    });

    this.userData = this.platformService.getJson<any>('user', null);
    // Favoris are now managed by FavorisService (already loaded from localStorage)
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
    // Sync from API to ensure fresh data
    this.favorisService.syncFromApi().subscribe(() => {
      this.loadNotificationsFromApi();
    });
  }

  private loadNotificationsFromApi(): void {
    if (!this.platformService.isBrowser || !this.langagesService) {
      return;
    }

    const favoris = this.favorisService.favoris();
    if (!favoris || favoris.length === 0) {
      return;
    }

    const favorisNames = favoris.map((f: FavoriteTechnology) => f.name);

    this.langagesService.getAllLangages().subscribe({
      next: (allLangages) => {
        const userTechs = allLangages.filter(lang => favorisNames.includes(lang.name));
        this.notifications = this.generateNotificationsFromTechs(userTechs);
      },
      error: (err) => {
        console.error('Erreur lors du chargement des notifications', err);
      }
    });
  }

  // Trending data pour les technologies
  private readonly trendingData: Record<string, 'up' | 'down' | 'stable'> = {
    'JavaScript': 'stable',
    'TypeScript': 'up',
    'Python': 'up',
    'HTML': 'stable',
    'CSS': 'stable',
    'Node.js': 'up',
    'Angular': 'up',
    'React': 'up',
    'Vue.js': 'stable',
    'MongoDB': 'stable',
    'Java': 'stable',
    'C#': 'up',
    'Go': 'up',
    'Rust': 'up',
    'PHP': 'down',
    'Ruby': 'down',
    'Swift': 'up',
    'Kotlin': 'up'
  };

  private generateNotificationsFromTechs(techs: any[]): TerminalNotification[] {
    const notifications: TerminalNotification[] = [];

    for (const tech of techs) {
      if (!tech.versions || tech.versions.length === 0) continue;

      // Trouver la meilleure version pour cette tech (priorité: LTS > Living Standard > Edition > Current)
      const bestVersion = this.findBestVersion(tech.versions);
      if (!bestVersion || !bestVersion.releaseDate) continue;

      const releaseDate = new Date(bestVersion.releaseDate);
      const now = new Date();
      const hoursAgo = differenceInHours(now, releaseDate);
      const daysAgo = differenceInDays(now, releaseDate);

      const timeAgo = this.formatTimeAgo(hoursAgo, daysAgo);
      const notifType = this.getNotificationType(bestVersion.type, daysAgo);
      const message = this.getNotificationMessage(bestVersion.type);
      const trending = this.trendingData[tech.name] || 'stable';

      notifications.push({
        type: notifType,
        tech: tech.name,
        version: bestVersion.label,
        message,
        timeAgo,
        isVisible: false,
        trending
      });
    }

    // Sort by most recent first, limit to 8 notifications
    return notifications
      .sort((a, b) => this.parseTimeAgo(a.timeAgo) - this.parseTimeAgo(b.timeAgo))
      .slice(0, 8);
  }

  private findBestVersion(versions: any[]): any {
    // Priorité: LTS > Living Standard > Edition > Current > autres
    const priority = ['lts', 'living', 'edition', 'current'];

    for (const p of priority) {
      const found = versions.find(v => v.type?.toLowerCase().includes(p));
      if (found) return found;
    }

    // Si aucune version prioritaire, prendre la première
    return versions[0];
  }

  private formatTimeAgo(hoursAgo: number, daysAgo: number): string {
    if (hoursAgo < 1) return 'now';
    if (hoursAgo < 24) return `${hoursAgo}h ago`;
    if (daysAgo === 1) return '1d ago';
    if (daysAgo < 7) return `${daysAgo}d ago`;
    if (daysAgo < 14) return '1w ago';
    return `${Math.floor(daysAgo / 7)}w ago`;
  }

  private parseTimeAgo(timeAgo: string): number {
    if (timeAgo === 'now') return 0;
    const match = timeAgo.match(/(\d+)([hdw])/);
    if (!match) return 999;
    const value = parseInt(match[1]);
    const unit = match[2];
    if (unit === 'h') return value;
    if (unit === 'd') return value * 24;
    if (unit === 'w') return value * 24 * 7;
    return 999;
  }

  private getNotificationType(versionType: string, daysAgo: number): 'release' | 'security' | 'deprecation' | 'info' {
    const type = versionType?.toLowerCase() || '';
    if (type.includes('security') || type.includes('patch')) return 'security';
    if (type.includes('deprecated') || type.includes('end')) return 'deprecation';
    if (daysAgo <= 7) return 'release';
    return 'info';
  }

  private getNotificationMessage(versionType: string): string {
    if (!versionType) return 'Update';

    // Formater le type de version pour qu'il soit lisible
    const type = versionType.toLowerCase();
    if (type === 'lts') return 'LTS';
    if (type === 'current') return 'Current';
    if (type === 'livingstandard' || type === 'living standard' || type === 'living_standard') return 'Living Standard';
    if (type === 'edition') return 'Edition';
    if (type === 'standard') return 'Standard';
    if (type === 'security') return 'Security';
    if (type === 'maintenance') return 'Maintenance';

    // Capitaliser la première lettre si non reconnu
    return versionType.charAt(0).toUpperCase() + versionType.slice(1).toLowerCase();
  }

  private storeUserData(response: any) {
    // Update favoris in the centralized service
    if (response.favoris) {
      this.favorisService.setFavoris(response.favoris);
    }
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

  startTypingAnimation(): void {
    if (!this.platformService.isBrowser) {
      // SSR: show everything immediately
      this.terminalCommands.forEach(cmd => {
        cmd.displayedText = cmd.command;
        cmd.isComplete = true;
        cmd.showOutput = true;
      });
      this.showNotificationsSection = true;
      this.notifications.forEach(n => n.isVisible = true);
      return;
    }

    // Reset all commands
    this.terminalCommands.forEach(cmd => {
      cmd.displayedText = '';
      cmd.isTyping = false;
      cmd.isComplete = false;
      cmd.showOutput = false;
    });
    this.showNotificationsSection = false;
    this.notifications.forEach(n => n.isVisible = false);

    // Start typing sequence
    this.typeCommandSequence(0);
  }

  private typeCommandSequence(index: number): void {
    if (index >= this.terminalCommands.length) {
      // All commands done, start showing notifications
      this.startNotificationsFeed();
      return;
    }

    const cmd = this.terminalCommands[index];
    cmd.isTyping = true;
    this.typeCharacter(cmd, 0, () => {
      cmd.isTyping = false;
      cmd.isComplete = true;
      // Show output after typing completes
      const outputTimeout = setTimeout(() => {
        cmd.showOutput = true;
        // Start next command after a delay
        const nextTimeout = setTimeout(() => {
          this.typeCommandSequence(index + 1);
        }, 300);
        this.typingTimeouts.push(nextTimeout);
      }, 150);
      this.typingTimeouts.push(outputTimeout);
    });
  }

  private startNotificationsFeed(): void {
    this.showNotificationsSection = true;
    this.showNotificationSequence(0);
  }

  private showNotificationSequence(index: number): void {
    if (index >= this.notifications.length) return;

    const timeout = setTimeout(() => {
      this.notifications[index].isVisible = true;
      this.showNotificationSequence(index + 1);
    }, 400);
    this.typingTimeouts.push(timeout);
  }

  private typeCharacter(cmd: TerminalCommand, charIndex: number, onComplete: () => void): void {
    if (charIndex >= cmd.command.length) {
      onComplete();
      return;
    }

    const timeout = setTimeout(() => {
      cmd.displayedText = cmd.command.substring(0, charIndex + 1);
      this.typeCharacter(cmd, charIndex + 1, onComplete);
    }, this.typingSpeed);
    this.typingTimeouts.push(timeout);
  }

  ngOnDestroy(): void {
    // Clear all typing timeouts
    this.typingTimeouts.forEach(timeout => clearTimeout(timeout));
    this.typingTimeouts = [];
  }
}
