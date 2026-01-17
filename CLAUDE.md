# Claude Code - Projet Verstack-IHM

*Ce fichier complète les instructions globales de `/home/itmade/Documents/ITMADE-STUDIO/CLAUDE.md`*

---

## Stack Technique Spécifique

- **Frontend** : Angular 21 (standalone components, Signals, SSR avec hydration)
- **Styling** : SCSS avec thème cyberpunk (cyan #00bcd4, dark backgrounds)
- **State Management** : Angular Signals + RxJS pour les flux asynchrones
- **Backend API** : Node.js/Express sur `/api/*`

## Conventions Projet

- Composants standalone avec injection via `inject()`
- Gestion du cycle de vie avec `takeUntil(destroy$)` pattern
- SSR-safe avec `afterNextRender()` et `PlatformService.isBrowser`
- Tests unitaires Karma/Jasmine

## Thème UI

- Couleur primaire : `#00bcd4` (cyan)
- Fond sombre : `#0a0a15`
- Style "terminal/cyberpunk" pour les headers
- Contenu lisible style blog pour les articles
