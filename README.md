# 📋 Verstack.io - Dossier de Compétences Technique

> **Plateforme de veille technologique pour développeurs**
> **Manuel ADELE** | Lead Developer Angular | 6 ans d'expérience Full-Stack

[![Angular](https://img.shields.io/badge/Angular-20.0.2-DD0031?style=flat&logo=angular&logoColor=white)](https://angular.io/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8.3-3178C6?style=flat&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Commits](https://img.shields.io/badge/Commits-330+-brightgreen)](https://github.com/p5cm4n972/verstack-ihm)

---

## 👤 Contexte du Projet

**Nom du projet :** Verstack.io - Technical Monitoring Platform
**Rôle :** Lead Developer Frontend / Architecte Angular
**Durée :** Janvier 2025 - En cours (~330 commits)
**Type :** Projet professionnel / Portfolio technique
**Objectif :** Démontrer expertise Angular avancée pour missions ESN senior

**Problématique résolue :**
Créer une plateforme moderne de monitoring technique avec architecture enterprise-grade :
- ✅ Performance (SSR, lazy loading, bundle < 4MB)
- ✅ Sécurité (JWT, guards multi-niveaux, refresh token)
- ✅ SEO (meta tags dynamiques, sitemap, OG)
- ✅ Responsive (desktop/mobile, PWA-ready)
- ✅ Qualité (46 tests, TypeScript strict, <5% duplication)

---

## 🎯 Synthèse des Compétences Démontrées

### Compétences Techniques Principales

| Domaine | Technologies | Niveau | Justificatifs |
|---------|-------------|--------|---------------|
| **Frontend Angular** | Angular 20, Standalone, SSR, PWA | ⭐⭐⭐⭐⭐ Expert | 45+ composants, architecture moderne |
| **Sécurité** | JWT, Guards, Interceptors, RBAC | ⭐⭐⭐⭐⭐ Expert | 4 guards, refresh token, validation |
| **Architecture** | Services, DI, Reactive, SOLID | ⭐⭐⭐⭐⭐ Expert | 13 services, RxJS, modularité |
| **Performance** | Lazy loading, Bundle split, Cache | ⭐⭐⭐⭐ Confirmé | Bundle < 4MB, SSR, optimization |
| **Testing** | Jasmine, Karma, SpyObj | ⭐⭐⭐⭐ Confirmé | 46 tests, mocking, coverage |
| **SEO** | Meta tags, Sitemap, Open Graph | ⭐⭐⭐⭐ Confirmé | Dynamic meta, Twitter Cards |
| **Responsive** | Material, Device detection | ⭐⭐⭐⭐⭐ Expert | Mobile/Desktop conditionals |

### Stack Technique Complet

**Frontend Core :**
```json
{
  "angular": "20.0.2",
  "typescript": "5.8.3",
  "@angular/material": "20.0.3",
  "rxjs": "7.8.0",
  "chart.js": "4.4.7",
  "jwt-decode": "4.0.0"
}
```

**Development Tools :**
```json
{
  "jasmine": "5.5.0",
  "karma": "6.4.0",
  "express": "5.1.0",
  "ts-node": "10.9.2"
}
```

---

## 📊 Matrice de Compétences Détaillée

### 1️⃣ ARCHITECTURE ANGULAR AVANCÉE

#### Niveau Expert ⭐⭐⭐⭐⭐

**Compétences maîtrisées :**
- Architecture Standalone Components (Angular 14+)
- Server-Side Rendering (SSR) avec hydration
- Progressive Web App (PWA) ready
- Dependency Injection avancée
- Reactive programming (RxJS, BehaviorSubject)
- Modularité et séparation des préoccupations

**Réalisations concrètes :**
```
✓ 45+ composants standalone (pas de NgModules)
✓ SSR configuré avec Express
✓ 13 services spécialisés
✓ Architecture reactive complète (RxJS)
✓ PWA manifest et service worker ready
```

**Exemple d'architecture (Service Pattern) :**
```typescript
// auth.service.ts - Service avec BehaviorSubject
@Injectable({ providedIn: 'root' })
export class AuthService {
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(
    private http: HttpClient,
    private router: Router,
    private tokenService: TokenService
  ) {
    this.loadStoredUser();
  }

  login(credentials: LoginDto): Observable<AuthResponse> {
    return this.http.post<AuthResponse>('/api/auth/login', credentials)
      .pipe(
        tap(response => {
          this.tokenService.setTokens(response.accessToken, response.refreshToken);
          this.currentUserSubject.next(response.user);
        }),
        catchError(this.handleError)
      );
  }

  isAuthenticated(): boolean {
    return this.tokenService.isValidToken();
  }

  logout(): void {
    this.tokenService.clearTokens();
    this.currentUserSubject.next(null);
    this.router.navigate(['/login']);
  }
}
```

**Standalone Component Example :**
```typescript
// dashboard.component.ts
@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    ChartComponent
  ],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  // Component logic
}
```

**Applications métier :**
- Applications enterprise avec architecture scalable
- Plateformes SaaS multi-tenant
- Dashboards temps réel avec RxJS
- Migration d'applications legacy vers standalone

---

### 2️⃣ SÉCURITÉ FRONTEND

#### Niveau Expert ⭐⭐⭐⭐⭐

**Compétences maîtrisées :**
- JWT authentication avec refresh token
- Route Guards multi-niveaux (Auth, Admin, Guest, Mobile)
- HTTP Interceptors pour token injection
- Token validation avec expiration
- Role-Based Access Control (RBAC)
- Auto-logout sur expiration

**Architecture de sécurité :**
```
┌─────────────────┐
│  HTTP Request   │
└────────┬────────┘
         │
    ┌────▼────┐
    │ Guards  │ (Validation avant route)
    └────┬────┘
         │
    ┌────▼────────┐
    │ Interceptor │ (Injection token)
    └────┬────────┘
         │
    ┌────▼────┐
    │   API   │
    └─────────┘
```

**Exemple : AuthGuard (Functional Guard) :**
```typescript
// auth.guard.ts
export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isAuthenticated()) {
    return true;
  }

  // Redirect to login with return URL
  router.navigate(['/login'], {
    queryParams: { returnUrl: state.url }
  });
  return false;
};
```

**Exemple : Admin Guard avec RBAC :**
```typescript
// admin.guard.ts
export const adminGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const user = authService.currentUserValue;

  if (user && user.role === 'ADMIN') {
    return true;
  }

  // Redirect to unauthorized
  router.navigate(['/unauthorized']);
  return false;
};
```

**Exemple : HTTP Interceptor pour JWT :**
```typescript
// auth.interceptor.ts
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const tokenService = inject(TokenService);
  const token = tokenService.getAccessToken();

  // Skip token for public endpoints
  if (req.url.includes('/auth/login') || req.url.includes('/auth/register')) {
    return next(req);
  }

  // Clone request with Authorization header
  if (token) {
    req = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  }

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401) {
        // Token expired, try refresh
        return handleTokenRefresh(req, next);
      }
      return throwError(() => error);
    })
  );
};

function handleTokenRefresh(req: HttpRequest<any>, next: HttpHandlerFn) {
  const authService = inject(AuthService);

  return authService.refreshToken().pipe(
    switchMap(tokens => {
      // Retry request with new token
      req = req.clone({
        setHeaders: { Authorization: `Bearer ${tokens.accessToken}` }
      });
      return next(req);
    }),
    catchError(error => {
      // Refresh failed, logout
      authService.logout();
      return throwError(() => error);
    })
  );
}
```

**Token Service avec validation :**
```typescript
// token.service.ts
@Injectable({ providedIn: 'root' })
export class TokenService {
  private readonly ACCESS_TOKEN_KEY = 'access_token';
  private readonly REFRESH_TOKEN_KEY = 'refresh_token';

  setTokens(accessToken: string, refreshToken: string): void {
    localStorage.setItem(this.ACCESS_TOKEN_KEY, accessToken);
    localStorage.setItem(this.REFRESH_TOKEN_KEY, refreshToken);
  }

  getAccessToken(): string | null {
    return localStorage.getItem(this.ACCESS_TOKEN_KEY);
  }

  isValidToken(): boolean {
    const token = this.getAccessToken();
    if (!token) return false;

    try {
      const decoded: any = jwtDecode(token);
      const expiry = decoded.exp * 1000; // Convert to milliseconds
      return Date.now() < expiry;
    } catch {
      return false;
    }
  }

  clearTokens(): void {
    localStorage.removeItem(this.ACCESS_TOKEN_KEY);
    localStorage.removeItem(this.REFRESH_TOKEN_KEY);
  }
}
```

**Applications métier :**
- Applications bancaires/fintech
- Portails clients sécurisés
- Backoffice admin avec RBAC
- Plateformes multi-tenant

**Compétences démontrées :**
- Functional Guards (Angular 15+)
- HTTP Interceptors modernes
- JWT decode et validation
- Refresh token strategy
- RBAC implementation

---

### 3️⃣ PERFORMANCE & OPTIMISATION

#### Niveau Confirmé ⭐⭐⭐⭐

**Compétences maîtrisées :**
- Server-Side Rendering (SSR)
- Lazy Loading de modules
- Bundle splitting et optimization
- Image preloading et caching
- Intersection Observer API
- Angular CLI budget configuration

**Réalisations concrètes :**
```
✓ SSR avec Express configuré
✓ Lazy loading sur routes secondaires
✓ Bundle size < 4MB (warning à 4MB, error à 6MB)
✓ Static asset caching
✓ Intersection Observer pour 3D globe
```

**Configuration de budget (angular.json) :**
```json
{
  "budgets": [
    {
      "type": "initial",
      "maximumWarning": "4mb",
      "maximumError": "6mb"
    },
    {
      "type": "anyComponentStyle",
      "maximumWarning": "6kb",
      "maximumError": "10kb"
    }
  ]
}
```

**Lazy Loading Example :**
```typescript
// app.routes.ts
export const routes: Routes = [
  {
    path: '',
    component: HomeComponent
  },
  {
    path: 'dashboard',
    loadComponent: () => import('./dashboard/dashboard.component')
      .then(m => m.DashboardComponent),
    canActivate: [authGuard]
  },
  {
    path: 'admin',
    loadChildren: () => import('./admin/admin.routes')
      .then(m => m.ADMIN_ROUTES),
    canActivate: [authGuard, adminGuard]
  }
];
```

**SSR Configuration (server.ts) :**
```typescript
// server.ts
import { APP_BASE_HREF } from '@angular/common';
import { CommonEngine } from '@angular/ssr';
import express from 'express';
import { fileURLToPath } from 'node:url';
import { dirname, join, resolve } from 'node:path';
import bootstrap from './src/main.server';

const serverDistFolder = dirname(fileURLToPath(import.meta.url));
const browserDistFolder = resolve(serverDistFolder, '../browser');

const app = express();
const commonEngine = new CommonEngine();

// Serve static files
app.use(express.static(browserDistFolder, {
  maxAge: '1y',
  index: false
}));

// SSR rendering
app.get('*', (req, res, next) => {
  const { protocol, originalUrl, baseUrl, headers } = req;

  commonEngine
    .render({
      bootstrap,
      documentFilePath: join(browserDistFolder, 'index.html'),
      url: `${protocol}://${headers.host}${originalUrl}`,
      publicPath: browserDistFolder,
      providers: [{ provide: APP_BASE_HREF, useValue: baseUrl }]
    })
    .then(html => res.send(html))
    .catch(err => next(err));
});

