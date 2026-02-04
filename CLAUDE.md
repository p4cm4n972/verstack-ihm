# 🎯 Projet: Verstack IHM

> **Résumé en une ligne**: Interface Angular 21 avec SSR pour la plateforme Verstack

---

## 📋 Contexte Projet

**Type**: Application Angular avec SSR
**Version**: 2.0.0
**Statut**: En production/maintenance

---

## 🛠️ Stack Technique

### Frontend
- **Framework**: Angular 21.1.0
- **UI**: Angular Material 21.1.0
- **Styling**: SCSS
- **Charts**: Chart.js
- **Dates**: date-fns

### Backend
- **SSR**: @angular/ssr + Express 5
- **Auth**: JWT (jwt-decode)

### Infrastructure
- **Tests**: Karma + Jasmine
- **Build**: Angular CLI

---

## 🔧 Commandes Essentielles

```bash
npm install                    # Installation
npm run start                  # Dev server avec proxy
npm run build                  # Build production
npm run build:ssr              # Build avec SSR
npm run serve:ssr:verstack-ihm # Serveur SSR production
npm run test                   # Tests Karma
npm run lint                   # ESLint

# Scripts spécifiques
npm run generate-version       # Génère version.ts
npm run generate-sitemap       # Génère sitemap.xml
npm run generate-routes        # Génère routes pour prerender
```

---

## 📁 Architecture

```
/
├── src/
│   ├── app/           → Composants et modules Angular
│   ├── scripts/       → Scripts de génération
│   └── assets/        → Assets statiques
├── dist/              → Build de production
├── scripts/           → Scripts Node.js
└── public/            → Fichiers publics (ads.txt, etc.)
```

---

## ⚠️ Points d'Attention

- **SSR**: Utiliser `afterNextRender()` et `isPlatformBrowser()` pour le code browser-only
- **Standalone Components**: Préférer les composants standalone (Angular 14+)
- **Angular Signals**: Utiliser pour la gestion d'état réactive
- **Memory Leaks**: Pattern `takeUntil(destroy$)` pour les subscriptions

---

## 📐 Conventions Angular

- **Fichiers**: `kebab-case.component.ts`
- **Services**: `camelCase.service.ts`
- **Modules**: Préférer standalone components

---

## 🤖 Instructions Claude

- Réponses en français
- Utiliser les Standalone Components
- Respecter les patterns SSR-safe
- Voir AGENTS.md pour les agents spécifiques au projet
- Ne pas modifier proxy.conf.json sans validation

---

## Communication - Standard GAFAM

### Standard d'expertise (Google, Apple, Meta, Amazon, Microsoft)

Adopter systématiquement le niveau d'argumentation et de rigueur technique attendu d'un **Staff Engineer / Principal Engineer** :

#### 1. Argumentation structurée type "Design Doc"
- **Contexte** : Quel problème résout-on ? Pourquoi maintenant ?
- **Options considérées** : Lister au moins 2-3 approches alternatives
- **Trade-offs (compromis)** : Analyser explicitement les avantages/inconvénients
- **Décision et justification** : Expliquer pourquoi cette solution
- **Risques et mitigations** : Identifier les failure modes (modes de défaillance)

#### 2. Profondeur technique obligatoire
- **Complexité algorithmique** : Big-O notation quand pertinent
- **Memory footprint (empreinte mémoire)** : Impact sur heap et GC
- **Latency (latence)** : Percentiles P50, P95, P99
- **Scalabilité** : Comportement sous charge
- **Idempotence** : Opérations rejouables sans side-effects

#### 3. Patterns architecturaux
- **SOLID** : Single Responsibility, Open/Closed, Liskov, Interface Segregation, Dependency Inversion
- **DDD** : Bounded contexts, aggregates, value objects
- **Event-Driven** : Event sourcing, CQRS, saga patterns
- **Distributed systems** : CAP theorem, eventual consistency, circuit breakers

#### 4. Anticipation des edge cases
- **Race conditions** : Accès simultanés, deadlocks
- **Null/undefined** : Defensive programming
- **Network failures** : Timeouts, retries avec exponential backoff
- **Data validation** : Input sanitization aux boundaries

#### 5. Maintenabilité long terme
- **Technical debt** : Identifier et documenter
- **Backward compatibility** : Impact sur versions existantes
- **Migration path** : Chemin de l'état actuel à l'état cible
- **Observability** : Logging, metrics, tracing

### Définitions inline obligatoires
Pour tous les termes techniques anglais, ajouter une définition entre parenthèses :
- Exemple : "bypass (contourner)", "chunks (fragments)", "rollback (retour arrière)"

### Format de réponse
- **Réponses élaborées** : Explications approfondies
- **Exemples concrets** : Code ou scénarios réels
- **Nuances** : Éviter les affirmations absolues
