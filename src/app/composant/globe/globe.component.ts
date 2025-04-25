import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
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
})
export class GlobeComponent implements OnInit, AfterViewInit {

  @ViewChild('globeCanvas', { static: true }) canvasRef!: ElementRef<HTMLCanvasElement>;
  private resizeCanvas: HTMLCanvasElement = document.createElement('canvas');
  private resizeCtx: CanvasRenderingContext2D = this.resizeCanvas.getContext('2d')!;
  private ctx!: CanvasRenderingContext2D;
  private logos: HTMLImageElement[] = [];
  private points: { x: number, y: number, z: number, img: HTMLImageElement }[] = [];
  private images: string[] = [];

  loading: boolean = true;
  showBoot = false;
  globeVisible = false;

  private angleY = 0;
  private rotationSpeed = 0;
  private targetRotationSpeed = 0.005;
  private animationFrameId: number | null = null;
  private canvasWidth = 600;
  private canvasHeight = 600;
  private rotationSpeedIncrement = 0.0001; // Configurable rotation speed increment
  totalImages: number = 0;
  loadedImages: number = 0;

  private destroy$ = new Subject<void>();

  constructor(private _fieldService: FieldService) {}

  ngOnInit(): void {
    this.loadImagesLogos();
    setTimeout(() => {
      this.showBoot = false;
      this.globeVisible = true;
    }, 3500); // Durée du "boot"
    this.destroy$.next();
    this.destroy$.complete();
  }

  ngAfterViewInit(): void {
    const canvas = this.canvasRef.nativeElement;
    this.ctx = canvas.getContext('2d')!;
    this.ctx.imageSmoothingEnabled = true;
   
    canvas.width = this.canvasWidth;
    canvas.height = this.canvasHeight;
    this.startAnimation();
  }

  ngOnDestroy(): void {
    if (this.animationFrameId !== null) {
      cancelAnimationFrame(this.animationFrameId);
    }
  }

  private loadImagesLogos(): void {
    this._fieldService.getAllImages().subscribe({
      next: (logos: string[]) => {
        if (!logos || logos.length === 0) {
          console.warn('No images received from the service.');
          this.loading = false;
          return;
        }
        this.images = Array.from(new Set(logos));
        this.loadImages(this.images);
      },
      error: (error) => console.error('Erreur lors de la récupération des images', error)
    });
  }

  private loadImages(urls: string[]): void {
    this.totalImages = urls.length;
    this.loadedImages = 0;
    urls.forEach(url => {
      const img = new Image();
      img.src = url;
      img.onload = () => {
        const resizedImg = this.resizeImage(img, 32);
        this.logos.push(resizedImg);
        this.loadedImages++;
        if (this.loadedImages === this.totalImages) {
          setTimeout(() => {
            this.loading = false;
            this.showBoot = true;
          }, 1000);
          this.generatePoints();
        }}})}

  private resizeImage(img: HTMLImageElement, size = 64): HTMLImageElement {
    this.resizeCanvas.width = size;
    this.resizeCanvas.height = size;
    this.resizeCtx.clearRect(0, 0, size, size);
    this.resizeCtx.drawImage(img, 0, 0, size, size);
    const resizedImg = new Image();
    resizedImg.src = this.resizeCanvas.toDataURL();
    return resizedImg;
  }
   

  

  private generatePoints(): void {
    const total = this.logos.length;
    const radius = 250;
    this.points = this.logos.map((img, index) => {
      const phi = Math.acos(-1 + (2 * index) / total);
      const theta = Math.sqrt(total * Math.PI) * phi;
      const x = radius * Math.cos(theta) * Math.sin(phi);
      const y = radius * Math.sin(theta) * Math.sin(phi);
      const z = radius * Math.cos(phi);
      return { x, y, z, img };
    });
  }

  private startAnimation(): void {
    const animate = () => {
      this.animationFrameId = requestAnimationFrame(animate);
      this.updateRotation();
      this.draw();
    };
    animate();
  }

  private updateRotation(): void {
    this.angleY += 0.04;
  }
  private stopAnimation(): void {
    if (this.animationFrameId !== null) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }
  }

  private draw(): void {
    const ctx = this.ctx;
    ctx.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
    const cy = this.canvasHeight / 2;
    const cx = this.canvasWidth / 2;

    // Ensure scale is bounded to avoid rendering artifacts
    const rotated = this.points.map(({ x, y, z, img }) => {
      const cosY = Math.cos(this.angleY);
      const sinY = Math.sin(this.angleY);
      const xRot = x * cosY - z * sinY;
      const zRot = z * cosY + x * sinY;
      let scale = 500 / (500 + zRot);
      scale = Math.max(0.1, Math.min(scale, 5)); // Constrain scale between 0.1 and 5
      return {
        x: cx + xRot * scale,
        y: cy + y * scale,
        size: scale * 30,
        img,
        z: zRot
      };
    });
    const sortedPoints = this.points.map(({ x, y, z, img }) => {
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

    sortedPoints.sort((a, b) => b.z - a.z);

    for (const p of sortedPoints) {
      ctx.drawImage(p.img, p.x - p.size / 2, p.y - p.size / 2, p.size, p.size);
    }
  
  }


  getLoading(status: any) {
    return status === false ? 'canvasLoad' : 'canvasNotLoad'
  }

  displayLoadingLevel(time: any) {
    return Math.round(time)
  }

}
