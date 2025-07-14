import { Injectable } from '@angular/core';
import { environment } from '../../../../../../environment/environment';
import { HttpClient } from '@angular/common/http';
import { FirmaDigitalEncontradaResponse, FirmaDigitalResponse } from '../../../../domain/dto/FirmaDigitalResponse.dto';
import { FirmaDigitalRequest } from '../../../../domain/dto/FirmaDigitalRequest.dto';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FirmaDigitalService {

  api_uri_firma=`${environment.urlApi}/firma`;
  
  constructor( private http: HttpClient) { }

  FirmarDocumento(cuerpo_firma:FirmaDigitalRequest):Observable<FirmaDigitalResponse> {
    return this.http.post<FirmaDigitalResponse>(this.api_uri_firma,cuerpo_firma)
  }

  EncontrarFirmaDigital(username:string):Observable<FirmaDigitalEncontradaResponse>{
    return this.http.post<FirmaDigitalEncontradaResponse>(`${this.api_uri_firma}/buscar`,{username})
  }
}
