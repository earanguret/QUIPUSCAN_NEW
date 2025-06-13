import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../../../environment/environment';
import { HttpClient } from '@angular/common/http';
import { CrearPreparacionResponse, ModificarPreparacionResponse, PreparacionResponse, PreparacionResponseDataView } from '../../../../domain/dto/PreparacionResponse.dto';
import { PreparacionRequest } from '../../../../domain/dto/PreparacionRequest.dto';

@Injectable({
  providedIn: 'root'
})
export class PreparacionService {

  constructor(private http: HttpClient) { }

  api_uri_preparacion=`${environment.urlApi}/preparacion`;

  ListarPreparacionByIdExpediente(id_expediente:number):Observable<any>{
    return this.http.get<any>(`${this.api_uri_preparacion}/lista/${id_expediente}`)
  }

  CrearPreparacion(cuerpo_preparacion:PreparacionRequest ):Observable<CrearPreparacionResponse>{
    return this.http.post<CrearPreparacionResponse>(`${this.api_uri_preparacion}`,cuerpo_preparacion)
  }

  ObtenerPreparacionXidExpediente(id_expediente:number):Observable<PreparacionResponse>{
    return this.http.get<PreparacionResponse>(`${this.api_uri_preparacion}/${id_expediente}`)
  }

  ObtenerPreparacionDataViewXidExpediente(id_expediente:number):Observable<PreparacionResponseDataView>{
    return this.http.get<PreparacionResponseDataView>(`${this.api_uri_preparacion}/dataview/${id_expediente}`)
  }

  ModificarPreparacion(id_expediente:number,cuerpo_preparacion:PreparacionRequest):Observable<ModificarPreparacionResponse>{
    return this.http.put<ModificarPreparacionResponse>(`${this.api_uri_preparacion}/${id_expediente}`,cuerpo_preparacion)
  }
}
