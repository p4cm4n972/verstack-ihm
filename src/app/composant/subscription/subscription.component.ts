import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SubscriptionService } from '../../services/subscription.service';
import { AuthenticationService } from '../../services/authentication.service';
import { Subscription } from '../../models/subscription.interface';

@Component({
  selector: 'app-subscription',
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './subscription.component.html',
  styleUrl: './subscription.component.scss'
})
export class SubscriptionComponent implements OnInit {
  private subscriptionService = inject(SubscriptionService);
  private authService = inject(AuthenticationService);
  private snackBar = inject(MatSnackBar);

  subscription: Subscription | null = null;
  isLoading = true;
  isProcessing = false;
  userRole = '';

  /** Prix mensuel affiché */
  readonly monthlyPrice = this.subscriptionService.MONTHLY_PRICE;

  ngOnInit(): void {
    this.userRole = this.authService.getUserRole();
    this.loadSubscription();
  }

  private loadSubscription(): void {
    const userId = this.authService.getUserId();
    if (!userId) {
      this.isLoading = false;
      return;
    }

    this.subscriptionService.getSubscription(userId).subscribe({
      next: (sub) => {
        this.subscription = sub;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading subscription:', error);
        this.isLoading = false;
      }
    });
  }

  subscribe(): void {
    const userId = this.authService.getUserId();
    if (!userId) {
      this.snackBar.open('Vous devez être connecté pour souscrire', 'Fermer', { duration: 3000 });
      return;
    }

    this.isProcessing = true;

    this.subscriptionService.createCheckoutSession({ userId }).subscribe({
      next: (response) => {
        // Redirect to Stripe checkout
        window.location.href = response.checkoutUrl;
      },
      error: (error) => {
        console.error('Error creating checkout session:', error);
        this.snackBar.open('Erreur lors de la création de la session de paiement', 'Fermer', { duration: 5000 });
        this.isProcessing = false;
      }
    });
  }

  cancelSubscription(immediate: boolean = false): void {
    if (!this.subscription) return;

    const message = immediate
      ? 'Êtes-vous sûr de vouloir annuler votre abonnement immédiatement ?'
      : 'Votre abonnement sera annulé à la fin de la période en cours.';

    if (!confirm(message)) return;

    this.isProcessing = true;
    const userId = this.authService.getUserId();

    this.subscriptionService.cancelSubscription({
      userId: userId!,
      immediate
    }).subscribe({
      next: (sub) => {
        this.subscription = sub;
        this.snackBar.open('Abonnement annulé avec succès', 'Fermer', { duration: 3000 });
        this.isProcessing = false;
      },
      error: (error) => {
        console.error('Error cancelling subscription:', error);
        this.snackBar.open('Erreur lors de l\'annulation', 'Fermer', { duration: 5000 });
        this.isProcessing = false;
      }
    });
  }

  reactivateSubscription(): void {
    const userId = this.authService.getUserId();
    if (!userId) return;

    this.isProcessing = true;

    this.subscriptionService.reactivateSubscription(userId).subscribe({
      next: (sub) => {
        this.subscription = sub;
        this.snackBar.open('Abonnement réactivé avec succès', 'Fermer', { duration: 3000 });
        this.isProcessing = false;
      },
      error: (error) => {
        console.error('Error reactivating subscription:', error);
        this.snackBar.open('Erreur lors de la réactivation', 'Fermer', { duration: 5000 });
        this.isProcessing = false;
      }
    });
  }

  get isSubscriber(): boolean {
    return this.userRole === 'subscriber' || this.subscription?.status === 'active';
  }

  get subscriptionEndDate(): string {
    if (!this.subscription) return '';
    return new Date(this.subscription.endDate).toLocaleDateString('fr-FR');
  }

  formatPrice(amount: number): string {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR'
    }).format(amount);
  }
}
