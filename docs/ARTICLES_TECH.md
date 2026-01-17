# Articles Techniques - Verstack

Ce fichier documente les problèmes techniques rencontrés et leurs solutions, destinés à être transformés en articles pour Medium ou autres plateformes.

---

## 1. SSR Hydration Mismatch avec Angular et l'Authentification

**Date:** 17 janvier 2026
**Tags:** Angular, SSR, Hydration, Authentication, Server-Side Rendering

### Le Problème

Après connexion à l'application, un rafraîchissement de la page provoquait l'affichage simultané des boutons "Connexion" ET "Déconnexion" dans le header.

### Contexte Technique

- **Framework:** Angular 21 avec SSR activé
- **Configuration:** `outputMode: "server"` dans angular.json
- **Symptôme:** Les vues conditionnelles `@if(authStatus)` et `@if(!authStatus)` s'affichaient toutes les deux

### Analyse du Problème

Le problème vient de la différence d'état entre le serveur et le client :

1. **Côté Serveur (SSR):**
   - `localStorage` n'existe pas
   - `authStatus` est initialisé à `false`
   - Le HTML rendu contient le bouton "Connexion"

2. **Côté Client (Hydratation):**
   - `localStorage` contient le token JWT
   - `authStatus` devient `true` après vérification
   - Angular tente d'hydrater le DOM existant

3. **Le Conflit:**
   - L'hydratation Angular ne synchronise pas correctement les blocs conditionnels `@if`
   - Les deux états sont rendus simultanément

### La Solution

**1. Utiliser un état "indéterminé" pendant l'hydratation:**

```typescript
// Avant
authStatus: boolean = false;

// Après
authStatus: boolean | null = null; // null = pas encore déterminé
```

**2. Initialiser l'auth uniquement après hydratation avec `afterNextRender()`:**

```typescript
import { afterNextRender, ChangeDetectorRef } from '@angular/core';

constructor(private cdr: ChangeDetectorRef) {
  afterNextRender(() => {
    this.initializeAuth();
  });
}

private initializeAuth(): void {
  this.authService.getAuthStatus().subscribe(status => {
    this.authStatus = status;
    this.cdr.markForCheck();
  });
}
```

**3. Adapter le template avec 3 états:**

```html
@if(authStatus === null){
  <!-- Loading state during SSR hydration - show nothing -->
} @else if(authStatus === false){
  <a routerLink="/login">Connexion</a>
} @else {
  <a (click)="logout()">Déconnexion</a>
}
```

### Points Clés à Retenir

1. **Ne jamais initialiser un état côté serveur** qui dépend de données client-only (localStorage, cookies, etc.)
2. **`afterNextRender()`** est l'API Angular recommandée pour exécuter du code uniquement après hydratation
3. **Utiliser un état ternaire** (null/false/true) permet de gérer proprement la phase d'hydratation
4. **`ChangeDetectorRef.markForCheck()`** est nécessaire pour forcer la mise à jour après un changement asynchrone post-hydratation

### Ressources

