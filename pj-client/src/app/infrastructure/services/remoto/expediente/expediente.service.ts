import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../../../environment/environment';
import { HttpClient } from '@angular/common/http';
import { CrearExpedienteResponse, EliminarExpedienteResponse, ExpedienteResponse, ExpedienteResponseDataView, ModificarExpedienteResponse } from '../../../../domain/dto/ExpedienteResponse.dto';
import { ExpedienteModel } from '../../../../domain/models/expediente.model';
import { ExpedienteRequest } from '../../../../domain/dto/ExpedienteRequest.dto';


@Injectable({
  providedIn: 'root'
})
export class ExpedienteService {

  //  this.router.get('/api/expediente/:id',expedienteController.ObtenerExpedienteDetalleXid)

  api_uri_expediente=`${environment.urlApi}/expediente`;
  constructor(private http: HttpClient) { }

  ListarExpedientes():Observable<ExpedienteResponse[]>{
    return this.http.get<ExpedienteResponse[]>(this.api_uri_expediente)
  }
  ListarExpedientesXidInventario(id_inventario:number):Observable<ExpedienteResponse[]>{
    return this.http.get<ExpedienteResponse[]>(`${this.api_uri_expediente}/lista/${id_inventario}`)
  }

  ObtenerExpedienteDataViewXid(id:number):Observable<ExpedienteResponseDataView>{
    return this.http.get<ExpedienteResponseDataView>(`${this.api_uri_expediente}/dataview/${id}`)
  }

  CrearExpediente(cuerpo_expediente:ExpedienteRequest):Observable<CrearExpedienteResponse>{
    cuerpo_expediente.nro_expediente=cuerpo_expediente.nro_expediente.trim().toUpperCase()
    return this.http.post<CrearExpedienteResponse>(this.api_uri_expediente,cuerpo_expediente)
  }

  EliminarExpediente(id:number):Observable<EliminarExpedienteResponse>{
    return this.http.delete<EliminarExpedienteResponse>(`${this.api_uri_expediente}/${id}`)
  }

  ModificarExpediente(id:number,cuerpo_expediente:ExpedienteRequest):Observable<ModificarExpedienteResponse>{
    cuerpo_expediente.nro_expediente=cuerpo_expediente.nro_expediente.trim().toUpperCase()
    return this.http.put<ModificarExpedienteResponse>(`${this.api_uri_expediente}/${id}`,cuerpo_expediente)
  }


}
