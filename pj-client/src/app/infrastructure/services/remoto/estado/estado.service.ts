import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../../../environment/environment';
import { HttpClient } from '@angular/common/http';
import { EstadoAsociarExpedientesADiscoRequest, EstadoRequest } from '../../../../domain/dto/EstadoRequest.dto';
import { AsociarExpedientesADiscoResponse, CrearEstadoResponse, EliminarEstadoResponse, ModificarEstadoResponse } from '../../../../domain/dto/EstadoResponse.dto';

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

  RecepcionarControl(id_expediente:number, app_user:string):Observable<ModificarEstadoResponse>{
    return this.http.put<ModificarEstadoResponse>(`${this.api_uri_estado}/aceptar/control/${id_expediente}`, {app_user})
  }
  TrabajadoControl(id_expediente:number, app_user:string):Observable<ModificarEstadoResponse>{
    return this.http.put<ModificarEstadoResponse>(`${this.api_uri_estado}/aprobar/control/${id_expediente}`, {app_user})
  }

  RecepcionarFedado(id_expediente:number, app_user:string):Observable<ModificarEstadoResponse>{
    return this.http.put<ModificarEstadoResponse>(`${this.api_uri_estado}/aceptar/fedatario/${id_expediente}`, {app_user})
  }
  TrabajadoFedado(id_expediente:number, app_user:string):Observable<ModificarEstadoResponse>{
    return this.http.put<ModificarEstadoResponse>(`${this.api_uri_estado}/aprobar/fedatario/${id_expediente}`, {app_user})
  }

  EliminarEstado(id:number):Observable<EliminarEstadoResponse>{
    return this.http.delete<EliminarEstadoResponse>(`${this.api_uri_estado}/${id}`)
  }

  AsociarExpedientesADisco(cuerpo:EstadoAsociarExpedientesADiscoRequest):Observable<AsociarExpedientesADiscoResponse>{
    return this.http.put<AsociarExpedientesADiscoResponse>(`${this.api_uri_estado}/asociar/disco/`,cuerpo )
  }

  RechazarControlDigitalizacion(id_expediente:number, app_user:string):Observable<ModificarEstadoResponse>{
    return this.http.put<ModificarEstadoResponse>(`${this.api_uri_estado}/rechazar/controlDigitalizacion/${id_expediente}`, {app_user})
  }

  RechazarControlIndizacion(id_expediente:number, app_user:string):Observable<ModificarEstadoResponse>{
    return this.http.put<ModificarEstadoResponse>(`${this.api_uri_estado}/rechazar/controlIndizacion/${id_expediente}`, {app_user})
  }

  RechazarFedatarioDigitalizacion(id_expediente:number, app_user:string):Observable<ModificarEstadoResponse>{
    return this.http.put<ModificarEstadoResponse>(`${this.api_uri_estado}/rechazar/fedatarioDigitalizacion/${id_expediente}`, {app_user})
  }

  RechazarFedatarioIndizacion(id_expediente:number, app_user:string):Observable<ModificarEstadoResponse>{
    return this.http.put<ModificarEstadoResponse>(`${this.api_uri_estado}/rechazar/fedatarioIndizacion/${id_expediente}`, {app_user})
  }
}
