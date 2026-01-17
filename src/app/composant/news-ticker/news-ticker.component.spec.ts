import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { of } from 'rxjs';

import { NewsTickerComponent } from './news-ticker.component';
import { NewsTickerService, NewsItem } from '../../services/news-ticker.service';

describe('NewsTickerComponent', () => {
  let component: NewsTickerComponent;
  let fixture: ComponentFixture<NewsTickerComponent>;
  let mockNewsService: jasmine.SpyObj<NewsTickerService>;

  const mockNews: NewsItem[] = [
    {
      id: 'devto-1',
      title: 'Test Article 1',
      description: 'Description 1',
      url: 'https://dev.to/article1',
      source: 'Dev.to',
      publishedAt: new Date()
    },
    {
      id: 'hn-100',
      title: 'HN Story',
      description: 'Hacker News - Discussion tech',
      url: 'https://news.ycombinator.com/item?id=100',
      source: 'Hacker News',
      publishedAt: new Date()
    }
  ];

  beforeEach(async () => {
    mockNewsService = jasmine.createSpyObj('NewsTickerService', ['getNews']);
    mockNewsService.getNews.and.returnValue(of(mockNews));

    await TestBed.configureTestingModule({
      imports: [
        NewsTickerComponent,
        HttpClientTestingModule,
        NoopAnimationsModule
      ],
      providers: [
        { provide: NewsTickerService, useValue: mockNewsService }
      ]
    }).compileComponents();

    // Mock localStorage
    spyOn(localStorage, 'getItem').and.returnValue(null);
    spyOn(localStorage, 'setItem');
    spyOn(localStorage, 'removeItem');

    fixture = TestBed.createComponent(NewsTickerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  describe('Component Creation', () => {
    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should load news on init', () => {
      expect(mockNewsService.getNews).toHaveBeenCalled();
      expect(component.news.length).toBe(2);
    });

    it('should set isLoading to false after loading', () => {
      expect(component.isLoading).toBeFalse();
    });
  });

  describe('Visibility', () => {
    it('should be visible by default', () => {
      expect(component.isVisible).toBeTrue();
    });

    it('should hide ticker when hideTicker is called', () => {
      component.hideTicker();
      expect(component.isVisible).toBeFalse();
      expect(localStorage.setItem).toHaveBeenCalledWith('newsTickerHidden', 'true');
    });

    it('should show ticker when showTicker is called', () => {
      component.isVisible = false;
      component.showTicker();
      expect(component.isVisible).toBeTrue();
      expect(localStorage.removeItem).toHaveBeenCalledWith('newsTickerHidden');
    });

    it('should check localStorage for hidden preference on init', () => {
      expect(localStorage.getItem).toHaveBeenCalledWith('newsTickerHidden');
    });
  });

  describe('Pause Functionality', () => {
    it('should not be paused by default', () => {
      expect(component.isPaused).toBeFalse();
    });

    it('should toggle pause state', () => {
      component.togglePause();
      expect(component.isPaused).toBeTrue();

      component.togglePause();
      expect(component.isPaused).toBeFalse();
    });
  });

  describe('News Navigation', () => {
    it('should open news in new tab', () => {
      spyOn(window, 'open');

      component.openNews(mockNews[0]);

      expect(window.open).toHaveBeenCalledWith(
        mockNews[0].url,
        '_blank',
        'noopener,noreferrer'
      );
    });
  });

  describe('Source Icons and Colors', () => {
    it('should return correct icon for Dev.to', () => {
      expect(component.getSourceIcon('Dev.to')).toBe('code');
    });

    it('should return correct icon for Hacker News', () => {
      expect(component.getSourceIcon('Hacker News')).toBe('forum');
    });

    it('should return default icon for unknown source', () => {
      expect(component.getSourceIcon('Unknown')).toBe('article');
    });

    it('should return correct color for Dev.to', () => {
      expect(component.getSourceColor('Dev.to')).toBe('#3b49df');
    });

    it('should return correct color for Hacker News', () => {
      expect(component.getSourceColor('Hacker News')).toBe('#ff6600');
    });

    it('should return default color for unknown source', () => {
      expect(component.getSourceColor('Unknown')).toBe('#00bcd4');
    });
  });

  describe('Template Rendering', () => {
    it('should display news items when loaded', () => {
      const compiled = fixture.nativeElement;
      const tickerItems = compiled.querySelectorAll('.ticker-item');
      // Items are duplicated for seamless scrolling
      expect(tickerItems.length).toBe(4); // 2 original + 2 duplicates
    });

    it('should display ticker label', () => {
      const compiled = fixture.nativeElement;
      const label = compiled.querySelector('.ticker-label');
      expect(label).toBeTruthy();
      expect(label.textContent).toContain('NEWS');
    });

    it('should display control buttons', () => {
      const compiled = fixture.nativeElement;
      const controls = compiled.querySelectorAll('.control-btn');
      expect(controls.length).toBe(2); // Pause and Close buttons
    });
  });

  describe('Empty State', () => {
    it('should show empty message when no news', async () => {
      mockNewsService.getNews.and.returnValue(of([]));

      const emptyFixture = TestBed.createComponent(NewsTickerComponent);
      const emptyComponent = emptyFixture.componentInstance;
      emptyFixture.detectChanges();

      await emptyFixture.whenStable();

      expect(emptyComponent.news.length).toBe(0);
    });
  });

  describe('Hidden State', () => {
    it('should show restore button when hidden', () => {
      component.isVisible = false;
      fixture.detectChanges();

      const compiled = fixture.nativeElement;
      const showButton = compiled.querySelector('.show-ticker-btn');
      expect(showButton).toBeTruthy();
    });

    it('should not show ticker container when hidden', () => {
      component.isVisible = false;
      fixture.detectChanges();

      const compiled = fixture.nativeElement;
      const container = compiled.querySelector('.news-ticker-container');
      expect(container).toBeFalsy();
    });
  });
});
