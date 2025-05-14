import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../../../environment/environment';
import { CredencialesService } from '../../local/credenciales.service';
import { LoginRequest } from '../../../../domain/dto/LoginRequest.dto';
import { catchError, map, Observable, throwError } from 'rxjs';
import { LoginValidator } from '../../../validator/fromValidator/login.validator';
import { UsuarioLoginResponse } from '../../../../domain/dto/LoginResponse.dto';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  private isAuthenticated = false;
  private mensaje='';

  api_url_login = `${environment.urlApi}/usuario/login`;

  constructor(private http: HttpClient, private credencialesService: CredencialesService) { }

  login(credenciales: LoginRequest): Observable<boolean> {
    const erroresValidacion = LoginValidator(credenciales);
    if (erroresValidacion.length > 0) {
      let errorMensaje = '';
      erroresValidacion.forEach((error:any) => {
        errorMensaje += `Error en el campo :"${error.campo}": ${error.mensaje}`;
      });
      return throwError(() => errorMensaje);
    }
    credenciales.username = credenciales.username.toUpperCase();
    return this.http.post<UsuarioLoginResponse>(this.api_url_login, credenciales).pipe(
      map((response: UsuarioLoginResponse) => {
        if (response.success) {
          this.credencialesService.credenciales = {
            id_usuario: response.id_usuario,
            id_persona: response.id_persona,
            username: response.username,
            perfil: response.perfil,
          };
          
          console.log(this.credencialesService.credenciales);
          this.isAuthenticated = true;
          return true;
        }
        this.mensaje=response.mensaje
        return false;
        
      }),
      catchError((error) => {
        console.error('Error al iniciar sesión:', error);
        return throwError(() => new Error('No se pudo iniciar sesión'));
      })
    );
  }

  logout(): void {
    this.isAuthenticated = false;
    this.credencialesService.clear();
  }

  isAuthenticatedUser(): boolean {
    return this.isAuthenticated;
  }

  showMessage(){
    return this.mensaje;
  }

}
