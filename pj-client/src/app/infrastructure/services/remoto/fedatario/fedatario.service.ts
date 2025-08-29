import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../../../environment/environment';
import { Observable } from 'rxjs';
import { FedatarioRequest } from '../../../../domain/dto/FedatarioRequest.dto';
import { CrearFedatarioResponse, FedatarioResponseDataView } from '../../../../domain/dto/FedatarioResponse.dto';

@Injectable({
  providedIn: 'root'
})
export class FedatarioService {
  api_uri_fedatario=`${environment.urlApi}/fedatario`;

  constructor(private http: HttpClient) { }

  crearFedatario(fedatario: FedatarioRequest):Observable<CrearFedatarioResponse>{
    return this.http.post<CrearFedatarioResponse>(`${this.api_uri_fedatario}`,fedatario);
  }

  ObtenerFedatarioDataViewXidExpediente(id_expediente:number):Observable<FedatarioResponseDataView>{
    return this.http.get<FedatarioResponseDataView>(`${this.api_uri_fedatario}/dataview/${id_expediente}`)
  }

}
