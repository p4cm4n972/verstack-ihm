import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  signal,
  Inject,
  PLATFORM_ID
} from '@angular/core';
import { CommonModule, isPlatformBrowser, LowerCasePipe } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { takeUntil, Subject } from 'rxjs';

import { Article } from '../../services/articles.service';
import { RecommendationService } from '../../services/recommendation.service';

@Component({
  selector: 'app-article-modal',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule,
    MatSnackBarModule,
    LowerCasePipe
  ],
  templateUrl: './article-modal.component.html',
  styleUrl: './article-modal.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ArticleModalComponent {
  private readonly dialogRef = inject(MatDialogRef<ArticleModalComponent>);
  private readonly recommendationService = inject(RecommendationService);
  private readonly snackBar = inject(MatSnackBar);
  private readonly router = inject(Router);
  private readonly destroy$ = new Subject<void>();
  private readonly isBrowser: boolean;

  // Article data from dialog
  article = signal<Article | null>(null);

  // Computed signals pour les recommandations (réactifs)
  recommendations = computed(() => {
    const art = this.article();
    return art ? this.recommendationService.getRecommendationCount(art._id) : 0;
  });

  hasRecommended = computed(() => {
    const art = this.article();
    return art ? this.recommendationService.isRecommended(art._id) : false;
  });

  isProcessing = computed(() => {
    const art = this.article();
    return art ? this.recommendationService.isProcessing(art._id) : false;
  });

  // Computed pour le temps de lecture estimé
  readingTime = computed(() => {
    const art = this.article();
    if (!art?.content) return 1;

    // Calcul basé sur ~200 mots/minute
    const textContent = art.content.replace(/<[^>]*>/g, '');
    const wordCount = textContent.split(/\s+/).filter(word => word.length > 0).length;
    return Math.max(1, Math.ceil(wordCount / 200));
  });

  // Computed pour la date formatée
  formattedDate = computed(() => {
    const art = this.article();
    if (!art?.date) return '';

    try {
      const date = new Date(art.date);
      return date.toLocaleDateString('fr-FR', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      });
    } catch {
      return art.date;
    }
  });

  constructor(@Inject(MAT_DIALOG_DATA) data: Article, @Inject(PLATFORM_ID) platformId: Object) {
    this.isBrowser = isPlatformBrowser(platformId);
    this.article.set(data);

    // Initialise l'état des recommandations si pas déjà fait
    if (data) {
      this.recommendationService.initArticleState(
        data._id,
        data.recommendations || 0,
        data.recommendedBy || []
      );
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // Système de recommandation
  // ─────────────────────────────────────────────────────────────────────────────

  toggleRecommendation(): void {
    const art = this.article();
    if (!art) return;

    const request$ = this.recommendationService.toggleRecommendation(art._id);

    if (request$) {
      request$
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          error: (err) => console.error('Erreur recommandation:', err)
        });
    }
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // Partage social
  // ─────────────────────────────────────────────────────────────────────────────

  private getShareUrl(): string {
    const art = this.article();
    if (!art || !this.isBrowser) return '';
    return `${window.location.origin}/news/${art._id}`;
  }

  shareOnTwitter(): void {
    const art = this.article();
    if (!art || !this.isBrowser) return;

    const text = encodeURIComponent(`${art.title} - via @verstack_io`);
    const url = encodeURIComponent(this.getShareUrl());
    window.open(`https://twitter.com/intent/tweet?text=${text}&url=${url}`, '_blank', 'width=550,height=420');
  }

  shareOnLinkedIn(): void {
    if (!this.isBrowser) return;

    const url = encodeURIComponent(this.getShareUrl());
    window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${url}`, '_blank', 'width=550,height=420');
  }

  shareOnFacebook(): void {
    if (!this.isBrowser) return;

    const url = encodeURIComponent(this.getShareUrl());
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}`, '_blank', 'width=550,height=420');
  }

  copyLink(): void {
    if (!this.isBrowser) return;

    const url = this.getShareUrl();
    navigator.clipboard.writeText(url).then(() => {
      this.snackBar.open('Lien copié !', 'OK', {
        duration: 2000,
        horizontalPosition: 'center',
        verticalPosition: 'bottom'
      });
    });
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // Navigation
  // ─────────────────────────────────────────────────────────────────────────────

  openFullPage(): void {
    const art = this.article();
    if (!art) return;

    this.dialogRef.close();
    this.router.navigate(['/news', art._id]);
  }

  close(): void {
    this.dialogRef.close();
  }
}
