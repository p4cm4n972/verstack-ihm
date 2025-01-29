import { Component, ElementRef } from '@angular/core';
import { FieldService } from '../../services/field.service';

@Component({
  selector: 'app-globe',
  imports: [],
  templateUrl: './globe.component.html',
  styleUrl: './globe.component.scss'
})
export class GlobeComponent {

  images: any[] = []
  loading: boolean = true;
  totalImages: number = 0;
  loadedImages: number = 0;
  progress: number = 0;

  constructor(private _fieldService: FieldService,private elementRef: ElementRef) {
  }

  ngOnInit(): void {
    this.loadImages()
  }
  ngAfterViewInit(): void {
  }

  loadImages(): void {

    this._fieldService.getImages().subscribe(
      (logos: string[]) => {
        this.images = logos;
        this.totalImages = this.images.length;
      },
      (error) => {
        console.error('Erreur lors de la recuperation des images', error);
      },
      () => {
        // this.loading = false;
      }
    )
  }

  onImageLoad(): void {
    this.loadedImages++;
    const newProgress = Math.round((this.loadedImages / this.totalImages) * 100);
    this.progress = newProgress;
    if ((this.loadedImages == this.totalImages) && this.progress == 100) {
      this.loading = false;
      this.positionImagesOnSphere();

    }
  }

  positionImagesOnSphere(): void {
    const globe = this.elementRef.nativeElement.querySelector('.globe');
    const images = globe.querySelectorAll('img');
    const totalImages = images.length;
    const radius = 300; // rayon de la sphère

    images.forEach((img: HTMLElement, index: number) => {
      const phi = Math.acos(-1 + (2 * index) / totalImages); // angle vertical
      const theta = Math.sqrt(totalImages * Math.PI) * phi; // angle horizontal

      const x = radius * Math.cos(theta) * Math.sin(phi);
      const y = radius * Math.sin(theta) * Math.sin(phi);
      const z = radius * Math.cos(phi);

      img.style.transform = `translate3d(${x}px, ${y}px, ${z}px)`;
    });
  }
}