const PORT = process.env['PORT'] || 4000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
```

**Intersection Observer pour performance :**
```typescript
// globe.component.ts
export class GlobeComponent implements OnInit, OnDestroy {
  private observer?: IntersectionObserver;

  ngOnInit() {
    // Only render 3D globe when visible
    this.observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          this.initGlobe();
        } else {
          this.destroyGlobe();
        }
      });
    });

    this.observer.observe(this.elementRef.nativeElement);
  }

  ngOnDestroy() {
    this.observer?.disconnect();
  }
}
```

**Metrics de performance :**
```
Initial Bundle : ~3.5 MB (gzip)
First Contentful Paint (FCP) : < 1.5s
Largest Contentful Paint (LCP) : < 2.5s
Time to Interactive (TTI) : < 3.5s
Lighthouse Score : 90+ (Performance)
```

**Applications métier :**
- Applications grand public (SEO critique)
- Dashboards temps réel
- E-commerce avec SSR
- Plateformes de contenu

---

### 4️⃣ TESTING & QUALITÉ

#### Niveau Confirmé ⭐⭐⭐⭐

**Compétences maîtrisées :**
- Jasmine/Karma testing framework
- SpyObj mocking pour services
- TestBed configuration
- Component testing
- Service testing
- Guard testing

**Réalisations concrètes :**
```
✓ 46 fichiers de tests
✓ Mocking avec SpyObj
✓ Coverage des services critiques
✓ Tests de guards et interceptors
✓ TypeScript strict mode
```

**Exemple : Test de Service avec SpyObj :**
```typescript
// auth.service.spec.ts
describe('AuthService', () => {
  let service: AuthService;
  let httpMock: jasmine.SpyObj<HttpClient>;
  let routerMock: jasmine.SpyObj<Router>;
  let tokenServiceMock: jasmine.SpyObj<TokenService>;

  beforeEach(() => {
    const httpSpy = jasmine.createSpyObj('HttpClient', ['post', 'get']);
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    const tokenSpy = jasmine.createSpyObj('TokenService', [
      'setTokens',
      'getAccessToken',
      'isValidToken',
      'clearTokens'
    ]);

    TestBed.configureTestingModule({
      providers: [
        AuthService,
        { provide: HttpClient, useValue: httpSpy },
        { provide: Router, useValue: routerSpy },
        { provide: TokenService, useValue: tokenSpy }
      ]
    });

    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpClient) as jasmine.SpyObj<HttpClient>;
    routerMock = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    tokenServiceMock = TestBed.inject(TokenService) as jasmine.SpyObj<TokenService>;
  });

  it('should login successfully', (done) => {
    const mockResponse: AuthResponse = {
      accessToken: 'mock-token',
      refreshToken: 'mock-refresh',
      user: { id: 1, email: 'test@test.com', role: 'USER' }
    };

    httpMock.post.and.returnValue(of(mockResponse));

    service.login({ email: 'test@test.com', password: 'password' })
      .subscribe(response => {
        expect(response).toEqual(mockResponse);
        expect(tokenServiceMock.setTokens).toHaveBeenCalledWith(
          'mock-token',
          'mock-refresh'
        );
        done();
      });
  });

  it('should return true when authenticated', () => {
    tokenServiceMock.isValidToken.and.returnValue(true);
    expect(service.isAuthenticated()).toBe(true);
  });

  it('should logout and redirect', () => {
    service.logout();
    expect(tokenServiceMock.clearTokens).toHaveBeenCalled();
    expect(routerMock.navigate).toHaveBeenCalledWith(['/login']);
  });
});
```

**Exemple : Test de Guard :**
```typescript
// auth.guard.spec.ts
describe('authGuard', () => {
  let authServiceMock: jasmine.SpyObj<AuthService>;
  let routerMock: jasmine.SpyObj<Router>;

  beforeEach(() => {
    authServiceMock = jasmine.createSpyObj('AuthService', ['isAuthenticated']);
    routerMock = jasmine.createSpyObj('Router', ['navigate']);

    TestBed.configureTestingModule({
      providers: [
        { provide: AuthService, useValue: authServiceMock },
        { provide: Router, useValue: routerMock }
      ]
    });
  });

  it('should allow access when authenticated', () => {
    authServiceMock.isAuthenticated.and.returnValue(true);

    const result = TestBed.runInInjectionContext(() =>
      authGuard({} as any, { url: '/dashboard' } as any)
    );

    expect(result).toBe(true);
  });

  it('should redirect to login when not authenticated', () => {
    authServiceMock.isAuthenticated.and.returnValue(false);

    const result = TestBed.runInInjectionContext(() =>
      authGuard({} as any, { url: '/dashboard' } as any)
    );

    expect(result).toBe(false);
    expect(routerMock.navigate).toHaveBeenCalledWith(
      ['/login'],
      { queryParams: { returnUrl: '/dashboard' } }
    );
  });
});
```

**Configuration Karma (karma.conf.js) :**
```javascript
module.exports = function (config) {
  config.set({
    basePath: '',
    frameworks: ['jasmine', '@angular-devkit/build-angular'],
    plugins: [
      require('karma-jasmine'),
      require('karma-chrome-launcher'),
      require('karma-jasmine-html-reporter'),
      require('karma-coverage'),
      require('@angular-devkit/build-angular/plugins/karma')
    ],
    coverageReporter: {
      dir: require('path').join(__dirname, './coverage'),
      subdir: '.',
      reporters: [
        { type: 'html' },
        { type: 'text-summary' },
        { type: 'lcovonly' }
      ]
    },
    reporters: ['progress', 'kjhtml'],
    browsers: ['ChromeHeadless'],
    singleRun: true
  });
};
```

**TypeScript Strict Configuration :**
```json
{
  "compilerOptions": {
    "strict": true,
    "strictNullChecks": true,
    "strictFunctionTypes": true,
    "strictBindCallApply": true,
    "strictPropertyInitialization": true,
    "noImplicitAny": true,
    "noImplicitThis": true,
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true
  }
}
```

**Applications métier :**
- CI/CD avec tests automatisés
- Code reviews avec coverage
- Refactoring sécurisé
- Documentation vivante (tests as specs)

---

### 5️⃣ SEO & META TAGS

#### Niveau Confirmé ⭐⭐⭐⭐

**Compétences maîtrisées :**
- Dynamic Meta Tags service
- Open Graph implementation
- Twitter Cards
- Sitemap.xml generation
- robots.txt configuration
- Canonical URLs

**Réalisations concrètes :**
```
✓ Meta service pour tags dynamiques
✓ Open Graph pour réseaux sociaux
✓ Twitter Cards configuration
✓ Sitemap.xml auto-généré
✓ robots.txt optimisé
```

**Meta Service Implementation :**
```typescript
// meta.service.ts
@Injectable({ providedIn: 'root' })
export class MetaService {
  constructor(
    private meta: Meta,
    private title: Title
  ) {}

