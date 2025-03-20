import { Component, inject, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatChipsModule } from '@angular/material/chips';
import { MatGridListModule } from '@angular/material/grid-list';
import { ArticlesService } from '../../../services/articles.service';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogModule,
} from '@angular/material/dialog';
import { DomSanitizer } from '@angular/platform-browser';

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
    MatButtonModule,
  ],
  templateUrl: './news.component.html',
  styleUrl: './news.component.scss',
})
export class NewsComponent implements OnInit {
  readonly dialog = inject(MatDialog);
  defaultPicture: string = 'assets/images/bkg-home-old.jpg';

  frameworks: string[] = ['tous', 'article', 'release', 'story'];
  selectedDomainIndex: number = 0;
  articles: any[] = [];
  filteredArticles: any[] = [];

  constructor(
    private articlesService: ArticlesService,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit(): void {
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
  filterByFramework(index: number): void {
    this.filteredArticles =
      index === 0
        ? this.articles
        : this.articles.filter(
            (article) => article.category === this.frameworks[index]
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
