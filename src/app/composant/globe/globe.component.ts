import { AfterViewInit, Component, ElementRef, OnInit, ViewChild, Inject, PLATFORM_ID, OnDestroy, ChangeDetectorRef, inject, NgZone } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { FieldService } from '../../services/field.service';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { BehaviorSubject, Subject, takeUntil } from 'rxjs';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-globe',
  imports: [MatProgressSpinnerModule, CommonModule],
  templateUrl: './globe.component.html',
  styleUrl: './globe.component.scss',
  standalone: true
  // Retiré OnPush pour éviter les problèmes de détection de changement
})
export class GlobeComponent implements OnInit, AfterViewInit, OnDestroy {

  @ViewChild('globeCanvas', { static: true }) canvasRef!: ElementRef<HTMLCanvasElement>;

  private ctx!: CanvasRenderingContext2D;
  private logos: HTMLImageElement[] = [];
  private points: { x: number, y: number, z: number, img: HTMLImageElement }[] = [];
  private angleY = 0;
  private animationFrameId: number | null = null;
  private isBrowser: boolean;
  private lastFrameTime = 0;
  private targetFPS = 60;
  private frameInterval = 1000 / this.targetFPS;
  private static imageCache = new Map<string, HTMLImageElement>();
  private isVisible = true;
  private observer?: IntersectionObserver;
  private destroy$ = new Subject<void>();
  private isDestroyed = false;

  loading$ = new BehaviorSubject<boolean>(true);
  loadingProgress$ = new BehaviorSubject<number>(0);
  loadedImages = 0;
  totalImages = 0;
  globeVisible = false;

  private readonly ngZone = inject(NgZone);

  constructor(private _fieldService: FieldService, @Inject(PLATFORM_ID) platformId: Object) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  ngOnInit(): void {
    // Rien à faire ici - tout est dans ngAfterViewInit
  }

  ngAfterViewInit(): void {
    if (!this.isBrowser) return;

    const canvas = this.canvasRef?.nativeElement;
    if (!canvas) return;

    this.ctx = canvas.getContext('2d')!;
    canvas.width = 600;
    canvas.height = 600;

    this.setupIntersectionObserver();
    this.loadImagesLogos();

    // Démarrer l'animation en dehors de NgZone
    this.ngZone.runOutsideAngular(() => {
      this.animationFrameId = requestAnimationFrame((t) => this.animate(t));
    });
  }

  private setupIntersectionObserver(): void {
    if (!this.isBrowser || !('IntersectionObserver' in window)) return;

    this.observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        this.isVisible = entry.isIntersecting;
        if (!this.isVisible) {
          this.pauseAnimation();
        } else {
          this.resumeAnimation();
        }
      });
    }, { threshold: 0.1 });

    this.observer.observe(this.canvasRef.nativeElement);
  }

  private pauseAnimation(): void {
    if (this.animationFrameId !== null) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }
  }

  private resumeAnimation(): void {
    if (this.animationFrameId === null && this.isVisible && !this.isDestroyed) {
      this.ngZone.runOutsideAngular(() => {
        this.animationFrameId = requestAnimationFrame((t) => this.animate(t));
      });
    }
  }

  private loadImagesLogos(): void {
    if (!this.isBrowser || this.isDestroyed) return;

    this._fieldService.getAllImages()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (logos: string[]) => {
          const uniqueLogos = Array.from(new Set(logos));
          this.loadImages(uniqueLogos);
        },
        error: (err) => console.error('Erreur chargement images:', err)
      });
  }

  private loadImages(urls: string[]): void {
    if (!this.isBrowser || this.isDestroyed || urls.length === 0) return;

    this.totalImages = urls.length;
    this.loadedImages = 0;
    this.logos = [];

    let loadedCount = 0;

    urls.forEach(url => {
      // Utiliser le cache si disponible
      if (GlobeComponent.imageCache.has(url)) {
        const cachedImg = GlobeComponent.imageCache.get(url)!;
        this.logos.push(cachedImg);
        loadedCount++;
        this.loadedImages = loadedCount;
        this.loadingProgress$.next(Math.round((loadedCount / this.totalImages) * 100));

        if (loadedCount === this.totalImages) {
          this.onAllImagesLoaded();
        }
        return;
      }

      // Charger l'image
      const img = new Image();
      img.crossOrigin = 'anonymous';

      img.onload = () => {
        if (this.isDestroyed) return;

        GlobeComponent.imageCache.set(url, img);
        this.logos.push(img);
        loadedCount++;
        this.loadedImages = loadedCount;
        this.loadingProgress$.next(Math.round((loadedCount / this.totalImages) * 100));

        if (loadedCount === this.totalImages) {
          this.onAllImagesLoaded();
        }
      };

      img.onerror = () => {
        if (this.isDestroyed) return;
        loadedCount++;
        if (loadedCount === this.totalImages) {
          this.onAllImagesLoaded();
        }
      };

      img.src = url;
    });
  }

  private onAllImagesLoaded(): void {
    if (this.isDestroyed) return;

    this.generatePoints();
    this.loading$.next(false);
    this.globeVisible = true;
  }

  private generatePoints(): void {
    const total = this.logos.length;
    if (total === 0) return;

    const radius = 240;
    this.points = this.logos.map((img, index) => {
      const phi = Math.acos(-1 + (2 * index) / total);
      const theta = Math.sqrt(total * Math.PI) * phi;
      const x = radius * Math.cos(theta) * Math.sin(phi);
      const y = radius * Math.sin(theta) * Math.sin(phi);
      const z = radius * Math.cos(phi);
      return { x, y, z, img };
    });
  }

  private animate(currentTime: number): void {
    if (this.isDestroyed) return;

    this.animationFrameId = requestAnimationFrame((t) => this.animate(t));

    if (!this.isVisible || this.points.length === 0) return;

    if (currentTime - this.lastFrameTime >= this.frameInterval) {
      this.draw();
      this.angleY += 0.005;
      this.lastFrameTime = currentTime;
    }
  }

  private draw(): void {
    if (!this.ctx) return;

    const canvas = this.ctx.canvas;
    this.ctx.clearRect(0, 0, canvas.width, canvas.height);
    const cx = canvas.width / 2, cy = canvas.height / 2;

    const cosY = Math.cos(this.angleY);
    const sinY = Math.sin(this.angleY);

    const rotated = this.points.map(({ x, y, z, img }) => {
      const xRot = x * cosY - z * sinY;
      const zRot = z * cosY + x * sinY;
      const scale = 500 / (500 + zRot);
      return {
        x: cx + xRot * scale,
        y: cy + y * scale,
        size: Math.max(scale * 30, 2),
        img,
        z: zRot
      };
    });

    rotated.sort((a, b) => b.z - a.z);

    this.ctx.save();
    for (const p of rotated) {
      if (p.size > 2 && p.x > -p.size && p.x < canvas.width + p.size &&
          p.y > -p.size && p.y < canvas.height + p.size) {
        this.ctx.drawImage(p.img, p.x - p.size / 2, p.y - p.size / 2, p.size, p.size);
      }
    }
    this.ctx.restore();
  }

  ngOnDestroy(): void {
    this.isDestroyed = true;
    this.destroy$.next();
    this.destroy$.complete();

    if (this.animationFrameId !== null) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }

    if (this.observer) {
      this.observer.disconnect();
      this.observer = undefined;
    }

    this.loading$.complete();
    this.loadingProgress$.complete();

    this.logos = [];
    this.points = [];
  }
}