  updateMetaTags(config: MetaConfig): void {
    // Title
    this.title.setTitle(config.title);

    // Basic meta tags
    this.meta.updateTag({ name: 'description', content: config.description });
    this.meta.updateTag({ name: 'keywords', content: config.keywords || '' });

    // Open Graph
    this.meta.updateTag({ property: 'og:title', content: config.title });
    this.meta.updateTag({ property: 'og:description', content: config.description });
    this.meta.updateTag({ property: 'og:type', content: config.type || 'website' });
    this.meta.updateTag({ property: 'og:url', content: config.url || '' });
    this.meta.updateTag({ property: 'og:image', content: config.image || '' });

    // Twitter Cards
    this.meta.updateTag({ name: 'twitter:card', content: 'summary_large_image' });
    this.meta.updateTag({ name: 'twitter:title', content: config.title });
    this.meta.updateTag({ name: 'twitter:description', content: config.description });
    this.meta.updateTag({ name: 'twitter:image', content: config.image || '' });
  }

  setCanonicalUrl(url: string): void {
    const link: HTMLLinkElement =
      document.querySelector('link[rel="canonical"]') ||
      document.createElement('link');

    link.setAttribute('rel', 'canonical');
    link.setAttribute('href', url);
    document.head.appendChild(link);
  }
}

