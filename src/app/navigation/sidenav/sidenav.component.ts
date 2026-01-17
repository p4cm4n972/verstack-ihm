import { Component, EventEmitter, OnDestroy, OnInit, Output, afterNextRender, ChangeDetectorRef } from '@angular/core';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { Router, RouterModule } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { AuthenticationService } from '../../services/authentication.service';
import { IsMobileOnlyDirective } from '../../shared/is-mobile-only.directive';
import { IsDesktopOnlyDirective } from '../../shared/is-desktop-only.directive';

@Component({
  selector: 'app-sidenav',
  imports: [MatListModule, MatIconModule, MatMenuModule, RouterModule, IsMobileOnlyDirective, IsDesktopOnlyDirective],
  templateUrl: './sidenav.component.html',
  styleUrl: './sidenav.component.scss',
})
export class SidenavComponent implements OnInit, OnDestroy {
  isAuthenticated: boolean | null = null; // null = not yet determined (SSR/hydration)
  @Output() sidenavClose = new EventEmitter();
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
    this.authService.getAuthStatus().pipe(takeUntil(this.destroy$)).subscribe((status) => {
      // Only update if we've initialized (isAuthenticated is not null)
      if (this.isAuthenticated !== null) {
        this.isAuthenticated = status;
        this.userRole = this.authService.getUserRole();
        this.isAdmin = status && this.userRole === 'admin';
        this.isSubscriber = status && this.userRole === 'subscriber';
      }
    });
  }

  private initializeAuth(): void {
    this.authService.getAuthStatus().pipe(takeUntil(this.destroy$)).subscribe((status) => {
      this.isAuthenticated = status;
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
    this.router.navigate(['/signup']);
  }

  public onSidenavClose = () => {
    this.sidenavClose.emit();
  };
}
