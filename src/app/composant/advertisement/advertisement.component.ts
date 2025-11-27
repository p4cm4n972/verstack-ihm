import { Component, Input, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdvertisementService } from '../../services/advertisement.service';

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
export class AdvertisementComponent implements OnInit {
  private adService = inject(AdvertisementService);

  @Input() showLabel = false; // Afficher le label "PUBLICITÉ"
  @Input() labelPosition: 'top' | 'bottom' = 'top'; // Position du label

  showAd = false;

  ngOnInit(): void {
    this.showAd = this.adService.shouldShowAds();
  }
}
