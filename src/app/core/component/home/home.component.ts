import { Component } from '@angular/core';
import { MatTabsModule } from '@angular/material/tabs';
import { GlobeComponent } from '../../../composant/globe/globe.component';
import { TapeTextConsoleComponent } from '../../../composant/tape-text-console/tape-text-console.component';
import { Router, RouterModule } from '@angular/router';
import { AuthenticationService } from '../../../services/authentication.service';
import { Title, Meta } from '@angular/platform-browser';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterModule, MatTabsModule, GlobeComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent {
  authStatus: boolean = false;
  userData: any;
  constructor(
    private authService: AuthenticationService,
    private router: Router,
    private title: Title, private meta: Meta
  ) { }

  ngOnInit(): void {
    this.title.setTitle('Verstack.io – L’univers des stacks');
    this.meta.addTags([
      { name: 'description', content: 'Référentiel des versions à jour pour tous les langages et frameworks.' },
      { name: 'keywords', content: 'frameworks, langages, versions, verstack, Angular, React, Node.js' }
    ]);
    this.authService.getAuthStatus().subscribe((status) => {
      this.authStatus = status;
    });
    const storedUserData = localStorage.getItem('user');
    if (storedUserData) {
      this.userData = JSON.parse(storedUserData);
    } else {
      this.userData = null;
    }
  }


}
