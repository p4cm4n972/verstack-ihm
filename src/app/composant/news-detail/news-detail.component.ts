import { Component, inject, OnInit } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ArticlesService } from '../../services/articles.service';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { SeoService } from '../../services/seo.service';
import { StructuredDataService } from '../../core/services/structured-data.service';

@Component({
  selector: 'app-news-detail',
  imports: [MatIconModule, CommonModule, RouterModule, MatButtonModule],
  templateUrl: './news-detail.component.html',
  styleUrl: './news-detail.component.scss'
})
export class NewsDetailComponent implements OnInit {
  constructor(
    private articlesService: ArticlesService,
    private seoService: SeoService,
    private structuredDataService: StructuredDataService
  ) { }

  article!: any;
  private readonly route = inject(ActivatedRoute);

  ngOnInit(): void {
    if (!this.article) {
      const id = this.route.snapshot.paramMap.get('id');
      this.articlesService.getArticleById(id!).subscribe(article => {
        this.article = article;
        this.updateSeoForArticle(article);
      });
    }
  }

  private updateSeoForArticle(article: any): void {
    const articleUrl = `https://verstack.io/news/${article._id}`;

    // Update SEO meta tags
    this.seoService.updateMetaData({
      title: `${article.title} - Verstack.io`,
      description: article.excerpt || article.description || 'Article sur Verstack.io',
      keywords: `verstack, ${article.category}, article, actualité, ${article.title}`,
      image: article.img || 'https://verstack.io/assets/icons/logo-banniere-RS.png',
      url: articleUrl,
      type: 'article',
      author: 'P4cm4n972',
      publishedTime: article.date,
      canonical: articleUrl
    });

    // Add structured data
    const structuredData = this.structuredDataService.createArticleSchema({
      title: article.title,
      description: article.excerpt || article.description || '',
      image: article.img || 'https://verstack.io/assets/icons/logo-banniere-RS.png',
      datePublished: article.date,
      dateModified: article.updatedAt || article.date,
      author: 'P4cm4n972',
      url: articleUrl
    });

    this.structuredDataService.addStructuredData(structuredData);
  }
}
