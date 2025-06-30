import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../../../environment/environment';
import { HttpClient } from '@angular/common/http';
import { EstadoRequest } from '../../../../domain/dto/EstadoRequest.dto';
import { CrearEstadoResponse, EliminarEstadoResponse, ModificarEstadoResponse } from '../../../../domain/dto/EstadoResponse.dto';

@Injectable({
  providedIn: 'root'
})
export class EstadoService {

  constructor(private http: HttpClient) { }

  api_uri_estado=`${environment.urlApi}/estado_expediente`;


  CrearEstado(cuerpo_estado:EstadoRequest):Observable<CrearEstadoResponse>{
    return this.http.post<CrearEstadoResponse>(`${this.api_uri_estado}`,cuerpo_estado)
  }

  RecepcionarPreparacion(id_expediente:number, app_user:string):Observable<ModificarEstadoResponse>{
    return this.http.put<ModificarEstadoResponse>(`${this.api_uri_estado}/aceptar/preparacion/${id_expediente}`, {app_user})
  }
  TrabajadoPreparacion(id_expediente:number, app_user:string):Observable<ModificarEstadoResponse>{
    return this.http.put<ModificarEstadoResponse>(`${this.api_uri_estado}/aprobar/preparacion/${id_expediente}`, {app_user})
  }

  RecepcionarDigitalizacion(id_expediente:number, app_user:string):Observable<ModificarEstadoResponse>{
    return this.http.put<ModificarEstadoResponse>(`${this.api_uri_estado}/aceptar/digitalizacion/${id_expediente}`, {app_user})
  }
  TrabajadoDigitalizacion(id_expediente:number, app_user:string):Observable<ModificarEstadoResponse>{
    return this.http.put<ModificarEstadoResponse>(`${this.api_uri_estado}/aprobar/digitalizacion/${id_expediente}`, {app_user})
  }

  RecepcionarIndizacion(id_expediente:number, app_user:string):Observable<ModificarEstadoResponse>{
    return this.http.put<ModificarEstadoResponse>(`${this.api_uri_estado}/aceptar/indizacion/${id_expediente}`, {app_user})
  }
  TrabajadoIndizacion(id_expediente:number, app_user:string):Observable<ModificarEstadoResponse>{
    return this.http.put<ModificarEstadoResponse>(`${this.api_uri_estado}/aprobar/indizacion/${id_expediente}`, {app_user})
  }



  EliminarEstado(id:number):Observable<EliminarEstadoResponse>{
    return this.http.delete<EliminarEstadoResponse>(`${this.api_uri_estado}/${id}`)
  }
}