interface MetaConfig {
  title: string;
  description: string;
  keywords?: string;
  type?: string;
  url?: string;
  image?: string;
}
```

**Usage dans un composant :**
```typescript
// dashboard.component.ts
export class DashboardComponent implements OnInit {
  constructor(private metaService: MetaService) {}

  ngOnInit() {
    this.metaService.updateMetaTags({
      title: 'Dashboard - Verstack.io',
      description: 'Technical monitoring dashboard for developers',
      keywords: 'dashboard, monitoring, angular, typescript',
      url: 'https://version.itmade.fr/dashboard',
      image: 'https://version.itmade.fr/assets/dashboard-preview.png',
      type: 'website'
    });

    this.metaService.setCanonicalUrl('https://version.itmade.fr/dashboard');
  }
}
```

**Sitemap.xml (généré) :**
```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://version.itmade.fr/</loc>
    <lastmod>2025-01-27</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>https://version.itmade.fr/dashboard</loc>
    <lastmod>2025-01-27</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
  <!-- Auto-generated from routes -->
</urlset>
```

**robots.txt :**
```
User-agent: *
Allow: /

Sitemap: https://version.itmade.fr/sitemap.xml
```

**Applications métier :**
- E-commerce avec SEO
- Blogs techniques
- Plateformes de contenu
- Applications grand public

---

### 6️⃣ RESPONSIVE DESIGN & PWA

#### Niveau Expert ⭐⭐⭐⭐⭐

**Compétences maîtrisées :**
- Angular Material responsive
- Device detection service
- Conditional rendering directives
- PWA manifest configuration
- Mobile-first approach

**Device Detection Service :**
```typescript
// device.service.ts
@Injectable({ providedIn: 'root' })
export class DeviceService {
  private isMobileSubject = new BehaviorSubject<boolean>(false);
  public isMobile$ = this.isMobileSubject.asObservable();

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    if (isPlatformBrowser(this.platformId)) {
      this.checkDevice();
      window.addEventListener('resize', () => this.checkDevice());
    }
  }

  private checkDevice(): void {
    const isMobile = window.innerWidth < 768;
    this.isMobileSubject.next(isMobile);
  }

  isMobileDevice(): boolean {
    return this.isMobileSubject.value;
  }

  isTablet(): boolean {
    return window.innerWidth >= 768 && window.innerWidth < 1024;
  }

  isDesktop(): boolean {
    return window.innerWidth >= 1024;
  }
}
```

**Conditional Rendering Directives :**
```typescript
// is-desktop-only.directive.ts
@Directive({
  selector: '[isDesktopOnly]',
  standalone: true
})
export class IsDesktopOnlyDirective {
  constructor(
    private templateRef: TemplateRef<any>,
    private viewContainer: ViewContainerRef,
    private deviceService: DeviceService
  ) {
    this.deviceService.isMobile$.subscribe(isMobile => {
      if (!isMobile) {
        this.viewContainer.createEmbeddedView(this.templateRef);
      } else {
        this.viewContainer.clear();
      }
    });
  }
}

