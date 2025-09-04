import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { LoginService } from '../infrastructure/services/remoto/login/login.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private loginService: LoginService, private router: Router) {}
  async canActivate(): Promise<boolean> {
    
    try {

      // Llamada al servicio de autenticación 
      const authResponse = this.loginService.isAuthenticatedUser();      
      
      if (authResponse) {
      console.log() 
      return true; // Permite el acceso a la ruta protegida
      } else {
        this.router.navigate(['/login']); // Redirige al inicio de sesión en caso de fallo de autenticación
        return false; // Denegar acceso
      }
     
    } catch (error) {
      console.error('Error en la autenticación:', error);
      this.router.navigate(['/login']); // Manejar errores de autenticación
      return false; // Denegar acceso
    }
  }
  
}