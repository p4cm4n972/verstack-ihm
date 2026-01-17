import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NewsTickerService } from './news-ticker.service';

describe('NewsTickerService', () => {
  let service: NewsTickerService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [NewsTickerService]
    });
    service = TestBed.inject(NewsTickerService);
  });

  describe('Service Creation', () => {
    it('should be created', () => {
      expect(service).toBeTruthy();
    });
  });

  describe('getNews', () => {
    it('should return an observable', () => {
      const result = service.getNews();
      expect(result).toBeTruthy();
      expect(typeof result.subscribe).toBe('function');
    });
  });

  describe('clearCache', () => {
    it('should clear the cache without error', () => {
      expect(() => service.clearCache()).not.toThrow();
    });
  });
});
