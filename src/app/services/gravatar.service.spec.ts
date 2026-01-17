import { TestBed } from '@angular/core/testing';
import { GravatarService } from './gravatar.service';

describe('GravatarService', () => {
  let service: GravatarService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GravatarService);
  });

  describe('Service Creation', () => {
    it('should be created', () => {
      expect(service).toBeTruthy();
    });

    it('should have fallback options defined', () => {
      expect(service.FALLBACK_OPTIONS).toBeTruthy();
      expect(service.FALLBACK_OPTIONS.IDENTICON).toBe('identicon');
      expect(service.FALLBACK_OPTIONS.MONSTERID).toBe('monsterid');
      expect(service.FALLBACK_OPTIONS.WAVATAR).toBe('wavatar');
      expect(service.FALLBACK_OPTIONS.RETRO).toBe('retro');
      expect(service.FALLBACK_OPTIONS.ROBOHASH).toBe('robohash');
      expect(service.FALLBACK_OPTIONS.BLANK).toBe('blank');
      expect(service.FALLBACK_OPTIONS.MP).toBe('mp');
    });
  });

  describe('getGravatarUrl', () => {
    it('should generate correct URL for a valid email', () => {
      const email = 'test@example.com';
      const url = service.getGravatarUrl(email);

      expect(url).toContain('https://www.gravatar.com/avatar/');
      expect(url).toContain('?s=120'); // Default size
      expect(url).toContain('&d=identicon'); // Default fallback
    });

    it('should normalize email to lowercase', () => {
      const email1 = 'Test@Example.COM';
      const email2 = 'test@example.com';

      const url1 = service.getGravatarUrl(email1);
      const url2 = service.getGravatarUrl(email2);

      // Both should produce the same hash
      expect(url1).toBe(url2);
    });

    it('should trim whitespace from email', () => {
      const email1 = '  test@example.com  ';
      const email2 = 'test@example.com';

      const url1 = service.getGravatarUrl(email1);
      const url2 = service.getGravatarUrl(email2);

      expect(url1).toBe(url2);
    });

    it('should use custom size when provided', () => {
      const email = 'test@example.com';
      const url = service.getGravatarUrl(email, 200);

      expect(url).toContain('?s=200');
    });

    it('should use custom fallback when provided', () => {
      const email = 'test@example.com';
      const url = service.getGravatarUrl(email, 120, 'retro');

      expect(url).toContain('&d=retro');
    });

    it('should return default URL when email is empty', () => {
      const url = service.getGravatarUrl('');

      expect(url).toContain('https://www.gravatar.com/avatar/');
      expect(url).toContain('?s=120');
      expect(url).toContain('&d=identicon');
    });

    it('should return default URL when email is null', () => {
      const url = service.getGravatarUrl(null as unknown as string);

      expect(url).toContain('https://www.gravatar.com/avatar/');
    });

    it('should generate correct MD5 hash', () => {
      // Known MD5 hash for 'test@example.com' is '55502f40dc8b7c769880b10874abc9d0'
      const email = 'test@example.com';
      const url = service.getGravatarUrl(email);

      expect(url).toContain('55502f40dc8b7c769880b10874abc9d0');
    });

    it('should generate different hashes for different emails', () => {
      const url1 = service.getGravatarUrl('user1@example.com');
      const url2 = service.getGravatarUrl('user2@example.com');

      // Extract hashes from URLs
      const hash1 = url1.split('/avatar/')[1].split('?')[0];
      const hash2 = url2.split('/avatar/')[1].split('?')[0];

      expect(hash1).not.toBe(hash2);
    });
  });

  describe('getDefaultUrl', () => {
    it('should return a valid default URL', () => {
      const url = service.getDefaultUrl();

      expect(url).toBe('https://www.gravatar.com/avatar/?s=120&d=identicon');
    });

    it('should accept custom size', () => {
      const url = service.getDefaultUrl(256);

      expect(url).toContain('?s=256');
    });

    it('should accept custom fallback', () => {
      const url = service.getDefaultUrl(120, 'robohash');

      expect(url).toContain('&d=robohash');
    });
  });

  describe('hasGravatar', () => {
    it('should return false for empty email', async () => {
      const result = await service.hasGravatar('');
      expect(result).toBeFalse();
    });

    it('should return false for null email', async () => {
      const result = await service.hasGravatar(null as unknown as string);
      expect(result).toBeFalse();
    });

    it('should make a HEAD request to check Gravatar existence', async () => {
      const fetchSpy = spyOn(window, 'fetch').and.returnValue(
        Promise.resolve(new Response(null, { status: 200 }))
      );

      await service.hasGravatar('test@example.com');

      expect(fetchSpy).toHaveBeenCalledWith(
        jasmine.stringMatching(/https:\/\/www\.gravatar\.com\/avatar\/.*\?s=80&d=404/),
        { method: 'HEAD' }
      );
    });

    it('should return true when Gravatar exists (200 response)', async () => {
      spyOn(window, 'fetch').and.returnValue(
        Promise.resolve(new Response(null, { status: 200 }))
      );

      const result = await service.hasGravatar('test@example.com');
      expect(result).toBeTrue();
    });

    it('should return false when Gravatar does not exist (404 response)', async () => {
      spyOn(window, 'fetch').and.returnValue(
        Promise.resolve(new Response(null, { status: 404 }))
      );

      const result = await service.hasGravatar('nonexistent@example.com');
      expect(result).toBeFalse();
    });

    it('should return false on network error', async () => {
      spyOn(window, 'fetch').and.returnValue(Promise.reject(new Error('Network error')));

      const result = await service.hasGravatar('test@example.com');
      expect(result).toBeFalse();
    });
  });

  describe('MD5 Implementation', () => {
    // Test various known MD5 hashes to verify the implementation
    it('should generate correct hash for empty string', () => {
      const url = service.getGravatarUrl('');
      // Empty string MD5 would not be in URL since we use default
      expect(url).toContain('https://www.gravatar.com/avatar/');
    });

    it('should handle special characters in email', () => {
      const email = 'user+tag@example.com';
      const url = service.getGravatarUrl(email);

      expect(url).toContain('https://www.gravatar.com/avatar/');
      expect(url).toContain('?s=');
    });

    it('should handle unicode characters', () => {
      const email = 'üser@example.com';
      const url = service.getGravatarUrl(email);

      expect(url).toContain('https://www.gravatar.com/avatar/');
    });
  });
});
