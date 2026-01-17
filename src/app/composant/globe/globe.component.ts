import { AfterViewInit, Component, ElementRef, OnInit, ViewChild, Inject, PLATFORM_ID, OnDestroy, ChangeDetectionStrategy, ChangeDetectorRef, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { FieldService } from '../../services/field.service';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { BehaviorSubject, Subject, filter, take, takeUntil } from 'rxjs';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-globe',
  imports: [MatProgressSpinnerModule, CommonModule],
  templateUrl: './globe.component.html',
  styleUrl: './globe.component.scss',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GlobeComponent implements OnInit, AfterViewInit, OnDestroy {

  @ViewChild('globeCanvas', { static: true }) canvasRef!: ElementRef<HTMLCanvasElement>;
  @ViewChild('bootScreen') bootScreenRef!: ElementRef<HTMLDivElement>;

  private ctx!: CanvasRenderingContext2D;
  private logos: HTMLImageElement[] = [];
  private points: { x: number, y: number, z: number, img: HTMLImageElement }[] = [];
  private angleY = 0;
  private animationFrameId: number | null = null;
  private images: string[] = [];
  private isBrowser: boolean;
  private lastFrameTime = 0;
  private targetFPS = 60;
  private frameInterval = 1000 / this.targetFPS;
  private static imageCache = new Map<string, HTMLImageElement>();
  private isVisible = true;
  private observer?: IntersectionObserver;
  private destroy$ = new Subject<void>();
  private isDestroyed = false;
  private pendingImages: HTMLImageElement[] = [];
  
  loading$ = new BehaviorSubject<boolean>(true);
  loadingProgress$ = new BehaviorSubject<number>(0);
  loadedImages = 0;
  totalImages = 0;
  showBoot = false;
  globeVisible: boolean = false;

  private readonly cdr = inject(ChangeDetectorRef);

  constructor(private _fieldService: FieldService, @Inject(PLATFORM_ID) platformId: Object) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  ngOnInit(): void {
    this.loading$.pipe(
      filter(done => !done), take(1)
    ).subscribe(() => {
      //this.showBoot = true;
      this.globeVisible = true;
      // OnPush: forcer la détection de changement quand le globe devient visible
      this.cdr.markForCheck();
    });
    if (this.isBrowser) {
      this.loadImagesLogos();
    }
  }


  ngAfterViewInit(): void {
    if (this.isBrowser) {
      const canvas = this.canvasRef.nativeElement;
      this.ctx = canvas.getContext('2d')!;
      canvas.width = 600;
      canvas.height = 600;
      
      this.setupIntersectionObserver();
      this.animationFrameId = requestAnimationFrame(() => this.animate());
    }
  }

  private setupIntersectionObserver(): void {
    if (!this.isBrowser || !('IntersectionObserver' in window)) {
      return;
    }

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
    if (this.animationFrameId === null && this.isVisible) {
      this.animationFrameId = requestAnimationFrame((time) => this.animate(time));
    }
  }




  private loadImages(urls: string[]): void {
    if (!this.isBrowser || this.isDestroyed) return;

    this.totalImages = urls.length;

    const createImage = (url: string) => {
      if (GlobeComponent.imageCache.has(url)) {
        return Promise.resolve(GlobeComponent.imageCache.get(url)!);
      }

      return new Promise<HTMLImageElement>((resolve, reject) => {
        const img = new Image();
        img.crossOrigin = 'anonymous';
        this.pendingImages.push(img);

        img.onload = () => {
          if (this.isDestroyed) {
            reject(new Error('Component destroyed'));
            return;
          }
          GlobeComponent.imageCache.set(url, img);
          resolve(img);
        };
        img.onerror = (err) => {
          if (!this.isDestroyed) {
            reject(err);
          }
        };

        img.src = url;
      });
    };

    const promises = urls.map(url =>
      createImage(url).then(img => {
        if (this.isDestroyed) return img;
        this.logos.push(img);
        this.loadedImages++;
        const percent = Math.round((this.loadedImages / this.totalImages) * 100);
        this.loadingProgress$.next(percent);
        return img;
      })
    );

    Promise.all(promises)
      .then(() => {
        if (!this.isDestroyed) {
          this.onAllImagesLoaded();
        }
      })
      .catch(err => {
        if (!this.isDestroyed) {
          console.error('Error loading images', err);
        }
      });
  }


  private onAllImagesLoaded(): void {
    this.generatePoints();
    this.loading$.next(false);
  }

  private generatePoints(): void {
    const total = this.logos.length;
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


  private animate(currentTime: number = 0): void {
    this.animationFrameId = requestAnimationFrame((time) => this.animate(time));
    
    if (!this.isVisible) return;
    
    if (currentTime - this.lastFrameTime >= this.frameInterval) {
      this.draw();
      this.angleY += 0.005;
      this.lastFrameTime = currentTime;
    }
  }


  private draw(): void {
    const ctx = this.ctx;
    const canvas = ctx.canvas;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
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

    ctx.save();
    for (const p of rotated) {
      if (p.size > 2 && p.x > -p.size && p.x < canvas.width + p.size && 
          p.y > -p.size && p.y < canvas.height + p.size) {
        ctx.drawImage(p.img, p.x - p.size / 2, p.y - p.size / 2, p.size, p.size);
      }
    }
    ctx.restore();
  }



  private loadImagesLogos(): void {
    if (!this.isBrowser) return;

    this._fieldService.getAllImages()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (logos: string[]) => {
          this.images = Array.from(new Set(logos));
          this.loadImages(this.images);
        },
        error: (error) => {
          console.error('Erreur lors de la recuperation des images', error);
        }
      });
  }


  getLoading(status: any) {
    return status === false ? 'canvasLoad' : 'canvasNotLoad'
  }

  displayLoadingLevel(time: any) {
    return Math.round(time)
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
    }

    // Clean up pending image handlers to prevent memory leaks
    for (const img of this.pendingImages) {
      img.onload = null;
      img.onerror = null;
      img.src = '';
    }
    this.pendingImages.length = 0;

    this.loading$.complete();
    this.loadingProgress$.complete();

    this.logos.length = 0;
    this.points.length = 0;

    if (this.ctx && this.canvasRef?.nativeElement) {
      this.ctx.clearRect(0, 0, this.canvasRef.nativeElement.width, this.canvasRef.nativeElement.height);
    }
  }

  onBootAnimationEnd() {
    this.showBoot = false;
    this.globeVisible = true;
    this.cdr.markForCheck();
  }
}