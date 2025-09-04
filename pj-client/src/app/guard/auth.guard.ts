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

      // Llamada a tu servicio de autenticación personalizado que verifica en el servidor
      const authResponse = this.loginService.isAuthenticatedUser();      
      
      if (authResponse) {
      console.log() 
      return true; // Permitir acceso a la ruta protegida
      } else {
        this.router.navigate(['/login']); // Redirigir al inicio de sesión en caso de fallo de autenticación
        return false; // Denegar acceso
      }
     
    } catch (error) {
      console.error('Error en la autenticación:', error);
      this.router.navigate(['/login']); // Manejar errores de autenticación
      return false; // Denegar acceso
    }
  }
  
}