import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../../../environment/environment';
import { HttpClient } from '@angular/common/http';
import { ControlRequest } from '../../../../domain/dto/ControlRequest.dto';
import { ControlDataResponse, ControlResponseDataView, CrearControlResponse, ModificarControlResponse } from '../../../../domain/dto/ControlResponse.dto';

@Injectable({
  providedIn: 'root'
})
export class ControlService {

  constructor(private http: HttpClient) { }

  api_uri_control=`${environment.urlApi}/control`;

  CrearControl(cuerpo_control:ControlRequest):Observable<CrearControlResponse>{
    return this.http.post<CrearControlResponse>(`${this.api_uri_control}`,cuerpo_control)
  }

  ModificarControl(id_expediente:number,cuerpo_control:ControlRequest):Observable<ModificarControlResponse>{
    return this.http.put<ModificarControlResponse>(`${this.api_uri_control}/${id_expediente}`,cuerpo_control)
  }

  ObtenerDatosControl(id_expediente:number):Observable<ControlDataResponse>{
    return this.http.get<ControlDataResponse>(`${this.api_uri_control}/${id_expediente}`)
  }

  ObtenerControlDataViewXidExpediente(id_expediente:number):Observable<ControlResponseDataView>{
    return this.http.get<ControlResponseDataView>(`${this.api_uri_control}/dataview/${id_expediente}`)
  }
  


}
