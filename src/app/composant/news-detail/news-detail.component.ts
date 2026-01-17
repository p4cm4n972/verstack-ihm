import { Component, inject, OnInit, OnDestroy, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';

import { ArticlesService, Article } from '../../services/articles.service';
import { RecommendationService } from '../../services/recommendation.service';
import { AuthenticationService } from '../../services/authentication.service';
import { SeoService } from '../../services/seo.service';
import { StructuredDataService } from '../../core/services/structured-data.service';
import { PlatformService } from '../../core/services/platform.service';

@Component({
  selector: 'app-news-detail',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    RouterModule,
    MatButtonModule,
    MatTooltipModule,
    MatSnackBarModule
  ],
  templateUrl: './news-detail.component.html',
  styleUrl: './news-detail.component.scss'
})
export class NewsDetailComponent implements OnInit, OnDestroy {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly articlesService = inject(ArticlesService);
  private readonly recommendationService = inject(RecommendationService);
  private readonly authService = inject(AuthenticationService);
  private readonly seoService = inject(SeoService);
  private readonly structuredDataService = inject(StructuredDataService);
  private readonly platformService = inject(PlatformService);
  private readonly snackBar = inject(MatSnackBar);

  private destroy$ = new Subject<void>();

  // Signals pour l'état du composant
  article = signal<Article | null>(null);
  isLoading = signal(true);
  isAuthenticated = signal(false);

  // Computed values dérivées de l'article
  readingTime = computed(() => {
    const content = this.article()?.content || '';
    const wordsPerMinute = 200;
    const wordCount = content.replace(/<[^>]*>/g, '').split(/\s+/).length;
    return Math.ceil(wordCount / wordsPerMinute);
  });

  formattedDate = computed(() => {
    const date = this.article()?.date;
    if (!date) return '';
    return new Date(date).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  });

  // Computed values dérivées du RecommendationService (single source of truth)
  recommendations = computed(() => {
    const art = this.article();
    if (!art) return 0;
    return this.recommendationService.getRecommendationCount(art._id);
  });

  hasRecommended = computed(() => {
    const art = this.article();
    if (!art) return false;
    return this.recommendationService.isRecommended(art._id);
  });

  isProcessing = computed(() => {
    const art = this.article();
    if (!art) return false;
    return this.recommendationService.isProcessing(art._id);
  });

  ngOnInit(): void {
    // Souscription au statut d'authentification
    this.authService.getAuthStatus()
      .pipe(takeUntil(this.destroy$))
      .subscribe(status => {
        this.isAuthenticated.set(status);
      });

    // Chargement de l'article via le paramètre de route
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadArticle(id);
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  /**
   * Charge l'article depuis l'API et initialise l'état des recommandations.
   */
  private loadArticle(id: string): void {
    this.isLoading.set(true);

    this.articlesService.getArticleById(id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (article: Article) => {
          this.article.set(article);

          // Initialise l'état dans le RecommendationService (sync avec backend)
          this.recommendationService.initArticleState(
            article._id,
            article.recommendations || 0,
            article.recommendedBy || []
          );

          this.updateSeoForArticle(article);
          this.isLoading.set(false);
        },
        error: (error) => {
          console.error('Erreur chargement article:', error);
          this.isLoading.set(false);
          this.router.navigate(['/news']);
        }
      });
  }

  /**
   * Toggle (bascule) la recommandation via le service centralisé.
   * Le service gère l'optimistic UI, le rollback et les feedbacks.
   */
  toggleRecommendation(): void {
    const art = this.article();
    if (!art) return;

    // Vérifie l'authentification avec redirection possible
    if (!this.isAuthenticated()) {
      this.snackBar.open('Connectez-vous pour recommander cet article', 'Connexion', {
        duration: 4000,
        horizontalPosition: 'center',
        verticalPosition: 'bottom'
      }).onAction().subscribe(() => {
        this.router.navigate(['/signup']);
      });
      return;
    }

    // Délègue au service centralisé (gère optimistic UI + rollback + feedback)
    const request$ = this.recommendationService.toggleRecommendation(art._id);
    if (request$) {
      request$.pipe(takeUntil(this.destroy$)).subscribe();
    }
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // Partage social
  // ─────────────────────────────────────────────────────────────────────────────

  shareOnTwitter(): void {
    const art = this.article();
    if (!art) return;

    const url = this.getArticleUrl();
    const text = encodeURIComponent(`${art.title} - @verstack_io`);
    window.open(
      `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${text}`,
      '_blank',
      'width=600,height=400'
    );
  }

  shareOnLinkedIn(): void {
    const art = this.article();
    if (!art) return;

    const url = this.getArticleUrl();
    window.open(
      `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
      '_blank',
      'width=600,height=400'
    );
  }

  shareOnFacebook(): void {
    const art = this.article();
    if (!art) return;

    const url = this.getArticleUrl();
    window.open(
      `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
      '_blank',
      'width=600,height=400'
    );
  }

  copyLink(): void {
    const url = this.getArticleUrl();
    if (this.platformService.isBrowser) {
      navigator.clipboard.writeText(url).then(() => {
        this.snackBar.open('Lien copié !', '', {
          duration: 2000,
          horizontalPosition: 'center',
          verticalPosition: 'bottom'
        });
      });
    }
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // Méthodes privées
  // ─────────────────────────────────────────────────────────────────────────────

  private getArticleUrl(): string {
    const art = this.article();
    return art ? `https://verstack.io/news/${art._id}` : '';
  }

  private updateSeoForArticle(article: Article): void {
    const articleUrl = this.getArticleUrl();

    this.seoService.updateMetaData({
      title: `${article.title} - Verstack.io`,
      description: article.excerpt || article.description || 'Article sur Verstack.io',
      keywords: `verstack, ${article.category}, article, actualité, ${article.title}`,
      image: article.img || 'https://verstack.io/assets/icons/logo-banniere-RS.png',
      url: articleUrl,
      type: 'article',
      author: 'P4cm4n972',
      publishedTime: article.date,
      canonical: articleUrl
    });

    const structuredData = this.structuredDataService.createArticleSchema({
      title: article.title,
      description: article.excerpt || article.description || '',
      image: article.img || 'https://verstack.io/assets/icons/logo-banniere-RS.png',
      datePublished: article.date,
      dateModified: article.updatedAt || article.date,
      author: 'P4cm4n972',
      url: articleUrl
    });

    this.structuredDataService.addStructuredData(structuredData);
  }
}
