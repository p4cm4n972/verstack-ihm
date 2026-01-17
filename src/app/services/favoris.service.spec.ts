import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { PLATFORM_ID } from '@angular/core';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { of } from 'rxjs';

import { FavorisService } from './favoris.service';
import { ProfileService } from './profile.service';
import { AuthenticationService } from './authentication.service';
import { FavoriteTechnology, Technology } from '../models/technology.interface';

describe('FavorisService', () => {
  let service: FavorisService;
  let httpMock: HttpTestingController;
  let mockProfileService: jasmine.SpyObj<ProfileService>;
  let mockAuthService: jasmine.SpyObj<AuthenticationService>;

  const mockFavoris: FavoriteTechnology[] = [
    { name: 'Angular', logoUrl: 'https://example.com/angular.svg' },
    { name: 'React', logoUrl: 'https://example.com/react.svg' }
  ];

  const mockTechnology: Technology = {
    _id: '123',
    name: 'Vue.js',
    logoUrl: 'https://example.com/vue.svg',
    domain: ['web', 'framework']
  };

  beforeEach(() => {
    mockProfileService = jasmine.createSpyObj('ProfileService', ['getUserProfile', 'updateUserProfile']);
    mockAuthService = jasmine.createSpyObj('AuthenticationService', ['getUserId']);

    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        MatSnackBarModule,
        NoopAnimationsModule
      ],
      providers: [
        FavorisService,
        { provide: PLATFORM_ID, useValue: 'browser' },
        { provide: ProfileService, useValue: mockProfileService },
        { provide: AuthenticationService, useValue: mockAuthService }
      ]
    });

    // Clear localStorage before each test
    localStorage.clear();

    service = TestBed.inject(FavorisService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
    localStorage.clear();
  });

  describe('Service Creation', () => {
    it('should be created', () => {
      expect(service).toBeTruthy();
    });

    it('should have empty favoris initially', () => {
      expect(service.favoris()).toEqual([]);
      expect(service.favorisCount()).toBe(0);
      expect(service.hasFavoris()).toBeFalse();
    });

    it('should load favoris from localStorage on creation', () => {
      // Reset module to get a fresh service instance
      TestBed.resetTestingModule();

      // Set up localStorage before creating a new service
      localStorage.setItem('favoris', JSON.stringify(mockFavoris));

      // Configure fresh TestBed
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule, MatSnackBarModule, NoopAnimationsModule],
        providers: [
          FavorisService,
          { provide: PLATFORM_ID, useValue: 'browser' },
          { provide: ProfileService, useValue: mockProfileService },
          { provide: AuthenticationService, useValue: mockAuthService }
        ]
      });

      // Create a new instance
      const newService = TestBed.inject(FavorisService);

      expect(newService.favoris().length).toBe(2);
    });
  });

  describe('setFavoris', () => {
    it('should set favoris correctly', () => {
      service.setFavoris(mockFavoris);

      expect(service.favoris()).toEqual(mockFavoris);
      expect(service.favorisCount()).toBe(2);
      expect(service.hasFavoris()).toBeTrue();
    });

    it('should save favoris to localStorage', () => {
      service.setFavoris(mockFavoris);

      const stored = JSON.parse(localStorage.getItem('favoris') || '[]');
      expect(stored).toEqual(mockFavoris);
    });

    it('should handle empty array', () => {
      service.setFavoris([]);

      expect(service.favoris()).toEqual([]);
      expect(service.favorisCount()).toBe(0);
    });

    it('should handle null/undefined gracefully', () => {
      service.setFavoris(null as any);

      expect(service.favoris()).toEqual([]);
    });
  });

  describe('isFavoris', () => {
    beforeEach(() => {
      service.setFavoris(mockFavoris);
    });

    it('should return true for existing favoris', () => {
      expect(service.isFavoris('Angular')).toBeTrue();
      expect(service.isFavoris('React')).toBeTrue();
    });

    it('should return false for non-existing favoris', () => {
      expect(service.isFavoris('Vue.js')).toBeFalse();
      expect(service.isFavoris('Svelte')).toBeFalse();
    });

    it('should be case-sensitive', () => {
      expect(service.isFavoris('angular')).toBeFalse();
      expect(service.isFavoris('ANGULAR')).toBeFalse();
    });
  });

  describe('getFavoris', () => {
    beforeEach(() => {
      service.setFavoris(mockFavoris);
    });

    it('should return the favoris object if exists', () => {
      const result = service.getFavoris('Angular');

      expect(result).toBeDefined();
      expect(result?.name).toBe('Angular');
      expect(result?.logoUrl).toBe('https://example.com/angular.svg');
    });

    it('should return undefined if not exists', () => {
      const result = service.getFavoris('Vue.js');

      expect(result).toBeUndefined();
    });
  });

  describe('favorisNames computed signal', () => {
    it('should return array of names', () => {
      service.setFavoris(mockFavoris);

      expect(service.favorisNames()).toEqual(['Angular', 'React']);
    });

    it('should return empty array when no favoris', () => {
      expect(service.favorisNames()).toEqual([]);
    });
  });

  describe('clearLocalState', () => {
    it('should clear all favoris', () => {
      service.setFavoris(mockFavoris);
      expect(service.favoris().length).toBe(2);

      service.clearLocalState();

      expect(service.favoris()).toEqual([]);
      expect(service.favorisCount()).toBe(0);
      expect(service.error()).toBeNull();
    });

    it('should clear localStorage', () => {
      service.setFavoris(mockFavoris);
      expect(localStorage.getItem('favoris')).not.toBeNull();

      service.clearLocalState();

      expect(localStorage.getItem('favoris')).toBeNull();
    });
  });

  describe('addFavoris', () => {
    beforeEach(() => {
      mockAuthService.getUserId.and.returnValue('user123');
      service.setFavoris(mockFavoris);
    });

    it('should not add if user not authenticated', (done) => {
      mockAuthService.getUserId.and.returnValue('');

      service.addFavoris(mockTechnology).subscribe(result => {
        expect(result).toBeFalse();
        expect(service.favoris().length).toBe(2);
        done();
      });
    });

    it('should not add duplicate favoris', (done) => {
      const existingTech: Technology = {
        name: 'Angular',
        logoUrl: 'https://example.com/angular.svg',
        domain: ['web']
      };

      service.addFavoris(existingTech).subscribe(result => {
        expect(result).toBeFalse();
        expect(service.favoris().length).toBe(2);
        done();
      });
    });
  });

  describe('removeFavoris', () => {
    beforeEach(() => {
      mockAuthService.getUserId.and.returnValue('user123');
      service.setFavoris(mockFavoris);
    });

    it('should not remove if user not authenticated', (done) => {
      mockAuthService.getUserId.and.returnValue('');

      service.removeFavoris('Angular').subscribe(result => {
        expect(result).toBeFalse();
        expect(service.favoris().length).toBe(2);
        done();
      });
    });

    it('should return false if favoris does not exist', (done) => {
      service.removeFavoris('NonExistent').subscribe(result => {
        expect(result).toBeFalse();
        done();
      });
    });
  });

  describe('toggleFavoris', () => {
    beforeEach(() => {
      mockAuthService.getUserId.and.returnValue('user123');
      service.setFavoris(mockFavoris);
    });

    it('should call removeFavoris if already in favorites', () => {
      spyOn(service, 'removeFavoris').and.returnValue(of(true));

      const existingTech: FavoriteTechnology = {
        name: 'Angular',
        logoUrl: 'https://example.com/angular.svg'
      };

      service.toggleFavoris(existingTech);

      expect(service.removeFavoris).toHaveBeenCalledWith('Angular');
    });

    it('should call addFavoris if not in favorites', () => {
      spyOn(service, 'addFavoris').and.returnValue(of(true));

      service.toggleFavoris(mockTechnology);

      expect(service.addFavoris).toHaveBeenCalledWith(mockTechnology);
    });
  });

  describe('Loading and Error States', () => {
    it('should have isLoading false initially', () => {
      expect(service.isLoading()).toBeFalse();
    });

    it('should have error null initially', () => {
      expect(service.error()).toBeNull();
    });
  });

  describe('localStorage error handling', () => {
    it('should handle corrupted localStorage data gracefully', () => {
      // Set corrupted data
      localStorage.setItem('favoris', 'not-valid-json');

      // Create new service - should not throw
      expect(() => {
        TestBed.resetTestingModule();
        TestBed.configureTestingModule({
          imports: [HttpClientTestingModule, MatSnackBarModule, NoopAnimationsModule],
          providers: [
            FavorisService,
            { provide: PLATFORM_ID, useValue: 'browser' },
            { provide: ProfileService, useValue: mockProfileService },
            { provide: AuthenticationService, useValue: mockAuthService }
          ]
        });
        TestBed.inject(FavorisService);
      }).not.toThrow();
    });
  });
});
