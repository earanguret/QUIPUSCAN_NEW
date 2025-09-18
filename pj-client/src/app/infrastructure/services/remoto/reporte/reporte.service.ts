import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../../../environment/environment';
import { HttpClient } from '@angular/common/http';
import { datos_estaticos, datos_usuarios, estado_produccion_total, produccion_mensual, produccion_serie_documental_reporte, produccion_usuario, produccion_usuario_dias, serie_documental_reporte } from '../../../../domain/dto/ReporteResponse.dto';


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

  ObtenerProduccionMensual():Observable<produccion_mensual[]>{
    return this.http.get<produccion_mensual[]>(`${this.api_uri_reporte}/produccion_mensual`)
  }

  ObtenerUsuariosReporte():Observable<datos_usuarios[]>{
    return this.http.get<datos_usuarios[]>(`${this.api_uri_reporte}/usuarios`)
  }

  ObtenerSerieDocumentalReporte():Observable<serie_documental_reporte[]>{
    return this.http.get<serie_documental_reporte[]>(`${this.api_uri_reporte}/serie_documental`)
  }

  ObtenerProduccionSerieDocumental():Observable<produccion_serie_documental_reporte[]>{
    return this.http.get<produccion_serie_documental_reporte[]>(`${this.api_uri_reporte}/produccion_serie_documental`)
  }

  ObtenerProduccionUsuario():Observable<produccion_usuario[]>{
    return this.http.get<produccion_usuario[]>(`${this.api_uri_reporte}/produccion_usuario`)
  }

  ObtenerProduccionUsuarioDias(perfil: string, usuario: string):Observable<produccion_usuario_dias[]>{
    return this.http.post<produccion_usuario_dias[]>(`${this.api_uri_reporte}/produccion_usuario_ultimos_dias`, {perfil, usuario})
  }
}
