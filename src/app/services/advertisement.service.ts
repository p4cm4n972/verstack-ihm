import { Injectable, inject } from '@angular/core';
import { AuthenticationService } from './authentication.service';

/**
 * Service simplifié pour gérer l'affichage des publicités (Google AdSense)
 *
 * Ce service détermine si un utilisateur doit voir les publicités
 * en fonction de son rôle (subscriber et admin ne voient pas de pub)
 */
@Injectable({
  providedIn: 'root'
})
export class AdvertisementService {
  private authService = inject(AuthenticationService);

  /**
   * Vérifie si l'utilisateur doit voir les publicités
   * Les utilisateurs avec le rôle 'subscriber' ou 'admin' ne voient pas de publicité
   *
   * @returns true si l'utilisateur doit voir les publicités, false sinon
   */
  shouldShowAds(): boolean {
    const role = this.authService.getUserRole();
    return role !== 'subscriber' && role !== 'admin';
  }

  /**
   * Vérifie si l'utilisateur est abonné (subscriber ou admin)
   *
   * @returns true si l'utilisateur est subscriber ou admin
   */
  isSubscriberOrAdmin(): boolean {
    const role = this.authService.getUserRole();
    return role === 'subscriber' || role === 'admin';
  }

  /**
   * Retourne le rôle de l'utilisateur actuel
   *
   * @returns Le rôle de l'utilisateur ('admin', 'user', 'subscriber', ou '')
   */
  getUserRole(): string {
    return this.authService.getUserRole();
  }
}
