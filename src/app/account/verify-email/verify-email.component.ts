import { Component } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { AuthenticationService } from '../../services/authentication.service';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { trigger, transition, style, animate } from '@angular/animations';

@Component({
  selector: 'app-verify-email',
  imports: [MatProgressSpinnerModule, MatCardModule, MatIconModule, RouterModule],
  templateUrl: './verify-email.component.html',
  styleUrl: './verify-email.component.scss',
  animations: [
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(20px)' }),
        animate('400ms ease-out', style({ opacity: 1, transform: 'translateY(0)' })),
      ]),
    ]),
  ],
})
export class VerifyEmailComponent {
  message = '';
  loading = true;

  constructor(
    private route: ActivatedRoute,
    private authService: AuthenticationService,
    public router: Router
  ) {}

  ngOnInit() {
    const token = this.route.snapshot.queryParamMap.get('token');
    if (token) {
      this.authService.verifyEmail(token).subscribe({
        next: (data) => {
          this.message = 'Votre e-mail a été vérifié avec succès !';
          this.loading = false;
        },
        error: (error) => {
          this.message = 'Lien invalide ou expiré.';
          this.loading = false;
        },
      });
    } else {
      this.message = 'Aucun token fourni.';
      this.loading = false;
    }
  }
}
