import { Injectable } from '@angular/core';
import { environment } from '../../../../../../environment/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FirmaAgenteServiceService {

  api_uri_firma=`${environment.urlApiAgenteFirma}`;

  constructor( private http: HttpClient) { }

  ConfirmarConexion():Observable<any>{
    return this.http.get<any>(`${this.api_uri_firma}/health`)
  }

  // ✅ 2. Guardar PDF en el agente local
  savePdf(file: File): Observable<any> {
    const formData = new FormData();
    formData.append('file', file, file.name);

    return this.http.post<any>(`${this.api_uri_firma}/pdf/save`, formData);
  }

  // ✅ 3. Solicitar firma (abre AppFirmaONPE)
  signPdf(fileName: string): Observable<any> {
    return this.http.post<any>(
      `${this.api_uri_firma}/pdf/sign`,
      fileName,
      {
        headers: new HttpHeaders({
          'Content-Type': 'text/plain'
        })
      }
    );
  }

  // ✅ 4. Descargar PDF firmado
  getSignedPdf(fileName: string): Observable<Blob> {
    return this.http.post(
      `${this.api_uri_firma}/pdf/signed`,
      fileName,
      {
        headers: new HttpHeaders({
          'Content-Type': 'text/plain'
        }),
        responseType: 'blob'
      }
    );
  }

  
}
