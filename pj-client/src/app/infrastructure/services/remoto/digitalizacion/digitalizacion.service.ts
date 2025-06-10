import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../../../../environment/environment';

@Injectable({
  providedIn: 'root'
})
export class DigitalizacionService {

  constructor(private http: HttpClient) { }

  api_uri_digitalizacion=`${environment.urlApi}/digitalizacion`;

  // CrearEstado(cuerpo_estado:EstadoRequest):Observable<CrearEstadoResponse>{
  //     return this.http.post<CrearEstadoResponse>(`${this.api_uri_estado}`,cuerpo_estado)
  //   }

  uploadPDF(file: File, folderPath: string): Observable<any> {
    
    const headers = new HttpHeaders({
      'file-name': file.name,
      'folder-path': folderPath
    });
  
    return this.http.post<any>(`${this.api_uri_digitalizacion}/upload`, file,  {
      headers,
      responseType: 'json',
    });
      
  }



}
