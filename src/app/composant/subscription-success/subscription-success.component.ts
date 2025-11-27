import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { AuthenticationService } from '../../services/authentication.service';
import { SubscriptionService } from '../../services/subscription.service';

@Component({
  selector: 'app-subscription-success',
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './subscription-success.component.html',
  styleUrl: './subscription-success.component.scss'
})
export class SubscriptionSuccessComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private authService = inject(AuthenticationService);
  private subscriptionService = inject(SubscriptionService);

  sessionId: string | null = null;
  isLoading = true;
  error = false;
  errorMessage = '';

  ngOnInit(): void {
    // Récupérer le session_id depuis l'URL
    this.route.queryParams.subscribe(params => {
      this.sessionId = params['session_id'];

      if (!this.sessionId) {
        this.error = true;
        this.errorMessage = 'Session invalide';
        this.isLoading = false;
        return;
      }

      // Rafraîchir le token pour obtenir le nouveau rôle 'subscriber'
      this.refreshToken();
    });
  }

  private refreshToken(): void {
    // Utiliser la méthode de refresh token existante
    this.authService.refreshToken().subscribe({
      next: (response) => {
        // Token rafraîchi avec le nouveau rôle
        this.authService.updateAuthStatus(true);
        this.isLoading = false;

        // Recharger la page pour retirer le script AdSense et les publicités
        setTimeout(() => window.location.reload(), 1000);
      },
      error: (error) => {
        console.error('Erreur refresh token:', error);
        // Même en cas d'erreur, afficher le succès
        // L'utilisateur devra peut-être se reconnecter pour voir le nouveau rôle
        this.isLoading = false;
      }
    });
  }

  goToSubscription(): void {
    this.router.navigate(['/subscription']);
  }

  goToHome(): void {
    this.router.navigate(['/home']);
  }
}
