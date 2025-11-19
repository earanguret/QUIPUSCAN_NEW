import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../../../../../environment/environment';
import { Observable } from 'rxjs';
import { HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class SftpService {
  api_uri_sftp=`${environment.urlApi}/sftp`;

  constructor( private http: HttpClient) { }

  uploadFile(file: File, folderPath: string, fileName: string): Observable<any> {
    const headers = new HttpHeaders({
      'file-name': fileName,
      ...(folderPath ? { 'folder-path': folderPath } : {})
    });
  
    return this.http.post<any>(`${this.api_uri_sftp}/upload`, file, { headers });
  }

  downloadFile(fileName: string, folderPath: string): Observable<Blob> {
    const params = new HttpParams()
      .set('fileName', fileName)
      .set('folderPath', folderPath);
  
    return this.http.get(`${this.api_uri_sftp}/download`, {
      params,
      responseType: 'blob'
    });
  }
}
