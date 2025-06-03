import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../../../environment/environment';
import { HttpClient } from '@angular/common/http';
import { CrearFlujogramaResponse, EliminarFlujogramaResponse } from '../../../../domain/dto/FlujogramaResponse.dto';
import { FlujogramaRequest } from '../../../../domain/dto/FlujogramaRequest.dto';

@Injectable({
  providedIn: 'root'
})
export class FlujogramaService {

  constructor(private http: HttpClient) { }

  api_uri_flujograma=`${environment.urlApi}/flujograma`;

  ListarFlujogramaByIdExpediente(id_expediente:number):Observable<any>{
    return this.http.get<any>(`${this.api_uri_flujograma}/lista/${id_expediente}`)
  }

  CrearFlujograma(cuerpo_flujograma:FlujogramaRequest):Observable<CrearFlujogramaResponse>{
    return this.http.post<CrearFlujogramaResponse>(`${this.api_uri_flujograma}`,cuerpo_flujograma)
  }

  EliminarFlujograma(id_expediente:number):Observable<EliminarFlujogramaResponse>{
    return this.http.delete<EliminarFlujogramaResponse>(`${this.api_uri_flujograma}/${id_expediente}`)
  }


}
