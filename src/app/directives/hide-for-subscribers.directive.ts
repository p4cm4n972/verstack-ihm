import { Directive, ElementRef, OnInit, inject, Renderer2 } from '@angular/core';
import { AuthenticationService } from '../services/authentication.service';

/**
 * Directive pour masquer automatiquement les éléments (publicités AdSense)
 * pour les utilisateurs ayant le rôle 'subscriber' ou 'admin'
 *
 * Usage:
 * <div appHideForSubscribers>
 *   <!-- Votre code Google AdSense ici -->
 * </div>
 */
@Directive({
  selector: '[appHideForSubscribers]',
  standalone: true
})
export class HideForSubscribersDirective implements OnInit {
  private el = inject(ElementRef);
  private renderer = inject(Renderer2);
  private authService = inject(AuthenticationService);

  ngOnInit(): void {
    const role = this.authService.getUserRole();

    // Masquer pour les subscribers et admins
    if (role === 'subscriber' || role === 'admin') {
      this.renderer.setStyle(this.el.nativeElement, 'display', 'none');

      // Optionnel : Ajouter un attribut data pour le debugging
      this.renderer.setAttribute(
        this.el.nativeElement,
        'data-hidden-for-role',
        role
      );
    }
  }
}
