import { Component, Input, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdvertisementService } from '../../services/advertisement.service';
import { PlatformService } from '../../core/services/platform.service';

/**
 * Composant wrapper pour les blocs Google AdSense
 *
 * Ce composant encapsule vos blocs AdSense et les masque automatiquement
 * pour les utilisateurs ayant le rôle 'subscriber' ou 'admin'
 *
 * Usage:
 * <app-advertisement>
 *   <!-- Votre code Google AdSense ici -->
 *   <ins class="adsbygoogle" ...></ins>
 * </app-advertisement>
 *
 * Avec label (optionnel):
 * <app-advertisement [showLabel]="true">
 *   ...
 * </app-advertisement>
 */
@Component({
  selector: 'app-advertisement',
  imports: [CommonModule],
  templateUrl: './advertisement.component.html',
  styleUrl: './advertisement.component.scss'
})
export class AdvertisementComponent {
  private adService = inject(AdvertisementService);
  private platformService = inject(PlatformService);

  @Input() showLabel = false; // Afficher le label "PUBLICITÉ"
  @Input() labelPosition: 'top' | 'bottom' = 'top'; // Position du label

  // Getter réactif : réévalue à chaque détection de changement
  // Retourne true côté serveur (SSR) pour éviter les erreurs
  get showAd(): boolean {
    // Côté serveur : afficher les pubs par défaut (sera hydraté côté client)
    if (!this.platformService.isBrowser) {
      return true;
    }

    // Côté client : vérifier le rôle de l'utilisateur
    return this.adService.shouldShowAds();
  }
}
