import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { ChartComponent } from '../../../composant/chart/chart.component';
import { SeoService } from '../../../services/seo.service';

@Component({
  selector: 'app-stat',
  imports: [ChartComponent],
  templateUrl: './stat.component.html',
  styleUrl: './stat.component.scss'
})
export class StatComponent implements OnInit {
  constructor(
    private seo: SeoService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit(): void {
    let image: string | undefined = undefined;
    if (isPlatformBrowser(this.platformId)) {
      image = `${window.location.origin}/assets/slider/slider-1.jpg`;
    }
    this.seo.updateMetaData({
      title: 'Statistiques – Verstack.io',
      description: 'Explorez les statistiques des langages de programmation et des outils de développement.',
      keywords: 'statistiques, langages, outils, développeurs, Angular, React',
      image,
      url: 'https://verstack.io/stat'
    });
  }

}
