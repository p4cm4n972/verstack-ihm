import { AfterViewInit, Component, ElementRef, OnInit, ViewChild, Inject, PLATFORM_ID, OnDestroy } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { FieldService } from '../../services/field.service';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { BehaviorSubject, filter, take } from 'rxjs';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-globe',
  imports: [MatProgressSpinnerModule, CommonModule],
  templateUrl: './globe.component.html',
  styleUrl: './globe.component.scss',
  standalone: true
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
  loading$ = new BehaviorSubject<boolean>(true);
  loadingProgress$ = new BehaviorSubject<number>(0);
  loadedImages = 0;
  totalImages = 0;
  showBoot = false;
  globeVisible: boolean = false;

  constructor(private _fieldService: FieldService, @Inject(PLATFORM_ID) platformId: Object) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  ngOnInit(): void {
    this.loading$.pipe(
      filter(done => !done), take(1)
    ).subscribe(() => {
      //this.showBoot = true;
      this.globeVisible = true;
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
      this.animationFrameId = requestAnimationFrame(() => this.animate());
    }
  }




  private loadImages(urls: string[]): void {
    if (!this.isBrowser) return;

    this.totalImages = urls.length;

    const createImage = (url: string) => new Promise<HTMLImageElement>((resolve, reject) => {
      const img = new Image();
      img.src = url;
      img.onload = () => resolve(img);
      img.onerror = reject;
    });

    const promises = urls.map(url =>
      createImage(url).then(img => {
        this.logos.push(img);
        this.loadedImages++;
        const percent = Math.round((this.loadedImages / this.totalImages) * 100);
        this.loadingProgress$.next(percent);
        return img;
      })
    );

    Promise.all(promises).then(() => this.onAllImagesLoaded())
      .catch(err => console.error('Error loading images', err));
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


  private animate(): void {
    this.animationFrameId = requestAnimationFrame(() => this.animate());
    this.draw();
    this.angleY += 0.005;
  }


  private draw(): void {
    const ctx = this.ctx;
    ctx.clearRect(0, 0, 600, 600);
    const cx = 300, cy = 300;

    const rotated = this.points.map(({ x, y, z, img }) => {
      const cosY = Math.cos(this.angleY);
      const sinY = Math.sin(this.angleY);
      const xRot = x * cosY - z * sinY;
      const zRot = z * cosY + x * sinY;
      const scale = 500 / (500 + zRot);
      return {
        x: cx + xRot * scale,
        y: cy + y * scale,
        size: scale * 30,
        img,
        z: zRot
      };
    });

    rotated.sort((a, b) => b.z - a.z); // draw farthest points first

    for (const p of rotated) {
      ctx.drawImage(p.img, p.x - p.size / 2, p.y - p.size / 2, p.size, p.size);
    }
  }



  private loadImagesLogos(): void {
    if (!this.isBrowser) return;

    this._fieldService.getAllImages().subscribe({
      next: (logos: string[]) => {
        this.images = Array.from(new Set(logos));
        //this.totalImages = this.images.length;
        this.loadImages(this.images)
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
    if (this.animationFrameId !== null) {
      cancelAnimationFrame(this.animationFrameId);
    }
  }

  onBootAnimationEnd() {
    this.showBoot = false;
    this.globeVisible = true;

  }
}