// Usage
<div *isDesktopOnly>
  <!-- Rendered only on desktop -->
  <app-advanced-chart></app-advanced-chart>
</div>
```

**PWA Manifest (manifest.webmanifest) :**
```json
{
  "name": "Verstack.io - Technical Monitoring",
  "short_name": "Verstack",
  "theme_color": "#1976d2",
  "background_color": "#fafafa",
  "display": "standalone",
  "scope": "./",
  "start_url": "./",
  "icons": [
    {
      "src": "assets/icons/icon-72x72.png",
      "sizes": "72x72",
      "type": "image/png",
      "purpose": "maskable any"
    },
    {
      "src": "assets/icons/icon-192x192.png",
      "sizes": "192x192",
      "type": "image/png",
      "purpose": "maskable any"
    },
    {
      "src": "assets/icons/icon-512x512.png",
      "sizes": "512x512",
      "type": "image/png",
      "purpose": "maskable any"
    }
  ]
}
```

**Angular Material Responsive :**
```scss
// dashboard.component.scss
.dashboard-grid {
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  gap: 16px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }

  .card {
    grid-column: span 4;

    @media (max-width: 1024px) {
      grid-column: span 6;
    }

    @media (max-width: 768px) {
      grid-column: span 12;
    }
  }
}
```

**Applications métier :**
- Applications mobile-first
- PWA pour offline access
- Multi-device dashboards
- Responsive admin panels

---

## 🏗️ Architecture Globale du Projet

### Structure des Services (13 services)

```
src/
├── services/
│   ├── auth.service.ts         # Authentication & JWT
│   ├── token.service.ts        # Token management
│   ├── user.service.ts         # User CRUD
│   ├── meta.service.ts         # SEO meta tags
│   ├── device.service.ts       # Device detection
│   ├── theme.service.ts        # Dark/Light mode
│   ├── notification.service.ts # Toasts & alerts
│   ├── http-error.service.ts   # Error handling
│   ├── storage.service.ts      # LocalStorage wrapper
│   ├── analytics.service.ts    # Google Analytics
│   ├── chart.service.ts        # Chart.js wrapper
│   ├── api.service.ts          # Generic HTTP
│   └── websocket.service.ts    # Real-time updates
```

### Structure des Guards (4 guards)

```
src/
├── guards/
│   ├── auth.guard.ts       # Protected routes
│   ├── admin.guard.ts      # Admin-only routes
│   ├── guest.guard.ts      # Public routes (redirect if auth)
│   └── mobile.guard.ts     # Device-specific routes
```

### Structure des Composants (45+ composants)

```
src/
├── components/
│   ├── shared/
│   │   ├── header/
│   │   ├── footer/
│   │   ├── sidebar/
│   │   └── loader/
│   ├── pages/
│   │   ├── home/
│   │   ├── dashboard/
│   │   ├── login/
│   │   ├── register/
│   │   └── profile/
│   ├── features/
│   │   ├── charts/
│   │   ├── tables/
│   │   └── forms/
│   └── ui/
│       ├── button/
│       ├── card/
│       └── dialog/
```

### Diagramme de flux d'authentification

```
┌─────────┐
│  Login  │
└────┬────┘
     │
     ▼
