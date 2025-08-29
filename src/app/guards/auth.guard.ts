import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthenticationService } from '../services/authentication.service';
import { jwtDecode } from 'jwt-decode';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(
    private authService: AuthenticationService, 
    private router: Router
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {
    const token = this.authService.getAccessToken();
    
    if (!token) {
      // Pas de token, redirection vers la page de connexion
      this.router.navigate(['/signup'], {
        queryParams: { returnUrl: state.url }
      });
      return false;
    }

    try {
      const decoded: any = jwtDecode(token);
      
      // Vérifier si le token n'est pas expiré
      if (decoded.exp * 1000 > Date.now()) {
        return true;
      } else {
        // Token expiré
        this.authService.logout();
        this.router.navigate(['/signup'], {
          queryParams: { 
            returnUrl: state.url,
            message: 'Session expirée, veuillez vous reconnecter'
          }
        });
        return false;
      }
    } catch (error) {
      // Erreur de décodage du token
      console.error('Erreur de décodage du token:', error);
      this.authService.logout();
      this.router.navigate(['/signup'], {
        queryParams: { 
          returnUrl: state.url,
          message: 'Token invalide, veuillez vous reconnecter'
        }
      });
      return false;
    }
  }
}