import { Component, Output, EventEmitter, OnInit } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Router, RouterModule } from '@angular/router';
import { AuthenticationService } from '../../services/authentication.service';
import { IsDesktopOnlyDirective } from '../../shared/is-desktop-only.directive';
import { IsMobileOnlyDirective } from '../../shared/is-mobile-only.directive';

@Component({
  selector: 'app-header',
  imports: [
    IsDesktopOnlyDirective,
    IsMobileOnlyDirective,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    RouterModule
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent implements OnInit {
  @Output() public sidenavToggle = new EventEmitter();
  authStatus: boolean = false;
  isAdmin: boolean = false;

  constructor(
    private authService: AuthenticationService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Synchronise l'état d'auth au démarrage
    this.authService.checkAuthOnStartup?.();

    this.authService.getAuthStatus().subscribe(status => {
      this.authStatus = status;
      this.isAdmin = status && this.authService.getUserRole() === 'admin';
    });
  }

  logout() {
    this.authService.logout();
    this.authService.updateAuthStatus(false);
    this.router.navigate(['/home']);
  }

  public onToggleSidenav = () => {
    this.sidenavToggle.emit();
  }
}
