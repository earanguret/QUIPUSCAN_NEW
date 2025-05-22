import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../../../environment/environment';
import { HttpClient } from '@angular/common/http';
import { InventarioCrearResponse, InventarioDetalleResponse, InventarioModificarResponse } from '../../../../domain/dto/InventarioResponse.dto';
import { InventarioRequest } from '../../../../domain/dto/InventarioRequest.dto';


@Injectable({
  providedIn: 'root'
})
export class InventarioService {

  api_uri_inventario=`${environment.urlApi}/inventario`;
  constructor(private http: HttpClient) { }

  ListarInventarios():Observable<InventarioDetalleResponse[]>{
    return this.http.get<InventarioDetalleResponse[]>(this.api_uri_inventario)
  }

  ObtenerInventarioDetalle(id_inventario:number):Observable<InventarioDetalleResponse>{
    return this.http.get<InventarioDetalleResponse>(this.api_uri_inventario+`/${id_inventario}`)
  }

  CrearInventario(cuerpo_inventario:InventarioRequest):Observable<InventarioCrearResponse>{
    cuerpo_inventario.serie_doc=cuerpo_inventario.serie_doc.trim().toUpperCase()
    cuerpo_inventario.codigo=cuerpo_inventario.codigo.trim().toUpperCase()
    return this.http.post<InventarioCrearResponse>(this.api_uri_inventario,cuerpo_inventario)
  }

  ModificarInventario(id_inventario:number,cuerpo_inventario:InventarioRequest):Observable<InventarioModificarResponse>{
    cuerpo_inventario.serie_doc=cuerpo_inventario.serie_doc.trim().toUpperCase()
    cuerpo_inventario.codigo=cuerpo_inventario.codigo.trim().toUpperCase()
    return this.http.put<InventarioModificarResponse>(`${this.api_uri_inventario}/${id_inventario}`,cuerpo_inventario)
  }

}
