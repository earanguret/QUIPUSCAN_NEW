import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../../../environment/environment';
import { HttpClient } from '@angular/common/http';
import { IndizacionRequest } from '../../../../domain/dto/IndizacionRequest.dto';
import { CrearIndizacionResponse, IndizacionDataResponse, IndizacionResponseDataView, ModificarIndizacionResponse } from '../../../../domain/dto/IndizacionResponse.dto';

@Injectable({
  providedIn: 'root'
})
export class IndizacionService {

  api_uri_indizacion=`${environment.urlApi}/indizacion`;


  constructor(private http: HttpClient) { }

  ListarIndizacion(id_expediente:number):Observable<any>{
    return this.http.get<any>(this.api_uri_indizacion+`/search/${id_expediente}`)
  }

  ObtenerIndizacionDataViewXidExpediente(id_expediente:number):Observable<IndizacionResponseDataView>{
    return this.http.get<IndizacionResponseDataView>(this.api_uri_indizacion+`/dataview/${id_expediente}`)
  }

  ObtenerIndizacionById_expediente(id_expediente:number):Observable<IndizacionDataResponse>{
    return this.http.get<IndizacionDataResponse>(this.api_uri_indizacion+`/search/${id_expediente}`)
  }

  CrearIndizacion(cuerpo_indizacion:IndizacionRequest):Observable<CrearIndizacionResponse>{
    return this.http.post<CrearIndizacionResponse>(this.api_uri_indizacion+`/create`,cuerpo_indizacion)
  }

  ModificarIndizacion(id_expediente:number,cuerpo_indizacion:IndizacionRequest):Observable<ModificarIndizacionResponse>{
    return this.http.put<ModificarIndizacionResponse>(this.api_uri_indizacion+`/update/${id_expediente}`,cuerpo_indizacion)
  }
}