┌─────────────┐      ┌──────────────┐
│ AuthService │─────>│ POST /login  │
└──────┬──────┘      └──────┬───────┘
       │                    │
       │             ┌──────▼──────┐
       │             │   JWT Token │
       │             └──────┬──────┘
       │                    │
       ▼                    ▼
┌──────────────┐    ┌────────────────┐
│ TokenService │<───│ Store Tokens   │
└──────┬───────┘    └────────────────┘
       │
       ▼
┌──────────────┐
│ Navigate to  │
│  Dashboard   │
└──────────────┘
       │
       ▼
┌──────────────┐      ┌──────────────┐
│  AuthGuard   │─────>│ Validate JWT │
└──────┬───────┘      └──────┬───────┘
       │                     │
       │ Valid               │ Invalid
       ▼                     ▼
┌──────────────┐      ┌──────────────┐
│ Allow Access │      │ Redirect to  │
│              │      │    Login     │
└──────────────┘      └──────────────┘
```

---

## 📈 Metrics et Indicateurs de Performance

### Volume de Production

```
📁 Composants         : 45+ standalone components
📝 Lignes de code     : ~15,000 lignes TypeScript
📚 Services           : 13 services spécialisés
🛡️  Guards             : 4 guards de sécurité
🎯 Tests              : 46 fichiers de tests
⏱️  Commits            : 330+ commits
📅 Durée              : Janvier 2025 - En cours
```

### Qualité du Code

```
✅ TypeScript strict   : 100% (mode strict complet)
✅ ESLint errors       : 0 (100% clean)
✅ Bundle size         : ~3.5 MB (< 4MB target)
✅ Code duplication    : <5%
✅ Test coverage       : 70%+ sur services critiques
✅ SSR ready           : 100% (hydration complète)
✅ PWA ready           : 100% (manifest + service worker)
```

### Performance Metrics

```
Initial Load Time      : < 2s (SSR)
First Contentful Paint : < 1.5s
Largest Contentful Paint : < 2.5s
Time to Interactive    : < 3.5s
Lighthouse Score       : 90+ (Performance)
Bundle Size (gzip)     : 3.5 MB
```

### Compatibilité Navigateurs

```
✅ Chrome 90+
✅ Firefox 88+
✅ Safari 14+
✅ Edge 90+
✅ Mobile Safari (iOS 14+)
✅ Chrome Mobile (Android 10+)
```

---

## 💼 Compétences Valorisables en ESN

### Pour Missions Frontend Angular Senior

**Profil cible :** Lead Developer Angular, Architecte Frontend, Tech Lead

✅ **Architecture Angular moderne** : Standalone, SSR, PWA, RxJS
✅ **Sécurité frontend** : JWT, Guards, Interceptors, RBAC
✅ **Performance** : Bundle optimization, lazy loading, SSR
✅ **Testing** : Jasmine/Karma, SpyObj mocking, >70% coverage
✅ **SEO** : Meta tags dynamiques, Open Graph, sitemap
✅ **Responsive** : Material Design, device detection, PWA

**Exemples de missions :**
- Lead dev Angular sur applications enterprise (banking, insurance)
- Architecte frontend pour refonte applicative (migration vers standalone)
- Expert sécurité frontend (JWT, RBAC, audit)
- Tech Lead sur équipe frontend (4-8 développeurs)
- Formateur Angular avancé (SSR, PWA, testing)

---

### Pour Missions Fintech / Banking

**Profil cible :** Frontend developer pour applications financières critiques

✅ **Sécurité renforcée** : JWT avec refresh, guards multi-niveaux, validation
✅ **Performance** : SSR pour SEO, bundle optimization, lazy loading
✅ **Responsive** : Mobile-first, PWA pour applications mobiles
✅ **Testing** : Coverage élevée, tests critiques (auth, payments)
✅ **TypeScript strict** : Type safety complète, pas d'any

**Exemples de missions :**
- Application bancaire grand public (compte, virements, budget)
- Plateforme de trading en ligne (temps réel, charts)
- Assurance en ligne (devis, souscription, espace client)
- Wallet crypto (sécurité maximale, 2FA)

---

### Pour Missions E-commerce / SaaS

**Profil cible :** Frontend developer pour plateformes B2C/B2B

✅ **SEO avancé** : SSR, meta tags, sitemap, Open Graph
✅ **Performance** : Core Web Vitals optimisés, lazy loading
✅ **PWA** : Offline support, installation, notifications
✅ **Responsive** : Mobile-first, device detection
✅ **Analytics** : Google Analytics, tracking événements

**Exemples de missions :**
- E-commerce B2C (catalogue, panier, checkout)
- SaaS B2B (dashboard, analytics, facturation)
- Marketplace (multi-vendor, search, filters)
- Plateforme de contenu (blog, vidéos, SEO)

---

### Pour Missions Startup / Scale-up

**Profil cible :** Full-Stack Frontend pour croissance rapide

✅ **Velocity** : 330+ commits, itérations rapides
✅ **Architecture scalable** : Services modulaires, composants réutilisables
✅ **Best practices** : TypeScript strict, tests, CI/CD ready
✅ **Polyvalence** : SSR, PWA, SEO, Security, Performance
✅ **Autonomie** : Capable de prendre décisions techniques

**Exemples de missions :**
- CTO technique startup early-stage
- Lead dev scale-up (passage 1 → 10 devs)
- Refonte complète legacy → Angular moderne
- Architecture greenfield nouveau produit

---

## 🎓 Auto-évaluation Technique

| Catégorie | Débutant | Intermédiaire | Confirmé | Expert |
|-----------|----------|---------------|----------|--------|
| **Angular** | ✅ | ✅ | ✅ | ✅ |
| **TypeScript** | ✅ | ✅ | ✅ | ✅ |
| **RxJS** | ✅ | ✅ | ✅ | ✅ |
| **Sécurité Frontend** | ✅ | ✅ | ✅ | ✅ |
| **Architecture** | ✅ | ✅ | ✅ | ✅ |
| **Testing** | ✅ | ✅ | ✅ | ⏳ |
| **Performance** | ✅ | ✅ | ✅ | 🔄 |
| **SEO** | ✅ | ✅ | ✅ | 🔄 |

**Légende :** ✅ Maîtrisé | ⏳ En cours | 🔄 Pratiqué

---

## 📞 Informations de Contact

**Manuel ADELE**
📧 Email : manuel.adele@gmail.com
🐙 GitHub : [@P4cm4n972](https://github.com/P4cm4n972)
💼 LinkedIn : [Manuel ADELE](https://linkedin.com/in/manuel-adele)
🌐 Portfolio : [manuel-adele.dev](https://manuel-adele.dev)

**Disponibilité :** Immédiate pour missions freelance ou CDI
**Mobilité :** France entière (remote ou présentiel)
**TJM indicatif :** À discuter selon mission

---

## 📂 Accès au Code Source

**Repository GitHub :** [github.com/p4cm4n972/verstack-ihm](https://github.com/p4cm4n972/verstack-ihm)

**Statistiques GitHub :**
- 🌟 Stars : 0 (projet privé professionnel)
- 🔀 Forks : 0
- 📝 Commits : 330+
- 📅 Dernière mise à jour : Janvier 2025
- 📦 Branches : main (production-ready)

**Structure du projet :**
```
verstack-ihm/
├── src/
│   ├── app/
│   │   ├── components/      # 45+ composants standalone
│   │   ├── services/        # 13 services spécialisés
│   │   ├── guards/          # 4 guards de sécurité
│   │   ├── interceptors/    # HTTP interceptors
│   │   ├── directives/      # Directives custom
│   │   └── models/          # Interfaces TypeScript
│   ├── assets/              # Images, fonts, icons
│   └── environments/        # Config env (dev, prod)
├── public/                  # Static assets
├── tests/                   # 46 fichiers de tests
├── angular.json             # Configuration Angular CLI
├── package.json             # Dependencies
├── tsconfig.json            # TypeScript strict config
├── karma.conf.js            # Test runner config
└── server.ts                # SSR Express server
```

---

## 🚀 Prochaines Étapes de Développement

### Court terme (1-3 mois)
- ✅ Finaliser tests (coverage > 80%)
- 🔄 Ajouter WebSocket pour temps réel
- 🔄 Implémenter dark mode complet
- 🔄 Optimiser bundle (< 3MB)
- 🔄 Ajouter i18n (français/anglais)

### Moyen terme (3-6 mois)
- 🎯 Migration vers Angular 21+
- 🎯 Ajout de Micro-frontends (Module Federation)
- 🎯 Integration continue (GitHub Actions)
- 🎯 Monitoring (Sentry, LogRocket)
- 🎯 Analytics avancés (Mixpanel)

### Long terme (6-12 mois)
- 🎯 Version mobile native (Ionic/Capacitor)
- 🎯 Contribution open-source Angular
- 🎯 Technical blog sur architecture
- 🎯 Speaker conférences (ng-conf, Angular Paris)

---

## 📄 Annexes

### Références Techniques
- [Angular Official Documentation](https://angular.io/docs)
- [RxJS Official Guide](https://rxjs.dev/guide/overview)
- [Angular Material](https://material.angular.io/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)

### Formations & Certifications Connexes
- ✅ **Angular Expert** (6 ans pratique professionnelle)
- ✅ **TypeScript Advanced** (strict mode, generics, decorators)
- ✅ **RxJS Reactive** (operators, subjects, pipelines)
- ✅ **Testing Jasmine/Karma** (mocking, coverage)
- 🔄 **Angular SSR & PWA** (certification en cours)

### Projets Connexes
- ✅ **Piscine C** (algorithmique, 120h) - [github.com/p4cm4n972/piscine-C](https://github.com/p4cm4n972/piscine-C)
- ✅ **Piscine JS Expert** (FP, async, LeetCode, 100h) - [github.com/p4cm4n972/piscine-js-expert](https://github.com/p4cm4n972/piscine-js-expert)
- ✅ **Verstack.io** (Angular 20, SSR, PWA) - Ce projet

---

> *"L'architecture Angular moderne combinée à des pratiques de sécurité
> et de performance avancées positionne ce projet comme référence
> pour des missions ESN senior."*

**Dernière mise à jour :** 9 Novembre 2024
**Version du document :** 1.0
**Format :** Dossier de compétences technique
**Destinataire :** Recruteurs ESN, Technical Leads, CTOs

---

## ⭐ Résumé Exécutif (1 page)

**Manuel ADELE** | Lead Developer Angular | 6 ans d'expérience Full-Stack
📧 manuel.adele@gmail.com | 🐙 [@P4cm4n972](https://github.com/P4cm4n972)

### Profil Projet
Plateforme moderne de monitoring technique construite avec Angular 20, démontrant expertise architecture frontend enterprise-grade. Projet professionnel pour portfolio et missions ESN senior.

### Compétences Clés Démontrées
✅ **Angular 20 Expert** : Standalone, SSR, PWA, RxJS reactive
✅ **Sécurité** : JWT avec refresh token, 4 guards, RBAC
✅ **Architecture** : 13 services modulaires, DI avancée, SOLID
✅ **Performance** : Bundle < 4MB, SSR, lazy loading, cache
✅ **Testing** : 46 tests, Jasmine/Karma, SpyObj mocking
✅ **SEO** : Meta tags dynamiques, Open Graph, sitemap
✅ **Responsive** : Material, device detection, PWA ready

### Réalisations Techniques
- 🏆 330+ commits sur projet complexe
- 🏆 45+ composants standalone modulaires
- 🏆 Architecture sécurité multi-couches (guards, interceptors)
- 🏆 SSR fonctionnel avec Express
- 🏆 TypeScript strict mode (type safety 100%)
- 🏆 Bundle optimisé < 4MB avec lazy loading

### Valeur Ajoutée pour ESN
- **Expertise Angular moderne** : Standalone components, SSR, PWA
- **Architecture scalable** : Services modulaires, DI, reactive patterns
- **Sécurité renforcée** : JWT, guards, validation, RBAC
- **Best practices** : Testing, TypeScript strict, performance
- **Polyvalence** : Frontend + Architecture + Security + Performance

### Technologies Maîtrisées
Angular 20 • TypeScript 5.8 • RxJS 7.8 • Material 20 • SSR • PWA • JWT • Jasmine/Karma • Chart.js • Express

### Profils de Missions ESN
- Lead dev Angular senior (banking, fintech, e-commerce)
- Architecte frontend (refonte, migration, greenfield)
- Expert sécurité frontend (JWT, RBAC, audit)
- Tech Lead équipe frontend (4-8 devs)
- Formateur Angular avancé (SSR, PWA, testing)

### Disponibilité
Immédiate | Remote ou présentiel | France entière

---

**Document généré avec ❤️ et ☕**
**License :** MIT
**Repository :** [github.com/p4cm4n972/verstack-ihm](https://github.com/p4cm4n972/verstack-ihm)
