import { Injectable, signal, computed, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Observable, of, catchError, tap, map } from 'rxjs';
import { ProfileService } from './profile.service';
import { AuthenticationService } from './authentication.service';
import { FavoriteTechnology, Technology, FavorisState } from '../models/technology.interface';
import { MatSnackBar } from '@angular/material/snack-bar';

const FAVORIS_STORAGE_KEY = 'favoris';
const USER_STORAGE_KEY = 'user';

/**
 * Centralized service for managing user's favorite technologies.
 * Uses Angular Signals for reactive state management.
 * Single source of truth for favoris across the application.
 */
@Injectable({
  providedIn: 'root'
})
export class FavorisService {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly profileService = inject(ProfileService);
  private readonly authService = inject(AuthenticationService);
  private readonly snackBar = inject(MatSnackBar);

  private readonly isBrowser = isPlatformBrowser(this.platformId);

  // State signals
  private readonly _favoris = signal<FavoriteTechnology[]>([]);
  private readonly _isLoading = signal<boolean>(false);
  private readonly _error = signal<string | null>(null);
  private readonly _lastUpdated = signal<Date | null>(null);

  // Public readonly signals
  readonly favoris = this._favoris.asReadonly();
  readonly isLoading = this._isLoading.asReadonly();
  readonly error = this._error.asReadonly();
  readonly lastUpdated = this._lastUpdated.asReadonly();

  // Computed signals
  readonly favorisCount = computed(() => this._favoris().length);
  readonly hasFavoris = computed(() => this._favoris().length > 0);
  readonly favorisNames = computed(() => this._favoris().map(f => f.name));

  constructor() {
    // Initialize from localStorage on service creation
    this.loadFromStorage();
  }

