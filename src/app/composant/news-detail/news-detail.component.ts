import { Component, inject, OnInit } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ArticlesService } from '../../services/articles.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-news-detail',
  imports: [MatIconModule, CommonModule, RouterModule],
  templateUrl: './news-detail.component.html',
  styleUrl: './news-detail.component.scss'
})
export class NewsDetailComponent implements OnInit {
  constructor(
    private articlesService: ArticlesService,

  ) { }

  article!: any;
  private readonly route = inject(ActivatedRoute);

  ngOnInit(): void {

    if (!this.article) {
      const id = this.route.snapshot.paramMap.get('id');
      this.articlesService.getArticleById(id!).subscribe(article => {
        this.article = article;
      });
    }
  }

}
