import { Component, Output, EventEmitter, OnInit } from '@angular/core';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import { Router, RouterModule } from '@angular/router';
import { AuthenticationService } from '../../services/authentication.service';
import { IsDesktopOnlyDirective } from '../../shared/is-desktop-only.directive';
import { IsMobileOnlyDirective } from '../../shared/is-mobile-only.directive';

@Component({
  selector: 'app-header',
  imports: [IsDesktopOnlyDirective, IsMobileOnlyDirective, MatToolbarModule, MatButtonModule, MatIconModule, RouterModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent implements OnInit {
  constructor(private authService: AuthenticationService, private router: Router) { }
  @Output() public sidenavToggle = new EventEmitter();
  authStatus: boolean = false;

  ngOnInit(): void {
    this.authService.getAuthStatus().subscribe(status => {
      this.authStatus = status;
    });
  }

  logout() {
    this.authService.updateAuthStatus(false);

    this.authService.logout();
    this.router.navigate(['/signup']);
  }

  public onToggleSidenav = () => {
    this.sidenavToggle.emit();
  }

}
