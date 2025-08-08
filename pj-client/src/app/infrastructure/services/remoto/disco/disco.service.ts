import { Injectable } from '@angular/core';
import { environment } from '../../../../../../environment/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { DiscoRequest } from '../../../../domain/dto/DiscoRequest.dto';
import { DiscoCrearResponse, DiscoListaResponse, ModificarDiscoResponse } from '../../../../domain/dto/DiscoResponse.dto';

@Injectable({
  providedIn: 'root'
})
export class DiscoService {

  constructor(private http: HttpClient) { }

  api_uri_disco=`${environment.urlApi}/disco`;

  //this.router.get('/api/disco/lista/:id_inventario', discoController.listarDiscosByInventario.bind(discoController));


  ListarDiscosByInventario(id_inventario:number):Observable<DiscoListaResponse[]>{
    return this.http.get<DiscoListaResponse[]>(`${this.api_uri_disco}/lista/${id_inventario}`)
  }

  CrearDisco(cuerpo_disco:DiscoRequest):Observable<DiscoCrearResponse>{
    return this.http.post<DiscoCrearResponse>(`${this.api_uri_disco}/create`,cuerpo_disco)
  }

  AgregarDataDiscoActaApertura(id_disco:number,data_disco: DiscoRequest):Observable<ModificarDiscoResponse>{
    return this.http.post<ModificarDiscoResponse>(`${this.api_uri_disco}/agregar/acta-apertura/${id_disco}`,data_disco)
  }

  AgregarDataDiscoActaCierre(id_disco:number,data_disco: DiscoRequest):Observable<ModificarDiscoResponse>{
    return this.http.post<ModificarDiscoResponse>(`${this.api_uri_disco}/agregar/acta-cierre/${id_disco}`,data_disco)
  }

  AgregarDataDiscoTarjetaApertura(id_disco:number,data_disco: DiscoRequest):Observable<ModificarDiscoResponse>{
    return this.http.post<ModificarDiscoResponse>(`${this.api_uri_disco}/agregar/tarjeta-apertura/${id_disco}`,data_disco)
  }

  AgregarDataDiscoTarjetaCierre(id_disco:number,data_disco: DiscoRequest):Observable<ModificarDiscoResponse>{
    return this.http.post<ModificarDiscoResponse>(`${this.api_uri_disco}/agregar/tarjeta-cierre/${id_disco}`,data_disco)
  }

  CerrarDisco(id_disco:number,data_disco: DiscoRequest):Observable<ModificarDiscoResponse>{
    return this.http.post<ModificarDiscoResponse>(`${this.api_uri_disco}/cerrar/${id_disco}`,data_disco)
  }

  GenerarDiscoMicroformas(id_disco: number, app_user: string): Observable<Blob> {
    return this.http.get(`${this.api_uri_disco}/descargar-zip/${id_disco}/${app_user}`, {
      responseType: 'blob'
    }) as Observable<Blob>;
  }

}
