import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../../../environment/environment';
import { CrearUsuarioResponse, ModificarDatosUsuarioResponse, UsuarioResponse } from '../../../../domain/dto/UsuarioResponse.dto';
import { UsuarioModel } from '../../../../domain/models/Usuario.model';
import { UsuarioRequest } from '../../../../domain/dto/UsuarioRequest.dto';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  api_uri_usuario=`${environment.urlApi}/usuario`;
  constructor(private http: HttpClient) { }

  ListarUsuarios():Observable<UsuarioResponse[]>{
    return this.http.get<UsuarioResponse[]>(`${this.api_uri_usuario}/lista/detalle`)
  }

  ObtenerUsuario(id_usuario:number):Observable<UsuarioModel>{
    return this.http.get<UsuarioModel>(`${this.api_uri_usuario}/${id_usuario}`)
  }

  CrearUsuario(cuerpo_usuario:UsuarioRequest):Observable<CrearUsuarioResponse>{
    cuerpo_usuario.username=cuerpo_usuario.username.trim().toUpperCase()  
    return this.http.post<CrearUsuarioResponse>(`${this.api_uri_usuario}/crear`,cuerpo_usuario)
  }   

  ModificarDatosUsuario(id_usuario:number,cuerpo_usuario:UsuarioRequest):Observable<ModificarDatosUsuarioResponse>{
    cuerpo_usuario.username=cuerpo_usuario.username.trim().toUpperCase()
    return this.http.put<ModificarDatosUsuarioResponse>(`${this.api_uri_usuario}/modificar/${id_usuario}`,cuerpo_usuario)
  }

  ModificarPasswordUsuario(id_usuario:number,password:string,app_user:string):Observable<ModificarDatosUsuarioResponse>{
    return this.http.put<ModificarDatosUsuarioResponse>(`${this.api_uri_usuario}/modificar/password/${id_usuario}`,{password,app_user})
  } 
}
