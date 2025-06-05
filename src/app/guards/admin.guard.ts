import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthenticationService } from '../services/authentication.service';
import { jwtDecode } from 'jwt-decode';

@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate {
  constructor(private authService: AuthenticationService, private router: Router) {}

  canActivate(): boolean {
    const token = this.authService.getAccessToken();
    if (!token) {
      this.router.navigate(['/signup']);
      return false;
    }
    try {
      const decoded: any = jwtDecode(token);
      if (decoded.exp * 1000 > Date.now() && decoded.role === 'admin') {
        return true;
      }
    } catch {
      // ignore decoding errors
    }
    this.router.navigate(['/home']);
    return false;
  }
}
