import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatToolbarModule } from '@angular/material/toolbar';
import {MatChipsModule} from '@angular/material/chips';
import {MatGridListModule} from '@angular/material/grid-list';

interface Article {
  title: string;
  framework: string;
  image: string;
  excerpt: string;
}

@Component({
  selector: 'app-news',
  imports: [
    MatToolbarModule,
    MatFormFieldModule,
    MatInputModule,
    MatCardModule,
    MatButtonModule,
    MatChipsModule,
    MatGridListModule
  ],
  templateUrl: './news.component.html',
  styleUrl: './news.component.scss',
})
export class NewsComponent {
  frameworks: string[] = ['Angular', 'Vue.js', 'React', 'SwiftUI', 'Svelte', 'Next.js'];
  
  // Liste d'articles (exemple, à remplacer par une requête backend)
  articles: Article[] = [
    { title: 'Introduction à Angular', framework: 'Angular', image: 'assets/images/angular.png', excerpt: 'Découvrez les bases d\'Angular et démarrez votre projet avec ce framework puissant.' },
    { title: 'Créer une app Vue.js', framework: 'Vue.js', image: 'assets/images/vuejs.png', excerpt: 'Apprenez à structurer une application performante avec Vue.js.' },
    { title: 'Guide complet React', framework: 'React', image: 'assets/images/react.png', excerpt: 'Les meilleures pratiques pour réussir avec React.' },
    { title: 'Créer une UI moderne avec SwiftUI', framework: 'SwiftUI', image: 'assets/images/swiftui.png', excerpt: 'Démarrez facilement avec SwiftUI pour vos apps iOS et macOS.' }
  ];
  
  filteredArticles: Article[] = this.articles;

  // Recherche simple
  searchArticles(keyword: string): void {
    this.filteredArticles = this.articles.filter(article =>
      article.title.toLowerCase().includes(keyword.toLowerCase()) ||
      article.excerpt.toLowerCase().includes(keyword.toLowerCase())
    );
  }

  // Filtre par framework
  filterByFramework(framework: string): void {
    this.filteredArticles = framework === 'Tous'
      ? this.articles
      : this.articles.filter(article => article.framework === framework);
  }
}
