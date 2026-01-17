import { Component, OnInit, OnDestroy, PLATFORM_ID, Inject } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { NewsTickerService, NewsItem } from '../../services/news-ticker.service';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-news-ticker',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatTooltipModule],
  templateUrl: './news-ticker.component.html',
  styleUrl: './news-ticker.component.scss'
})
export class NewsTickerComponent implements OnInit, OnDestroy {
  news: NewsItem[] = [];
  isLoading = true;
  isPaused = false;
  isVisible = true;
  private destroy$ = new Subject<void>();
  private isBrowser: boolean;

  constructor(
    private newsService: NewsTickerService,
    @Inject(PLATFORM_ID) platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  ngOnInit(): void {
    if (this.isBrowser) {
      this.loadNews();
      this.checkVisibilityPreference();
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private loadNews(): void {
    this.newsService.getNews()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (news) => {
          this.news = news;
          this.isLoading = false;
        },
        error: () => {
          this.isLoading = false;
        }
      });
  }

  private checkVisibilityPreference(): void {
    const hidden = localStorage.getItem('newsTickerHidden');
    if (hidden === 'true') {
      this.isVisible = false;
    }
  }

  togglePause(): void {
    this.isPaused = !this.isPaused;
  }

  hideTicker(): void {
    this.isVisible = false;
    localStorage.setItem('newsTickerHidden', 'true');
  }

  showTicker(): void {
    this.isVisible = true;
    localStorage.removeItem('newsTickerHidden');
  }

  openNews(item: NewsItem): void {
    if (this.isBrowser) {
      window.open(item.url, '_blank', 'noopener,noreferrer');
    }
  }

  getSourceIcon(source: string): string {
    switch (source) {
      case 'Dev.to':
        return 'code';
      case 'Hacker News':
        return 'forum';
      default:
        return 'article';
    }
  }

  getSourceColor(source: string): string {
    switch (source) {
      case 'Dev.to':
        return '#3b49df';
      case 'Hacker News':
        return '#ff6600';
      default:
        return '#00bcd4';
    }
  }
}
