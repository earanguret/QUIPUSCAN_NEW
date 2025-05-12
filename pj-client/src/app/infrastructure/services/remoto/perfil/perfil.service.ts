import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../../../environment/environment';
import { PerfilModel } from '../../../../domain/models/Perfil.model';
import { Observable } from 'rxjs';
import { CrearPerfilMessageResponse, ModificarPerfilMessageResponse, PerfilResponse } from '../../../../domain/dto/PerfilResponse.dto';

@Injectable({
  providedIn: 'root'
})
export class PerfilService {

  api_uri_perfil=`${environment.urlApi}/perfil`;
  constructor(private http: HttpClient) { }

  listarPerfiles():Observable<PerfilResponse[]>{
    return this.http.get<PerfilResponse[]>(this.api_uri_perfil)
  }

  obtenerPerfilesDetalleById(id_perfil:number):Observable<PerfilResponse>{
    return this.http.get<PerfilResponse>(this.api_uri_perfil+`/${id_perfil}`)
  }

  CrearPerfil(cuerpo_perfil:PerfilModel):Observable<CrearPerfilMessageResponse>{
    return this.http.post<CrearPerfilMessageResponse>(this.api_uri_perfil,cuerpo_perfil)
  }

  ModificarPerfil(id_perfil:number,cuerpo_perfil:PerfilModel):Observable<ModificarPerfilMessageResponse>{
    return this.http.put<ModificarPerfilMessageResponse>(this.api_uri_perfil+`/${id_perfil}`,cuerpo_perfil)
  }
}
