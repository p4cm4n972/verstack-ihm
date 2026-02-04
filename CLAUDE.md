# 🎯 Projet: Verstack IHM

> ⚠️ **IMPORTANT**: Ce fichier **hérite** des instructions globales définies dans `/home/itmade/Documents/ITMADE-STUDIO/CLAUDE.md`.
> Les standards de communication GAFAM (argumentation Design Doc, profondeur technique, patterns architecturaux) s'appliquent à ce projet.

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
