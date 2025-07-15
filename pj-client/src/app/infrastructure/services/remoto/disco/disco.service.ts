import { Injectable } from '@angular/core';
import { environment } from '../../../../../../environment/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { DiscoRequest } from '../../../../domain/dto/DiscoRequest.dto';
import { DiscoCrearResponse } from '../../../../domain/dto/DiscoResponse.dto';

@Injectable({
  providedIn: 'root'
})
export class DiscoService {

  constructor(private http: HttpClient) { }

  api_uri_disco=`${environment.urlApi}/disco`;

  ListarDiscosByInventario():Observable<any>{
    return this.http.get<any>(`${this.api_uri_disco}/lista`)
  }

  CrearDisco(cuerpo_disco:DiscoRequest):Observable<DiscoCrearResponse>{
    return this.http.post<DiscoCrearResponse>(`${this.api_uri_disco}/create`,cuerpo_disco)
  }

  // AgregarDireccionFTPActaApertura(id_disco:number,direccion:string):Observable<any>{
  //   return this.http.post<any>(`${this.api_uri_disco}/agregar/acta-apertura/${id_disco}`,{direccion})
  // }

  // AgregarDireccionFTPActaCierre(id_disco:number,direccion:string):Observable<any>{
  //   return this.http.post<any>(`${this.api_uri_disco}/agregar/acta-cierre/${id_disco}`,{direccion})
  // }

  // AgregarDireccionFTPTarjetaApertura(id_disco:number,direccion:string):Observable<any>{
  //   return this.http.post<any>(`${this.api_uri_disco}/agregar/tarjeta-apertura/${id_disco}`,{direccion})
  // }

  // AgregarDireccionFTPTarjetaCierre(id_disco:number,direccion:string):Observable<any>{
  //   return this.http.post<any>(`${this.api_uri_disco}/agregar/tarjeta-cierre/${id_disco}`,{direccion})
  // }
}
