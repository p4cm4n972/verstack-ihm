
# Verstack.io 🚀

**Verstack.io** est une plateforme web dédiée aux développeurs pour consulter, suivre et comparer les versions à jour des langages, frameworks, outils et bases de données. Le projet propose une expérience interactive de type "console", avec des composants dynamiques intégrés à Angular et une API NestJS complète.

---

## 🌐 Technologies

### Frontend
- Angular 17
- Angular Material
- RxJS
- CSS pur (thème rétro-console)
- Shopify Buy Button intégré pour la boutique Red Squiggly

### Backend
- NestJS + MongoDB
- JWT Authentication (access & refresh tokens)
- Gestion de profil utilisateur (pseudo, favoris, projets)
- API REST pour les langages, versions, profils, etc.

### Autres
- Hébergement : VPS OVH (serveur unique Angular + API)
- Emails : Brevo (ex Sendinblue)
- Stockage produit & ecommerce : Shopify
- Authentification : système custom JWT avec validation email
- UI dynamique : globe interactif, tabs verticales, spirale de filtres, console sticky

---

## 📦 Fonctionnalités principales

### 🧠 Côté utilisateur
- ✅ Inscription / connexion avec validation email
- 🔐 Authentification JWT persistante (stockage tokens & profil)
- 📌 Ajout de favoris personnalisés (langages, frameworks, outils…)
- 🌌 Dashboard style “pont de commande” avec amis, messages, projets
- 🛰 Visualisation interactive des technologies (globe 3D, spirale de thème)
- 🛍 Intégration boutique Red Squiggly avec Shopify Buy Button
- 🌐 Prévisualisation Open Graph optimisée pour le SEO et les réseaux sociaux

### 🛠 Côté développeur
- 📊 API REST avec versionnage de langages (Angular, React, Node.js, etc.)
- 🔁 Synchronisation automatique des versions depuis sources officielles (prévue)
- ⚙️ Structure modulaire (observable state, services séparés, clean architecture)
- 📍 Détection d’expiration de support (LTS, durée en mois)
- 📁 Stockage local + Observable global (`BehaviorSubject`) pour favoris

---

## 🔧 Installation

### 🖥 Backend (NestJS)

```bash
cd backend
npm install
npm run start:dev
```

> ⚠️ Configure MongoDB + variables `.env`

### 💻 Frontend (Angular)

```bash
cd frontend
npm install
ng serve
```

> Les images doivent être placées dans `src/assets/...` pour être servies correctement

---

## 🧪 Tests & Déploiement

- Tests unitaires en cours de mise en place
- Déploiement prévu sur un VPS OVH (Angular build + API NestJS sur le même serveur)
- Les tokens et profils sont gérés dans `localStorage` avec comportement réactif (`BehaviorSubject`)

---

## 🔐 Authentification

- JWT access token / refresh token
- Vérification email
- Réinitialisation mot de passe
- Stockage et détection du statut auth via `isAuthenticated$` (Observable)

---

## 📦 Dossier `public/assets` (backend)

> Pour les images SEO (Open Graph), elles doivent être accessibles via :

```
https://verstack.io/assets/slider/slider-1.jpg
```

Dans NestJS, ce dossier est exposé avec :

```ts
app.use('/assets', express.static(join(__dirname, '..', 'public/assets')));
```

---

## 🧭 Routing intelligent

- Page Home : détecte connexion et présence de favoris
- Page Version : affiche les langages filtrés par domaines
- Tabs latérales pour choisir une catégorie
- Loader global animé rétro (style CLI) jusqu’au chargement complet

---

## 📦 Exemple de composants Angular utilisés

- `<app-version [favorisFromHome]>`
- `<app-shopify-buy-button>`
- `<app-globe>`
- `<mat-paginator>`
- `@if`, `@let` (Angular 17+ syntaxe déclarative)

---

## 🧑‍🚀 À venir

- Synchronisation des versions via GitHub API / CDNs officiels
- Tableau d'administration (ajout manuel / bulk des stacks)
- Authentification OAuth (GitHub / Google)
- Mode hors-ligne PWA

---

## 🧵 Auteur

Projet développé par [Manuel ADELE](https://verstack.io)  
> “Code it – Wear it.” – Créateur de la marque [Red Squiggly 👕](https://verstack.io/shop)

---
