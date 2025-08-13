import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../../../environment/environment';
import { DigitalizacionRequest } from '../../../../domain/dto/DigitalizacionRequest.dto';
import { CrearDigitalizacionResponse, DigitalizacionDataResponse, DigitalizacionResponseDataView, DigitalizacionTotalImagenesResponse, ModificarDigitalizacionResponse } from '../../../../domain/dto/DigitalizacionResponse.dto';

@Injectable({
  providedIn: 'root'
})
export class DigitalizacionService {

  constructor(private http: HttpClient) { }

  api_uri_digitalizacion=`${environment.urlApi}/digitalizacion`;
//         this.router.put('/api/digitalizacion/:id_expediente',digitalizacionController.modificarDigitalizacion)

// this.router.get('/api/digitalizacion/total_imagenes/fedatario/:id_inventario',digitalizacionController.obtenerTotalImagenesEnFedatario)

  CrearDigitalizacion(cuerpo_digitalizacion:DigitalizacionRequest):Observable<CrearDigitalizacionResponse>{
    return this.http.post<CrearDigitalizacionResponse>(`${this.api_uri_digitalizacion}`,cuerpo_digitalizacion)
  }

  ObtenerDigitalizacion(id_expediente:number):Observable<DigitalizacionDataResponse>{
    return this.http.get<DigitalizacionDataResponse>(`${this.api_uri_digitalizacion}/${id_expediente}`)
  }

  ObtenerDigitalizacionDataViewXidExpediente(id_expediente:number):Observable<DigitalizacionResponseDataView>{
      return this.http.get<DigitalizacionResponseDataView>(`${this.api_uri_digitalizacion}/dataview/${id_expediente}`)
    }

  ModificarDatosDigitalizacion(id_expediente:number, cuerpo_digitalizacion:DigitalizacionRequest):Observable<ModificarDigitalizacionResponse>{
    return this.http.put<ModificarDigitalizacionResponse>(`${this.api_uri_digitalizacion}/${id_expediente}`, cuerpo_digitalizacion)
  }

  ObtenerTotalImagenesEnFedatario(id_inventario:number):Observable<DigitalizacionTotalImagenesResponse>{
    return this.http.get<DigitalizacionTotalImagenesResponse>(`${this.api_uri_digitalizacion}/total_imagenes/fedatario/${id_inventario}`)
  }

}
