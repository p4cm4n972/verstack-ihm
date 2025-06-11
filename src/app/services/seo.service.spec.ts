import { TestBed } from '@angular/core/testing';
import { BrowserTestingModule } from '@angular/platform-browser/testing';
import { Title, Meta } from '@angular/platform-browser';

import { SeoService } from './seo.service';

describe('SeoService', () => {
  let service: SeoService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [BrowserTestingModule],
      providers: [SeoService]
    });
    service = TestBed.inject(SeoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should update title and description', () => {
    const title = TestBed.inject(Title);
    const meta = TestBed.inject(Meta);

    service.updateMetaData({
      title: 'Test Title',
      description: 'desc',
      keywords: 'k',
      image: '/img.png',
      url: 'http://test'
    });

    expect(title.getTitle()).toBe('Test Title');
    const tag = meta.getTag('name="description"');
    expect(tag?.getAttribute('content')).toBe('desc');
    const og = meta.getTag('property="og:title"');
    expect(og?.getAttribute('content')).toBe('Test Title');
  });
});
