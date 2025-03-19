import { Component, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatToolbarModule } from '@angular/material/toolbar';
import {MatChipsModule} from '@angular/material/chips';
import {MatGridListModule} from '@angular/material/grid-list';
import { ArticlesService } from '../../../services/articles.service';
import { MatOption, MatSelect } from '@angular/material/select';

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
    MatSelect,
    MatOption
  ],
  templateUrl: './news.component.html',
  styleUrl: './news.component.scss',
})
export class NewsComponent implements OnInit {
  frameworks: string[] = ['Tous', 'Angular', 'Vue.js', 'React', 'SwiftUI', 'Svelte', 'Next.js'];
  articles: any[] = [];
  filteredArticles: any[] = [];

  constructor(private articlesService: ArticlesService) {}

  ngOnInit(): void {
    this.loadArticles();
  }

  loadArticles(): void {
    this.articlesService.getArticles().subscribe({
      next: (data) => {
        this.articles = data;
        this.filteredArticles = data;
      },
      error: (err) => console.error('Erreur lors du chargement des articles : ', err)
    });
  }
  
  // Recherche simple
  searchArticles(keyword: string): void {
    this.filteredArticles = this.articles.filter(article =>
      article.title.toLowerCase().includes(keyword.toLowerCase()) ||
      article.excerpt.toLowerCase().includes(keyword.toLowerCase())
    );
  }

  // Filtre par framework
  filterByFramework(framework: string): void {
    this.filteredArticles = framework === 'Tous'
      ? this.articles
      : this.articles.filter(article => article.framework === framework);
  }

  openArticle(elm: any) {}

  filterByTag(elm: any) {}
}
