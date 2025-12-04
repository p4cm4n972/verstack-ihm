import { Component, Output, EventEmitter, OnDestroy, OnInit } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Router, RouterModule } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
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
export class HeaderComponent implements OnInit, OnDestroy {
  @Output() public sidenavToggle = new EventEmitter();
  authStatus: boolean = false;
  isAdmin: boolean = false;
  isSubscriber: boolean = false;
  userRole: string = '';

  private destroy$ = new Subject<void>();

  constructor(
    private authService: AuthenticationService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Synchronise l'état d'auth au démarrage
    this.authService.checkAuthOnStartup?.();

    this.authService.getAuthStatus().pipe(takeUntil(this.destroy$)).subscribe(status => {
      this.authStatus = status;
      this.userRole = this.authService.getUserRole();
      this.isAdmin = status && this.userRole === 'admin';
      this.isSubscriber = status && this.userRole === 'subscriber';
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
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
