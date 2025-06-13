import { ChangeDetectionStrategy, Component, Inject, PLATFORM_ID, inject, OnInit } from '@angular/core';
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
    TapeTextConsoleComponent
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

  constructor(
    private articlesService: ArticlesService,
    private sanitizer: DomSanitizer,
    private seo: SeoService,
    @Inject(PLATFORM_ID) platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  ngOnInit(): void {
    this.seo.updateMetaData({
      title: 'Actualités & Articles – Verstack.io',
      description: 'Explorez les dernières actualités, articles, notes et stories sur les outils et stacks pour développeurs modernes. Restez informé avec Verstack.io.',
      keywords: 'verstack, actualités, articles, outils, développeurs, Angular, React, stacks, frameworks, programmation',
      image: this.isBrowser ? `${window.location.origin}/assets/slider/slider-1.jpg` : undefined,
      url: 'https://verstack.io/news'
    });
    this.loadArticles();
  }

  loadArticles(): void {
    this.articlesService.getArticles().subscribe({
      next: (data) => {
        this.articles = data;
        this.filteredArticles = data;
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
}
@Component({
  selector: 'dialog-data-articles',
  templateUrl: './dialog-data-articles.html',
  imports: [MatDialogModule, MatButtonModule],
})
export class DialogDataArticle {
  data = inject(MAT_DIALOG_DATA);
}
