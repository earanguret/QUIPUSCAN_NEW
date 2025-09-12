import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../../../environment/environment';
import { HttpClient } from '@angular/common/http';
import { datos_estaticos, estado_produccion_total } from '../../../../domain/dto/ReporteResponse.dto';


@Injectable({
  providedIn: 'root'
})
export class ReporteService {

  constructor(private http: HttpClient) { }

  api_uri_reporte=`${environment.urlApi}/reporte`;

  ObtenerDatosEstaticos():Observable<datos_estaticos>{
    return this.http.get<datos_estaticos>(`${this.api_uri_reporte}/datos_estaticos`)
  }

  ObtenerEstadoProductionTotal():Observable<estado_produccion_total>{
    return this.http.get<estado_produccion_total>(`${this.api_uri_reporte}/estado_produccion_total`)
  }

  
}
