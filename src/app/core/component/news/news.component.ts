import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Inject,
  PLATFORM_ID,
  inject,
  OnInit,
  OnDestroy
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatChipsModule } from '@angular/material/chips';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatIconModule } from '@angular/material/icon';
import { MatBadgeModule } from '@angular/material/badge';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogModule,
} from '@angular/material/dialog';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';

import { ArticlesService, Article } from '../../../services/articles.service';
import { RecommendationService } from '../../../services/recommendation.service';
import { AuthenticationService } from '../../../services/authentication.service';
import { SeoService } from '../../../services/seo.service';
import { TapeTextConsoleComponent } from '../../../composant/tape-text-console/tape-text-console.component';

@Component({
  selector: 'app-news',
  imports: [
    MatToolbarModule,
    MatFormFieldModule,
    MatInputModule,
    MatCardModule,
    MatButtonModule,
    MatChipsModule,
    MatGridListModule,
    MatBadgeModule,
    MatIconModule,
    MatTooltipModule,
    MatSnackBarModule,
    TapeTextConsoleComponent
  ],
  templateUrl: './news.component.html',
  styleUrl: './news.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NewsComponent implements OnInit, OnDestroy {
  private readonly dialog = inject(MatDialog);
  private readonly router = inject(Router);
  private readonly articlesService = inject(ArticlesService);
  private readonly recommendationService = inject(RecommendationService);
  private readonly authService = inject(AuthenticationService);
  private readonly sanitizer = inject(DomSanitizer);
  private readonly seo = inject(SeoService);
  private readonly cdr = inject(ChangeDetectorRef);

  private destroy$ = new Subject<void>();

  defaultPicture = 'assets/images/bkg-home-old.jpg';
  actualiteType: string[] = ['tous', 'editorial', 'article', 'note', 'story'];
  selectedDomainIndex = 0;

  articles: Article[] = [];
  filteredArticles: Article[] = [];

  private isBrowser: boolean;
  currentUser: any;

  constructor(@Inject(PLATFORM_ID) platformId: Object) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  ngOnInit(): void {
    if (this.isBrowser) {
      this.currentUser = this.authService.getCurrentUser();
    }

    this.setupSeo();
    this.loadArticles();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // Chargement et filtrage des articles
  // ─────────────────────────────────────────────────────────────────────────────

  loadArticles(): void {
    this.articlesService.getArticles()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data: Article[]) => {
          this.articles = data;
          this.filteredArticles = data;

          // Initialise l'état des recommandations pour chaque article
          data.forEach(article => {
            this.recommendationService.initArticleState(
              article._id,
              article.recommendations || 0,
              article.recommendedBy || []
            );
          });

          this.cdr.markForCheck();
        },
        error: (err) => console.error('Erreur chargement articles:', err),
      });
  }

  searchArticles(keyword: string): void {
    const searchTerm = keyword.toLowerCase();
    this.filteredArticles = this.articles.filter(
      (article) =>
        article.title.toLowerCase().includes(searchTerm) ||
        (article.excerpt?.toLowerCase().includes(searchTerm) ?? false)
    );
    this.cdr.markForCheck();
  }

  filterByType(index: number): void {
    this.selectedDomainIndex = index;
    this.filteredArticles =
      index === 0
        ? this.articles
        : this.articles.filter(
            (article) => article.category === this.actualiteType[index]
          );
    this.cdr.markForCheck();
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // Système de recommandation (délégué au RecommendationService)
  // ─────────────────────────────────────────────────────────────────────────────

  /**
   * Toggle (bascule) la recommandation d'un article.
   * Délègue au RecommendationService qui gère l'optimistic UI et le feedback.
   */
  toggleRecommendation(article: Article): void {
    const request$ = this.recommendationService.toggleRecommendation(article._id);

    if (request$) {
      request$
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: () => this.cdr.markForCheck(),
          error: () => this.cdr.markForCheck()
        });
    }
  }

  /**
   * Vérifie si l'utilisateur courant a recommandé l'article.
   */
  hasRecommended(article: Article): boolean {
    return this.recommendationService.isRecommended(article._id);
  }

  /**
   * Retourne le nombre de recommandations d'un article.
   */
  getRecommendationCount(article: Article): number {
    return this.recommendationService.getRecommendationCount(article._id);
  }

  /**
   * Vérifie si une opération de recommandation est en cours.
   */
  isProcessing(article: Article): boolean {
    return this.recommendationService.isProcessing(article._id);
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // Navigation et dialogs
  // ─────────────────────────────────────────────────────────────────────────────

  openArticlePage(article: Article): void {
    this.router.navigate(['/news', article._id]);
  }

  openArticleContentDialog(content: string): void {
    const rendu = this.sanitizer.bypassSecurityTrustHtml(content);
    this.dialog.open(DialogDataArticle, { data: rendu });
  }

  trackById(index: number, article: Article): string {
    return article._id;
  }

  filterByTag(elm: any): void {
    // TODO: Implémenter le filtrage par tag
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // SEO
  // ─────────────────────────────────────────────────────────────────────────────

  private setupSeo(): void {
    let imageUrl: string | undefined;
    if (this.isBrowser) {
      imageUrl = `${window.location.origin}/assets/slider/slider-1.jpg`;
    }

    this.seo.updateMetaData({
      title: 'Actualités & Articles – Verstack.io',
      description: 'Explorez les dernières actualités, articles, notes et stories sur les outils et stacks pour développeurs modernes. Restez informé avec Verstack.io.',
      keywords: `verstack, langages, outils, développeurs, Angular, React, version Angular, version React, version Vue.js, version Node.js, version Python, version Java,
      version C#, version PHP, version Ruby, version Go, version Rust, version JavaScript, version TypeScript, version Docker, version Kubernetes`,
      image: imageUrl,
      url: 'https://verstack.io/news'
    });
  }
}

@Component({
  selector: 'dialog-data-articles',
  templateUrl: './dialog-data-articles.html',
  imports: [MatDialogModule, MatButtonModule],
})
export class DialogDataArticle {
  data = inject(MAT_DIALOG_DATA);
}