  /**
   * Load favoris from localStorage (synchronous, for initial state)
   */
  private loadFromStorage(): void {
    if (!this.isBrowser) {
      return;
    }

    try {
      const stored = localStorage.getItem(FAVORIS_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          this._favoris.set(parsed);
          this._lastUpdated.set(new Date());
        }
      }
    } catch (error) {
      console.error('Error loading favoris from localStorage:', error);
      this._error.set('Erreur lors du chargement des favoris');
    }
  }

  /**
   * Sync favoris from API (async, for fresh data)
   */
  syncFromApi(): Observable<FavoriteTechnology[]> {
    const userId = this.getUserId();
    if (!userId) {
      return of([]);
    }

    this._isLoading.set(true);
    this._error.set(null);

    return this.profileService.getUserProfile(userId).pipe(
      map((profile: any) => profile.favoris || []),
      tap((favoris: FavoriteTechnology[]) => {
        this._favoris.set(favoris);
        this._lastUpdated.set(new Date());
        this.saveToStorage(favoris);
        this._isLoading.set(false);
      }),
      catchError((error) => {
        console.error('Error syncing favoris from API:', error);
        this._error.set('Erreur lors de la synchronisation des favoris');
        this._isLoading.set(false);
        return of(this._favoris());
      })
    );
  }

  /**
   * Add a technology to favorites
   */
  addFavoris(technology: Technology | FavoriteTechnology): Observable<boolean> {
    const userId = this.getUserId();
    if (!userId) {
      this.showMessage('Vous devez être connecté pour ajouter des favoris');
      return of(false);
    }

    // Check if already in favorites
    if (this.isFavoris(technology.name)) {
      this.showMessage(`${technology.name} est déjà dans vos favoris`);
      return of(false);
    }

    const newFavorite: FavoriteTechnology = {
      name: technology.name,
      logoUrl: technology.logoUrl
    };

    // Optimistic update
    const previousFavoris = this._favoris();
    const updatedFavoris = [...previousFavoris, newFavorite];
    this._favoris.set(updatedFavoris);
    this._isLoading.set(true);
    this._error.set(null);

    return this.profileService.updateUserProfile(userId, { favoris: updatedFavoris }).pipe(
      tap((response: any) => {
        // Use response data if available, otherwise keep optimistic update
        if (response?.favoris) {
          this._favoris.set(response.favoris);
        }
        this.saveToStorage(this._favoris());
        this._lastUpdated.set(new Date());
        this._isLoading.set(false);
        this.showMessage(`${technology.name} ajouté à vos favoris`, 'success');
      }),
      map(() => true),
      catchError((error) => {
        // Rollback on error
        console.error('Error adding favoris:', error);
        this._favoris.set(previousFavoris);
        this._error.set('Erreur lors de l\'ajout du favori');
        this._isLoading.set(false);
        this.showMessage('Erreur lors de l\'ajout du favori', 'error');
        return of(false);
      })
    );
  }

  /**
   * Remove a technology from favorites
   */
  removeFavoris(technologyName: string): Observable<boolean> {
    const userId = this.getUserId();
    if (!userId) {
      this.showMessage('Vous devez être connecté pour retirer des favoris');
      return of(false);
    }

    // Check if in favorites
    if (!this.isFavoris(technologyName)) {
      return of(false);
    }

    // Optimistic update
    const previousFavoris = this._favoris();
    const updatedFavoris = previousFavoris.filter(f => f.name !== technologyName);
    this._favoris.set(updatedFavoris);
    this._isLoading.set(true);
    this._error.set(null);

    return this.profileService.updateUserProfile(userId, { favoris: updatedFavoris }).pipe(
      tap((response: any) => {
        // Use response data if available, otherwise keep optimistic update
        if (response?.favoris) {
          this._favoris.set(response.favoris);
        }
        this.saveToStorage(this._favoris());
        this._lastUpdated.set(new Date());
        this._isLoading.set(false);
        this.showMessage(`${technologyName} retiré de vos favoris`, 'success');
      }),
      map(() => true),
      catchError((error) => {
        // Rollback on error
        console.error('Error removing favoris:', error);
        this._favoris.set(previousFavoris);
        this._error.set('Erreur lors de la suppression du favori');
        this._isLoading.set(false);
        this.showMessage('Erreur lors de la suppression du favori', 'error');
        return of(false);
      })
    );
  }

  /**
   * Toggle a technology in favorites (add if not present, remove if present)
   */
  toggleFavoris(technology: Technology | FavoriteTechnology): Observable<boolean> {
    if (this.isFavoris(technology.name)) {
      return this.removeFavoris(technology.name);
    } else {
      return this.addFavoris(technology);
    }
  }

  /**
   * Check if a technology is in favorites
   */
  isFavoris(technologyName: string): boolean {
    return this._favoris().some(f => f.name === technologyName);
  }

  /**
   * Get a specific favorite by name
   */
  getFavoris(technologyName: string): FavoriteTechnology | undefined {
    return this._favoris().find(f => f.name === technologyName);
  }

  /**
   * Clear all favoris (local state only, does not persist)
   */
  clearLocalState(): void {
    this._favoris.set([]);
    this._error.set(null);
    this._lastUpdated.set(null);
    if (this.isBrowser) {
      localStorage.removeItem(FAVORIS_STORAGE_KEY);
    }
  }

  /**
   * Set favoris directly (used when receiving data from login/signup)
   */
  setFavoris(favoris: FavoriteTechnology[]): void {
    this._favoris.set(favoris || []);
    this.saveToStorage(this._favoris());
    this._lastUpdated.set(new Date());
  }

  /**
   * Save favoris to localStorage
   */
  private saveToStorage(favoris: FavoriteTechnology[]): void {
    if (!this.isBrowser) {
      return;
    }

    try {
      localStorage.setItem(FAVORIS_STORAGE_KEY, JSON.stringify(favoris));
    } catch (error) {
      console.error('Error saving favoris to localStorage:', error);
      // Handle quota exceeded error
      if (error instanceof DOMException && error.name === 'QuotaExceededError') {
        this._error.set('Espace de stockage insuffisant');
      }
    }
  }

  /**
   * Get user ID from stored user data
   */
  private getUserId(): string | null {
    if (!this.isBrowser) {
      return null;
    }

    try {
      const userStr = localStorage.getItem(USER_STORAGE_KEY);
      if (userStr) {
        const user = JSON.parse(userStr);
        return user._id || user.id || null;
      }
    } catch (error) {
      console.error('Error getting user ID:', error);
    }

    return this.authService.getUserId();
  }

  /**
   * Show a snackbar message
   */
  private showMessage(message: string, type: 'success' | 'error' | 'info' = 'info'): void {
    if (!this.isBrowser) {
      return;
    }

    const panelClass = type === 'success' ? 'snackbar-success' : type === 'error' ? 'snackbar-error' : '';

    this.snackBar.open(message, '', {
      duration: 3000,
      horizontalPosition: 'center',
      verticalPosition: 'top',
      panelClass: panelClass ? [panelClass] : undefined
    });
  }
}