- [Angular SSR Documentation](https://angular.dev/guide/ssr)
- [afterNextRender API](https://angular.dev/api/core/afterNextRender)

---

## 2. Memory Leaks dans un Composant Canvas/Animation (Globe 3D)

**Date:** 17 janvier 2026
**Tags:** Angular, Memory Leak, Canvas, requestAnimationFrame, RxJS, Performance

### Le Problème

Un composant Globe 3D animé avec Canvas provoquait des fuites de mémoire, ralentissant progressivement l'application après plusieurs navigations.

### Contexte Technique

- **Composant:** Globe animé avec des logos tournants en 3D
- **Technologies:** Canvas 2D, requestAnimationFrame, IntersectionObserver, RxJS
- **Symptômes:** Mémoire croissante, animations qui continuent après destruction du composant

### Analyse du Problème

**4 sources de fuites identifiées :**

1. **HTTP Subscription non désabonnée:**
```typescript
// PROBLÈME: La subscription vit indéfiniment
this._fieldService.getAllImages().subscribe({...});
```

2. **Promise handlers exécutés après destruction:**
```typescript
// PROBLÈME: then() s'exécute même si le composant est détruit
Promise.all(promises).then(() => this.onAllImagesLoaded());
```

3. **Event handlers sur les images jamais nettoyés:**
```typescript
// PROBLÈME: onload/onerror gardent une référence au composant
img.onload = () => { ... };
img.onerror = reject;
```

4. **Cache statique qui grossit indéfiniment:**
```typescript
// PROBLÈME: Le cache n'est jamais vidé
private static imageCache = new Map<string, HTMLImageElement>();
```

### La Solution

**1. Utiliser `takeUntil` pour les subscriptions HTTP:**

```typescript
private destroy$ = new Subject<void>();

this._fieldService.getAllImages()
  .pipe(takeUntil(this.destroy$))
  .subscribe({...});

ngOnDestroy(): void {
  this.destroy$.next();
  this.destroy$.complete();
}
```

**2. Ajouter un flag `isDestroyed` pour les Promises:**

```typescript
private isDestroyed = false;

Promise.all(promises)
  .then(() => {
    if (!this.isDestroyed) {
      this.onAllImagesLoaded();
    }
  });

ngOnDestroy(): void {
  this.isDestroyed = true;
}
```

**3. Tracker et nettoyer les handlers d'images:**

```typescript
private pendingImages: HTMLImageElement[] = [];

// Dans la création d'image
const img = new Image();
this.pendingImages.push(img);
img.onload = () => {
  if (this.isDestroyed) return;
  // ...
};

// Dans ngOnDestroy
for (const img of this.pendingImages) {
  img.onload = null;
  img.onerror = null;
  img.src = ''; // Annule le chargement en cours
}
this.pendingImages.length = 0;
```

**4. ngOnDestroy complet:**

```typescript
ngOnDestroy(): void {
  this.isDestroyed = true;
  this.destroy$.next();
  this.destroy$.complete();

  // Annuler l'animation
  if (this.animationFrameId !== null) {
    cancelAnimationFrame(this.animationFrameId);
  }

  // Déconnecter l'observer
  this.observer?.disconnect();

  // Nettoyer les images en cours de chargement
  for (const img of this.pendingImages) {
    img.onload = null;
    img.onerror = null;
    img.src = '';
  }
  this.pendingImages.length = 0;

  // Compléter les BehaviorSubjects
  this.loading$.complete();
  this.loadingProgress$.complete();

  // Vider les tableaux
  this.logos.length = 0;
  this.points.length = 0;

  // Nettoyer le canvas
  this.ctx?.clearRect(0, 0, this.canvasRef.nativeElement.width, this.canvasRef.nativeElement.height);
}
```

### Points Clés à Retenir

1. **Toujours désabonner les Observables** avec `takeUntil` + Subject
2. **Les Promises ne peuvent pas être annulées** - utiliser un flag `isDestroyed`
3. **Les event handlers sur les éléments DOM** (img.onload) créent des closures qui gardent des références
4. **`cancelAnimationFrame()`** est obligatoire pour stopper les animations
5. **Les caches statiques** doivent avoir une stratégie de nettoyage (LRU, TTL, ou WeakMap)

### Ressources

- [Angular Lifecycle Hooks](https://angular.dev/guide/components/lifecycle)
- [Memory Management in JavaScript](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Memory_Management)

---

## 3. Migration des Tests Angular 21 - Standalone Components

**Date:** 17 janvier 2026
**Tags:** Angular, Testing, Jasmine, Karma, Standalone Components, Migration

### Le Problème

Après migration vers Angular 21, 28 tests unitaires échouaient avec diverses erreurs liées aux modules et providers manquants.

### Contexte Technique

- **Migration:** Angular 19 → Angular 21
- **Changement majeur:** Standalone components par défaut
- **Erreurs:** NullInjectorError, RouterModule errors, HttpClient missing

### Types d'Erreurs Rencontrées

**1. Erreur Router:**
```
NullInjectorError: No provider for Router!
```

**2. Erreur HttpClient:**
```
NullInjectorError: No provider for HttpClient!
```

**3. Erreur PLATFORM_ID:**
```
NullInjectorError: No provider for InjectionToken PLATFORM_ID!
```

**4. Erreur Standalone dans declarations:**
```
Component X is standalone, and cannot be declared in an NgModule
```

### La Solution

**Pattern de test moderne Angular 21:**

```typescript
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { PLATFORM_ID } from '@angular/core';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

describe('MyComponent', () => {
  let component: MyComponent;
  let fixture: ComponentFixture<MyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      // IMPORTANT: Les standalone components vont dans imports, pas declarations
      imports: [MyComponent, NoopAnimationsModule],
      providers: [
        provideRouter([]),
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: PLATFORM_ID, useValue: 'browser' }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(MyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
```

**Pour tester une Directive Standalone:**

```typescript
@Component({
  standalone: true,
  imports: [IsDesktopOnlyDirective],
  template: `<div *isDesktopOnly>desktop</div>`
})
class TestComponent {}

describe('IsDesktopOnlyDirective', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TestComponent], // Le TestComponent doit aussi être importé
      providers: [
        { provide: DeviceService, useValue: mockDeviceService },
        { provide: PLATFORM_ID, useValue: 'browser' }
      ]
    });
  });
});
```

**Pour mocker un JWT token (Guards):**

```typescript
// NE PAS utiliser spyOn sur jwtDecode - créer de vrais tokens
function createToken(payload: object): string {
  const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
  const body = btoa(JSON.stringify(payload));
  const signature = 'fake-signature';
  return `${header}.${body}.${signature}`;
}

// Usage
const validToken = createToken({
  role: 'admin',
  exp: Math.floor(Date.now() / 1000) + 3600
});
spyOn(localStorage, 'getItem').and.returnValue(validToken);
```

**Pour mocker navigator.userAgent:**

```typescript
// spyOnProperty ne fonctionne pas sur navigator.userAgent
// Utiliser Object.defineProperty à la place
beforeEach(() => {
  originalUserAgent = navigator.userAgent;
});

afterEach(() => {
  Object.defineProperty(navigator, 'userAgent', {
    value: originalUserAgent,
    configurable: true
  });
});

it('should detect mobile', () => {
  Object.defineProperty(navigator, 'userAgent', {
    value: 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X)',
    configurable: true
  });
  // ...
});
```

### Points Clés à Retenir

1. **Standalone components** → `imports: [Component]` pas `declarations`
2. **`provideRouter([])`** remplace `RouterTestingModule`
3. **`provideHttpClient()` + `provideHttpClientTesting()`** remplacent `HttpClientTestingModule`
4. **`PLATFORM_ID`** est souvent nécessaire pour les composants SSR-aware
5. **Ne pas mocker `jwtDecode`** - créer de vrais tokens base64
6. **`navigator.userAgent`** doit être mocké avec `Object.defineProperty`

### Ressources

- [Angular Testing Guide](https://angular.dev/guide/testing)
- [Standalone Components](https://angular.dev/guide/components/importing)

---

## 4. Refactoring d'État avec Angular Signals - Gestion des Favoris

**Date:** 17 janvier 2026
**Tags:** Angular, Signals, State Management, Refactoring, RxJS

### Le Problème

La gestion des favoris était dispersée dans plusieurs composants avec des implémentations incohérentes, causant des problèmes de synchronisation et de maintenance.

### Contexte Technique

- **Avant:** Chaque composant gérait ses propres favoris localement
- **Problèmes:**
  - Duplication de code
  - État désynchronisé entre composants
  - Persistance localStorage incohérente
  - Pas de type safety

### La Solution

**1. Créer une interface typée:**

```typescript
// models/technology.interface.ts
export interface Technology {
  id: number;
  name: string;
  logo: string;
  currentVersion?: string;
  ltsVersion?: string;
  popularity?: number;
  ranking?: number;
}
```

**2. Service centralisé avec Signals:**

```typescript
@Injectable({ providedIn: 'root' })
export class FavorisService {
  private readonly STORAGE_KEY = 'verstack_favoris';

  // Signal privé pour l'état interne
  private favorisSignal = signal<Technology[]>([]);

  // Signal public en lecture seule
  readonly favoris = this.favorisSignal.asReadonly();

  // Computed signals pour les dérivations
  readonly count = computed(() => this.favorisSignal().length);
  readonly isEmpty = computed(() => this.favorisSignal().length === 0);

  constructor(private platformService: PlatformService) {
    if (this.platformService.isBrowser) {
      this.loadFromStorage();
    }
  }

  isFavori(tech: Technology): boolean {
    return this.favorisSignal().some(f => f.id === tech.id);
  }

  toggleFavori(tech: Technology): void {
    if (this.isFavori(tech)) {
      this.removeFavori(tech);
    } else {
      this.addFavori(tech);
    }
  }

  addFavori(tech: Technology): void {
    if (!this.isFavori(tech)) {
      this.favorisSignal.update(current => [...current, tech]);
      this.saveToStorage();
    }
  }

  removeFavori(tech: Technology): void {
    this.favorisSignal.update(current =>
      current.filter(f => f.id !== tech.id)
    );
    this.saveToStorage();
  }

  // Synchronisation avec le backend après login
  setFavoris(favoris: Technology[]): void {
    this.favorisSignal.set(favoris);
    this.saveToStorage();
  }

  private loadFromStorage(): void {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      if (stored) {
        this.favorisSignal.set(JSON.parse(stored));
      }
    } catch (e) {
      console.error('Error loading favoris:', e);
    }
  }

  private saveToStorage(): void {
    if (this.platformService.isBrowser) {
      localStorage.setItem(
        this.STORAGE_KEY,
        JSON.stringify(this.favorisSignal())
      );
    }
  }
}
```

**3. Utilisation dans les composants:**

```typescript
@Component({...})
export class TechCardComponent {
  private favorisService = inject(FavorisService);

  // Accès réactif aux favoris
  favoris = this.favorisService.favoris;
  count = this.favorisService.count;

  isFavori(tech: Technology): boolean {
    return this.favorisService.isFavori(tech);
  }

  toggleFavori(tech: Technology): void {
    this.favorisService.toggleFavori(tech);
  }
}
```

**4. Dans le template:**

```html
<button (click)="toggleFavori(tech)" [class.active]="isFavori(tech)">
  <mat-icon>{{ isFavori(tech) ? 'star' : 'star_border' }}</mat-icon>
</button>

<span class="count">{{ count() }} favoris</span>
```

### Architecture Finale

```
┌─────────────────────────────────────────────────────────┐
│                    FavorisService                        │
│  ┌─────────────────────────────────────────────────┐    │
│  │  favorisSignal = signal<Technology[]>([])       │    │
│  │  favoris = asReadonly()                         │    │
│  │  count = computed()                             │    │
│  └─────────────────────────────────────────────────┘    │
│                          │                               │
│              ┌───────────┼───────────┐                  │
│              ▼           ▼           ▼                  │
│         addFavori   removeFavori  toggleFavori          │
│              │           │           │                  │
│              └───────────┴───────────┘                  │
│                          │                               │
│                    saveToStorage()                       │
│                          │                               │
│                    localStorage                          │
└─────────────────────────────────────────────────────────┘
         │                 │                 │
         ▼                 ▼                 ▼
   TechCardComponent  HomeComponent   ProfileComponent
```

### Points Clés à Retenir

1. **Signals vs BehaviorSubject:** Signals sont plus simples et mieux intégrés avec Angular
2. **`asReadonly()`** empêche les modifications externes accidentelles
3. **`computed()`** pour les valeurs dérivées recalculées automatiquement
4. **`update()`** pour les modifications basées sur l'état précédent
5. **Centraliser la persistance** dans le service, pas dans les composants
6. **Type safety** avec des interfaces bien définies

### Tests Unitaires

```typescript
describe('FavorisService', () => {
  it('should add a favori', () => {
    const tech = { id: 1, name: 'Angular', logo: 'angular.png' };
    service.addFavori(tech);
    expect(service.favoris()).toContain(tech);
    expect(service.count()).toBe(1);
  });

  it('should not add duplicate', () => {
    const tech = { id: 1, name: 'Angular', logo: 'angular.png' };
    service.addFavori(tech);
    service.addFavori(tech);
    expect(service.count()).toBe(1);
  });

  it('should toggle favori', () => {
    const tech = { id: 1, name: 'Angular', logo: 'angular.png' };
    service.toggleFavori(tech);
    expect(service.isFavori(tech)).toBeTrue();
    service.toggleFavori(tech);
    expect(service.isFavori(tech)).toBeFalse();
  });
});
```

### Ressources

- [Angular Signals](https://angular.dev/guide/signals)
- [State Management Patterns](https://angular.dev/guide/signals#state-management)

---

## Template pour Nouveaux Articles

```markdown
## [Numéro]. [Titre du Problème]

**Date:** [Date]
**Tags:** [Tags séparés par virgules]

### Le Problème
[Description courte du symptôme visible]

### Contexte Technique
[Stack, versions, configuration]

### Analyse du Problème
[Explication détaillée de la cause]

### La Solution
[Code et explications]

### Points Clés à Retenir
[Bullets des leçons apprises]

### Ressources
[Liens utiles]
```

---

## Index des Articles

| # | Titre | Tags | Difficulté |
|---|-------|------|------------|
| 1 | SSR Hydration Mismatch | Angular, SSR | Avancé |
| 2 | Memory Leaks Canvas/Animation | Performance, Canvas | Avancé |
| 3 | Migration Tests Angular 21 | Testing, Migration | Intermédiaire |
| 4 | State Management avec Signals | Signals, Architecture | Intermédiaire |

---

*Dernière mise à jour: 17 janvier 2026*
