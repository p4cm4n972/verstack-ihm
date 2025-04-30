import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
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
export class GlobeComponent implements OnInit, AfterViewInit {

  @ViewChild('globeCanvas', { static: true }) canvasRef!: ElementRef<HTMLCanvasElement>;
  @ViewChild('bootScreen') bootScreenRef!: ElementRef<HTMLDivElement>;

  private ctx!: CanvasRenderingContext2D;
  private logos: HTMLImageElement[] = [];
  private points: { x: number, y: number, z: number, img: HTMLImageElement }[] = [];
  private angleY = 0;
  private images: any[] = []
  loading$ = new BehaviorSubject<boolean>(true);
  loadingProgress$ = new BehaviorSubject<number>(0);
  loadedImages = 0;
  totalImages = 0;
  showBoot = false;
  globeVisible: boolean = false;

  constructor(private _fieldService: FieldService) {
  }

  ngOnInit(): void {
    this.loading$.pipe(
      filter(done => !done), take(1)
    ).subscribe(() => {
      this.showBoot = true;
    });
    this.loadImagesLogos();
  }


  ngAfterViewInit(): void {
    const canvas = this.canvasRef.nativeElement;
    this.ctx = canvas.getContext('2d')!;
    canvas.width = 600;
    canvas.height = 600;
    this.animate();
  }




  private loadImages(urls: string[]): void {
    urls.forEach(url => {
      const img = new Image();
      this.totalImages = urls.length;
      img.src = url;
      img.onload = () => {
        this.logos.push(img);
        this.loadedImages++;
        const percent = (this.loadedImages / this.totalImages) * 100;
        this.loadingProgress$.next(percent);
        if (this.loadedImages === this.totalImages) {
         setTimeout(()=> this.onAllImagesLoaded(), 1000); ;
        }
      };
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


  private animate(): void {
    requestAnimationFrame(() => this.animate());
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

  onBootAnimationEnd() {
    this.showBoot = false;
    this.globeVisible = true;

  }
}