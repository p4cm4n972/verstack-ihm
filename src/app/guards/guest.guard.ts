import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthenticationService } from '../services/authentication.service';
import { jwtDecode } from 'jwt-decode';

@Injectable({
  providedIn: 'root'
})
export class GuestGuard implements CanActivate {
  constructor(
    private authService: AuthenticationService, 
    private router: Router
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {
    const token = this.authService.getAccessToken();
    
    if (token) {
      try {
        const decoded: any = jwtDecode(token);
        
        // Si l'utilisateur a un token valide, rediriger vers la page d'accueil
        if (decoded.exp * 1000 > Date.now()) {
          this.router.navigate(['/home']);
          return false;
        }
      } catch (error) {
        // Token invalide, permettre l'accès
        return true;
      }
    }
    
    // Pas de token ou token expiré, permettre l'accès
    return true;
  }
}