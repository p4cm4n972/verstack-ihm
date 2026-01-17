import { Injectable, inject, signal, computed } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Observable, catchError, tap, throwError } from 'rxjs';
import { PlatformService } from '../core/services/platform.service';
import { AuthenticationService } from './authentication.service';

interface RecommendationResponse {
  recommendations: number;
  recommendedBy?: string[];
}

interface RecommendationState {
  articleId: string;
  count: number;
  isRecommended: boolean;
}

/**
 * Service centralisé pour la gestion des recommandations d'articles.
 *
 * Utilise Angular Signals pour un état réactif partagé entre composants.
 * Implémente l'optimistic UI (mise à jour immédiate avec rollback si erreur).
 * Persiste l'état dans localStorage pour une réactivité cross-session.
 */
@Injectable({
  providedIn: 'root'
})
export class RecommendationService {
  private readonly http = inject(HttpClient);
  private readonly snackBar = inject(MatSnackBar);
  private readonly platformService = inject(PlatformService);
  private readonly authService = inject(AuthenticationService);

  private readonly apiUrl = '/api/news';
  private readonly STORAGE_KEY = 'recommendedArticles';

  // État central des recommandations par articleId
  private readonly _recommendationsMap = signal<Map<string, RecommendationState>>(new Map());

  // Signal dérivé pour accès facile aux IDs recommandés
  readonly recommendedArticleIds = computed(() => {
    const map = this._recommendationsMap();
    return Array.from(map.entries())
      .filter(([_, state]) => state.isRecommended)
      .map(([id]) => id);
  });

  // Flag pour éviter les double-clicks (debouncing manuel)
  private processingArticles = new Set<string>();

  constructor() {
    this.loadFromStorage();
  }

  /**
   * Vérifie si un article a été recommandé par l'utilisateur courant.
   */
  isRecommended(articleId: string): boolean {
    const state = this._recommendationsMap().get(articleId);
    return state?.isRecommended ?? false;
  }

  /**
   * Retourne le nombre de recommandations pour un article.
   */
  getRecommendationCount(articleId: string): number {
    const state = this._recommendationsMap().get(articleId);
    return state?.count ?? 0;
  }

  /**
   * Initialise l'état d'un article depuis les données backend.
   * À appeler lors du chargement d'un article.
   */
  initArticleState(articleId: string, count: number, recommendedBy: string[]): void {
    const userId = this.authService.getUserId();
    const isRecommended = recommendedBy.includes(userId);

    this.updateState(articleId, count, isRecommended);

    // Sync localStorage avec le backend (source de vérité)
    if (isRecommended) {
      this.addToStorage(articleId);
    } else {
      this.removeFromStorage(articleId);
    }
  }

  /**
   * Toggle (bascule) la recommandation d'un article.
   * Implémente l'optimistic UI avec rollback (retour arrière) en cas d'erreur.
   */
  toggleRecommendation(articleId: string): Observable<RecommendationResponse> | null {
    // Guard: empêche les requêtes si non authentifié
    const userId = this.authService.getUserId();
    if (!userId) {
      this.snackBar.open('Connectez-vous pour recommander cet article', 'Connexion', {
        duration: 4000,
        horizontalPosition: 'center',
        verticalPosition: 'bottom'
      });
      return null;
    }

    // Guard: debounce - empêche les double-clicks
    if (this.processingArticles.has(articleId)) {
      return null;
    }

    const currentState = this._recommendationsMap().get(articleId);
    const wasRecommended = currentState?.isRecommended ?? false;
    const previousCount = currentState?.count ?? 0;

    // Optimistic UI: mise à jour immédiate
    const newCount = wasRecommended ? previousCount - 1 : previousCount + 1;
    this.updateState(articleId, newCount, !wasRecommended);
    this.updateStorage(!wasRecommended, articleId);

    // Marque comme "en cours de traitement"
    this.processingArticles.add(articleId);

    const request$ = wasRecommended
      ? this.http.post<RecommendationResponse>(`${this.apiUrl}/${articleId}/unrecommend`, { userId })
      : this.http.post<RecommendationResponse>(`${this.apiUrl}/${articleId}/recommend`, { userId });

    return request$.pipe(
      tap((response) => {
        // Sync avec la réponse backend (count réel)
        this.updateState(articleId, response.recommendations, !wasRecommended);
        this.processingArticles.delete(articleId);

        // Feedback positif
        const message = wasRecommended ? 'Recommandation retirée' : 'Article recommandé !';
        this.snackBar.open(message, '', {
          duration: 2000,
          horizontalPosition: 'center',
          verticalPosition: 'bottom',
          panelClass: wasRecommended ? [] : ['snackbar-success']
        });
      }),
      catchError((error: HttpErrorResponse) => {
        // Rollback: restaure l'état précédent
        this.updateState(articleId, previousCount, wasRecommended);
        this.updateStorage(wasRecommended, articleId);
        this.processingArticles.delete(articleId);

        // Feedback d'erreur
        const errorMessage = this.getErrorMessage(error);
        this.snackBar.open(errorMessage, 'Fermer', {
          duration: 5000,
          horizontalPosition: 'center',
          verticalPosition: 'bottom',
          panelClass: ['snackbar-error']
        });

        return throwError(() => error);
      })
    );
  }

  /**
   * Vérifie si une opération est en cours pour un article (utile pour désactiver le bouton).
   */
  isProcessing(articleId: string): boolean {
    return this.processingArticles.has(articleId);
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // Méthodes privées
  // ─────────────────────────────────────────────────────────────────────────────

  private updateState(articleId: string, count: number, isRecommended: boolean): void {
    const map = new Map(this._recommendationsMap());
    map.set(articleId, { articleId, count, isRecommended });
    this._recommendationsMap.set(map);
  }

  private updateStorage(isRecommended: boolean, articleId: string): void {
    if (isRecommended) {
      this.addToStorage(articleId);
    } else {
      this.removeFromStorage(articleId);
    }
  }

  private loadFromStorage(): void {
    if (!this.platformService.isBrowser) return;

    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      if (stored) {
        const ids: string[] = JSON.parse(stored);
        const map = new Map<string, RecommendationState>();
        ids.forEach(id => {
          map.set(id, { articleId: id, count: 0, isRecommended: true });
        });
        this._recommendationsMap.set(map);
      }
    } catch (e) {
      console.error('Erreur lecture localStorage recommendations:', e);
    }
  }

  private addToStorage(articleId: string): void {
    if (!this.platformService.isBrowser) return;

    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      const ids: string[] = stored ? JSON.parse(stored) : [];
      if (!ids.includes(articleId)) {
        ids.push(articleId);
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(ids));
      }
    } catch (e) {
      console.error('Erreur écriture localStorage recommendations:', e);
    }
  }

  private removeFromStorage(articleId: string): void {
    if (!this.platformService.isBrowser) return;

    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      if (stored) {
        const ids: string[] = JSON.parse(stored);
        const filtered = ids.filter(id => id !== articleId);
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(filtered));
      }
    } catch (e) {
      console.error('Erreur suppression localStorage recommendations:', e);
    }
  }

  private getErrorMessage(error: HttpErrorResponse): string {
    if (error.status === 0) {
      return 'Erreur réseau - vérifiez votre connexion';
    }
    if (error.status === 401) {
      return 'Session expirée - reconnectez-vous';
    }
    if (error.status === 404) {
      return 'Article introuvable';
    }
    if (error.status >= 500) {
      return 'Erreur serveur - réessayez plus tard';
    }
    return error.error?.message || 'Une erreur est survenue';
  }
}
