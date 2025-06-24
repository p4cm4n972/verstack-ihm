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
      keywords: `verstack, langages, outils, développeurs, Angular, React , version Angular, version React, version Vue.js, version Node.js, version Python, version Java,
      version C#, version PHP, version Ruby, version Go, version Rust, version JavaScript, version TypeScript, version Bash, version Shell, version Perl,
      version Kotlin, version Swift, version Scala, version Dart, version Objective-C, version C, version C++, version R, version MATLAB, version Julia,
      version Haskell, version Elixir, version Erlang, version F#, version Groovy, version PowerShell, version Assembly, version SQL, version HTML,
      version CSS, version SASS, version LESS, version Docker, version Kubernetes, version Terraform, version Ansible, version Jenkins, version Git,
      version GitHub Actions, version Travis CI, version CircleCI, version Webpack, version Babel, version ESLint, version Prettier, version Nginx,
      version Apache, version PostgreSQL, version MySQL, version MongoDB, version Redis, version GraphQL, version Firebase, version Supabase,
      version Netlify, version Vercel, version AWS, version Azure, version GCP`,
      image,
      url: 'https://verstack.io/stat'
    });
  }

}
