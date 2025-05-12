import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../../../environment/environment';
import { CrearUsuarioResponse, ModificarDatosUsuarioResponse, UsuarioResponse } from '../../../../domain/dto/UsuarioResponse.dto';
import { UsuarioModel } from '../../../../domain/models/Usuario.model';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  api_uri_usuario=`${environment.urlApi}/usuario`;
  constructor(private http: HttpClient) { }

  listarUsuarios():Observable<UsuarioResponse[]>{
    return this.http.get<UsuarioResponse[]>(this.api_uri_usuario)
  }

  obtenerUsuariosDetalleById(id_usuario:number):Observable<UsuarioResponse>{
    return this.http.get<UsuarioResponse>(this.api_uri_usuario+`/${id_usuario}`)
  }

  CrearUsuario(cuerpo_usuario:UsuarioModel):Observable<CrearUsuarioResponse>{
    return this.http.post<CrearUsuarioResponse>(this.api_uri_usuario,cuerpo_usuario)
  }   

  ModificarDatosUsuario(id_usuario:number,cuerpo_usuario:UsuarioModel):Observable<ModificarDatosUsuarioResponse>{
    return this.http.put<ModificarDatosUsuarioResponse>(this.api_uri_usuario+`/${id_usuario}`,cuerpo_usuario)
  }

  ModificarPasswordUsuario(id_usuario:number,password:string):Observable<ModificarDatosUsuarioResponse>{
    return this.http.put<ModificarDatosUsuarioResponse>(this.api_uri_usuario+`/${id_usuario}/password`,{password})
  } 
}
