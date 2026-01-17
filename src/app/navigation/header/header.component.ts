import { Component, Output, EventEmitter, OnDestroy, OnInit, afterNextRender, ChangeDetectorRef } from '@angular/core';
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
  authStatus: boolean | null = null; // null = not yet determined (SSR/hydration)
  isAdmin: boolean = false;
  isSubscriber: boolean = false;
  userRole: string = '';

  private destroy$ = new Subject<void>();

  constructor(
    private authService: AuthenticationService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {
    // Ensure auth check happens only after hydration on the client
    afterNextRender(() => {
      this.initializeAuth();
    });
  }

  ngOnInit(): void {
    // Subscribe to auth status changes (will receive updates after initialization)
    this.authService.getAuthStatus().pipe(takeUntil(this.destroy$)).subscribe(status => {
      // Only update if we've initialized (authStatus is not null)
      if (this.authStatus !== null) {
        this.authStatus = status;
        this.userRole = this.authService.getUserRole();
        this.isAdmin = status && this.userRole === 'admin';
        this.isSubscriber = status && this.userRole === 'subscriber';
      }
    });
  }

  private initializeAuth(): void {
    // Synchronise l'état d'auth au démarrage (only on client after hydration)
    this.authService.checkAuthOnStartup?.();

    // Now get the actual status
    this.authStatus = this.authService.getUserRole() ? true : false;
    // Re-check with the service
    this.authService.getAuthStatus().pipe(takeUntil(this.destroy$)).subscribe(status => {
      this.authStatus = status;
      this.userRole = this.authService.getUserRole();
      this.isAdmin = status && this.userRole === 'admin';
      this.isSubscriber = status && this.userRole === 'subscriber';
      this.cdr.markForCheck();
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
