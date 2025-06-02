import { Component, OnInit } from '@angular/core';
import { ChartComponent } from "../../../composant/chart/chart.component";
import { SeoService } from '../../../services/seo.service';

@Component({
  selector: 'app-stat',
  imports: [ChartComponent],
  templateUrl: './stat.component.html',
  styleUrl: './stat.component.scss'
})
export class StatComponent implements OnInit {
  constructor(private seo: SeoService) { }

  ngOnInit(): void {
    this.seo.updateMetaData({
      title: 'Statistiques – Verstack.io',
      description: 'Explorez les statistiques des langages de programmation et des outils de développement.',
      keywords: 'statistiques, langages, outils, développeurs, Angular, React',
      image: `${window.location.origin}/assets/slider/slider-1.jpg`,
      url: 'https://verstack.io/stat'
    });
  }

}
