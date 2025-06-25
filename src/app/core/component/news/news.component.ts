import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Inject, PLATFORM_ID, inject, OnInit } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatChipsModule } from '@angular/material/chips';
import { MatGridListModule } from '@angular/material/grid-list';
import { ArticlesService } from '../../../services/articles.service';
import { MatIconModule } from '@angular/material/icon';
import { MatBadgeModule } from '@angular/material/badge';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogModule,
} from '@angular/material/dialog';
import { DomSanitizer } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { TapeTextConsoleComponent } from '../../../composant/tape-text-console/tape-text-console.component';
import { Router } from '@angular/router';
import { SeoService } from '../../../services/seo.service';
// import { AuthService } from '../../../services/authentication.service';
import { AuthenticationService } from '../../../services/authentication.service';
import { MatTooltipModule } from '@angular/material/tooltip';

interface Article {
  title: string;
  framework: string;
  image: string;
  excerpt: string;
}

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
    CommonModule,
    MatBadgeModule,
    MatIconModule,
    TapeTextConsoleComponent,
    MatTooltipModule
  ],
  templateUrl: './news.component.html',
  styleUrl: './news.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NewsComponent implements OnInit {
  readonly dialog = inject(MatDialog);
    private readonly router = inject(Router);
  
  defaultPicture: string = 'assets/images/bkg-home-old.jpg';

  actualiteType: string[] = ['tous', 'editorial', 'article', 'note', 'story'];
  selectedDomainIndex: number = 0;
  articles: any[] = [];
  filteredArticles: any[] = [];

  private isBrowser: boolean;
  currentUser: any;

  constructor(
    private articlesService: ArticlesService,
    private sanitizer: DomSanitizer,
    private seo: SeoService,
    private authService: AuthenticationService, // <-- Ajoute ici
    private cdr: ChangeDetectorRef,
    @Inject(PLATFORM_ID) platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  ngOnInit(): void {
    if (this.isBrowser) {
      this.currentUser = this.authService.getCurrentUser();
    }
    let imageUrl: string | undefined = undefined;
    if (this.isBrowser) {
      imageUrl = `${window.location.origin}/assets/slider/slider-1.jpg`;
    }
    this.seo.updateMetaData({
      title: 'Actualités & Articles – Verstack.io',
      description: 'Explorez les dernières actualités, articles, notes et stories sur les outils et stacks pour développeurs modernes. Restez informé avec Verstack.io.',
      keywords: `verstack, langages, outils, développeurs, Angular, React , version Angular, version React, version Vue.js, version Node.js, version Python, version Java,
      version C#, version PHP, version Ruby, version Go, version Rust, version JavaScript, version TypeScript, version Bash, version Shell, version Perl,
      version Kotlin, version Swift, version Scala, version Dart, version Objective-C, version C, version C++, version R, version MATLAB, version Julia,
      version Haskell, version Elixir, version Erlang, version F#, version Groovy, version PowerShell, version Assembly, version SQL, version HTML,
      version CSS, version SASS, version LESS, version Docker, version Kubernetes, version Terraform, version Ansible, version Jenkins, version Git,
      version GitHub Actions, version Travis CI, version CircleCI, version Webpack, version Babel, version ESLint, version Prettier, version Nginx,
      version Apache, version PostgreSQL, version MySQL, version MongoDB, version Redis, version GraphQL, version Firebase, version Supabase,
      version Netlify, version Vercel, version AWS, version Azure, version GCP`,
      image: imageUrl,
      url: 'https://verstack.io/news'
    });
    this.loadArticles();
  }

  loadArticles(): void {
    this.articlesService.getArticles().subscribe({
      next: (data) => {
        this.articles = data;
        this.filteredArticles = data;
        this.cdr.markForCheck();
      },
      error: (err) =>
        console.error('Erreur lors du chargement des articles : ', err),
    });
  }

  // Recherche simple
  searchArticles(keyword: string): void {
    this.filteredArticles = this.articles.filter(
      (article) =>
        article.title.toLowerCase().includes(keyword.toLowerCase()) ||
        article.excerpt.toLowerCase().includes(keyword.toLowerCase())
    );
  }

  // Filtre par framework
  filterByType(index: number): void {
    this.filteredArticles =
      index === 0
        ? this.articles
        : this.articles.filter(
            (article) => article.category === this.actualiteType[index]
          );
  }

  openArticleContentDialog(content: any) {
    let rendu = this.sanitizer.bypassSecurityTrustHtml(content);
    const dialogRef = this.dialog.open(DialogDataArticle, {
      data: rendu,
    });

    dialogRef.afterClosed().subscribe((result) => {
      // console.log(`Dialog result: ${result}`);
    });
  }

  openArticlePage(article: any) {
    this.router.navigate(['/news', article._id]);
  }

  trackById(index: number, article: any): string {
    return article._id;
  }


  filterByTag(elm: any) {}

  recommend(article: any) {
    if (!this.currentUser) {
      // Optionnel : affiche un message ou ouvre le dialogue de connexion
      return;
    }
    if (this.hasRecommended(article._id)) return;
    this.articlesService.recommendArticle(article._id, this.currentUser.id).subscribe({
      next: (res) => {
        article.recommendations = res.recommendations;
        this.markRecommended(article._id);
        this.cdr.markForCheck();
      }
    });
  }

  unrecommend(article: any) {
    if (!this.currentUser) return;
    this.articlesService.unrecommendArticle(article._id, this.currentUser.id).subscribe({
      next: (res) => {
        article.recommendations = res.recommendations;
        // Retire l'utilisateur du tableau likedBy côté front
        if (Array.isArray(article.likedBy)) {
          article.likedBy = article.likedBy.filter((id: string) => id !== this.currentUser.id);
        }
        this.unmarkRecommended(article._id);
        this.cdr.markForCheck();
      }
    });
  }

  hasRecommended(article: any): boolean {
    if (!this.currentUser) return false;

    // 1. Vérifie dans le localStorage (pour la réactivité immédiate)
    if (this.isBrowser) {
      const recommended = JSON.parse(localStorage.getItem('recommendedArticles') || '[]');
      if (recommended.includes(article._id)) {
        return true;
      }
    }

    // 2. Vérifie dans les données de l'article (source de vérité backend)
    // Si likedBy n'existe pas, retourne false
    return Array.isArray(article.likedBy) && article.likedBy.includes(this.currentUser.id);
  }

  markRecommended(articleId: string): void {
    if (!this.isBrowser) return;
    const recommended = JSON.parse(localStorage.getItem('recommendedArticles') || '[]');
    if (!recommended.includes(articleId)) {
      recommended.push(articleId);
      localStorage.setItem('recommendedArticles', JSON.stringify(recommended));
    }
  }

  unmarkRecommended(articleId: string): void {
    if (!this.isBrowser) return;
    let recommended = JSON.parse(localStorage.getItem('recommendedArticles') || '[]');
    recommended = recommended.filter((id: string) => id !== articleId);
    localStorage.setItem('recommendedArticles', JSON.stringify(recommended));
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
