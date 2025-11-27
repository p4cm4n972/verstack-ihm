import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { Router, RouterModule } from '@angular/router';
import { AuthenticationService } from '../../services/authentication.service';
import { IsMobileOnlyDirective } from '../../shared/is-mobile-only.directive';
import { IsDesktopOnlyDirective } from '../../shared/is-desktop-only.directive';

@Component({
  selector: 'app-sidenav',
  imports: [MatListModule, MatIconModule, MatMenuModule, RouterModule, IsMobileOnlyDirective, IsDesktopOnlyDirective],
  templateUrl: './sidenav.component.html',
  styleUrl: './sidenav.component.scss',
})
export class SidenavComponent implements OnInit {
  isAuthenticated: boolean = false;
  @Output() sidenavClose = new EventEmitter();
  authStatus: boolean = false;
  isAdmin: boolean = false;
  isSubscriber: boolean = false;
  userRole: string = '';


  constructor(
    private authService: AuthenticationService,
    private router: Router
  ) {}



  ngOnInit(): void {
    this.authService.getAuthStatus().subscribe((status) => {
      this.isAuthenticated = status;
      this.userRole = this.authService.getUserRole();
      this.isAdmin = status && this.userRole === 'admin';
      this.isSubscriber = status && this.userRole === 'subscriber';
    });
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/signup']);
  }

  public onSidenavClose = () => {
    this.sidenavClose.emit();
  };
}
