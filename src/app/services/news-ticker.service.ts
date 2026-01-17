import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, forkJoin, of, timer } from 'rxjs';
import { map, catchError, switchMap, shareReplay } from 'rxjs/operators';

export interface NewsItem {
  id: string;
  title: string;
  description: string;
  url: string;
  source: string;
  publishedAt: Date;
}

interface DevToArticle {
  id: number;
  title: string;
  description: string;
  url: string;
  published_at: string;
}

interface HackerNewsItem {
  id: number;
  title: string;
  url: string;
  time: number;
}

@Injectable({
  providedIn: 'root'
})
export class NewsTickerService {
  private readonly DEV_TO_API = 'https://dev.to/api/articles';
  private readonly HN_TOP_STORIES = 'https://hacker-news.firebaseio.com/v0/topstories.json';
  private readonly HN_ITEM = 'https://hacker-news.firebaseio.com/v0/item';

  // Cache news for 10 minutes
  private newsCache$: Observable<NewsItem[]> | null = null;
  private readonly CACHE_DURATION = 10 * 60 * 1000; // 10 minutes

  constructor(private http: HttpClient) {}

  /**
   * Get combined news from multiple sources
   * Results are cached for 10 minutes
   */
  getNews(): Observable<NewsItem[]> {
    if (!this.newsCache$) {
      this.newsCache$ = timer(0, this.CACHE_DURATION).pipe(
        switchMap(() => this.fetchAllNews()),
        shareReplay(1)
      );
    }
    return this.newsCache$;
  }

  /**
   * Fetch news from all sources and combine them
   */
  private fetchAllNews(): Observable<NewsItem[]> {
    return forkJoin([
      this.fetchDevToNews(),
      this.fetchHackerNews()
    ]).pipe(
      map(([devToNews, hnNews]) => {
        // Combine and shuffle news from different sources
        const combined = [...devToNews, ...hnNews];
        return this.shuffleArray(combined).slice(0, 15); // Limit to 15 items
      }),
      catchError(() => of([]))
    );
  }

  /**
   * Fetch articles from Dev.to API
   */
  private fetchDevToNews(): Observable<NewsItem[]> {
    return this.http.get<DevToArticle[]>(`${this.DEV_TO_API}?per_page=10&top=1`).pipe(
      map(articles => articles.map(article => ({
        id: `devto-${article.id}`,
        title: article.title,
        description: this.truncateText(article.description || '', 100),
        url: article.url,
        source: 'Dev.to',
        publishedAt: new Date(article.published_at)
      }))),
      catchError(() => of([]))
    );
  }

  /**
   * Fetch top stories from Hacker News API
   */
  private fetchHackerNews(): Observable<NewsItem[]> {
    return this.http.get<number[]>(this.HN_TOP_STORIES).pipe(
      switchMap(ids => {
        // Get first 8 story IDs
        const topIds = ids.slice(0, 8);
        const requests = topIds.map(id =>
          this.http.get<HackerNewsItem>(`${this.HN_ITEM}/${id}.json`).pipe(
            catchError(() => of(null))
          )
        );
        return forkJoin(requests);
      }),
      map(items => items
        .filter((item): item is HackerNewsItem => item !== null && !!item.title)
        .map(item => ({
          id: `hn-${item.id}`,
          title: item.title,
          description: 'Hacker News - Discussion tech',
          url: item.url || `https://news.ycombinator.com/item?id=${item.id}`,
          source: 'Hacker News',
          publishedAt: new Date(item.time * 1000)
        }))
      ),
      catchError(() => of([]))
    );
  }

  /**
   * Truncate text to specified length
   */
  private truncateText(text: string, maxLength: number): string {
    if (!text) return '';
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength).trim() + '...';
  }

  /**
   * Shuffle array using Fisher-Yates algorithm
   */
  private shuffleArray<T>(array: T[]): T[] {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }

  /**
   * Clear the cache to force refresh
   */
  clearCache(): void {
    this.newsCache$ = null;
  }
}
