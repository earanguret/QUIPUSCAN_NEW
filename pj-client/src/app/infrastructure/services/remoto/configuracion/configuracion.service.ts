import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../../../environment/environment';
import { HttpClient } from '@angular/common/http';
import { CrearEspecialidadResponse, CrearJuzgadoResponse, CrearMateriaResponse, CrearSedeResponse, CrearTipoDocumentoResponse, CrearTipoProcesoResponse, EliminarEspecialidadResponse, EliminarJuzgadoResponse, EliminarMateriaResponse, EliminarSedeResponse, EliminarTipoDocumentoResponse, EliminarTipoProcesoResponse, EspecialidadResponse, GeneralResponse, JuzgadoResponse, MateriaResponse, ModificarGeneralResponse, SedeResponse, TipoDocumentoResponse, TipoProcesoResponse } from '../../../../domain/dto/ConfiguracionResponse.dto';
import { EspecialidadRequest, GeneralRequest, JuzgadoRequest, MateriaRequest, SedeRequest, TipoDocumentoRequest, TipoProcesoRequest } from '../../../../domain/dto/ConfiguracionRequest.dto';

@Injectable({
  providedIn: 'root'
})
export class ConfiguracionService {

  constructor(private http: HttpClient) { }

  
  api_url_especialidad=`${environment.urlApi}/configuracion/especialidad`;
  api_url_sede=`${environment.urlApi}/configuracion/sede`;
  api_url_juzgado=`${environment.urlApi}/configuracion/juzgado`;
  api_url_materia=`${environment.urlApi}/configuracion/materia`;
  api_url_tipo_documento=`${environment.urlApi}/configuracion/tipo_documento`;
  api_url_tipo_proceso=`${environment.urlApi}/configuracion/tipo_proceso`;
  api_url_general=`${environment.urlApi}/configuracion/general`;

  // GENERAL
  ModificarGeneral(cuerpo_general:GeneralRequest, id_general: number):Observable<ModificarGeneralResponse>{
    cuerpo_general.institucion=cuerpo_general.institucion.trim().toUpperCase()
    cuerpo_general.direccion=cuerpo_general.direccion.trim().toUpperCase()
    return this.http.put<ModificarGeneralResponse>(`${this.api_url_general}/${id_general}`,cuerpo_general)
  }
  ObtenerDatosGeneral():Observable<GeneralResponse>{
    return this.http.get<GeneralResponse>(this.api_url_general)
  }

  // ESPECIALIDAD

  CrearEspecialidad(cuerpo_especialidad:EspecialidadRequest):Observable<CrearEspecialidadResponse>{
    cuerpo_especialidad.especialidad=cuerpo_especialidad.especialidad.trim().toUpperCase()
    return this.http.post<CrearEspecialidadResponse>(this.api_url_especialidad,cuerpo_especialidad)
  }

  ObtenerEspecialidadById(id_especialidad:number):Observable<EspecialidadResponse>{
    return this.http.get<EspecialidadResponse>(`${this.api_url_especialidad}/${id_especialidad}`)
  }

  ListarEspecialidad():Observable<EspecialidadResponse[]>{
    return this.http.get<EspecialidadResponse[]>(this.api_url_especialidad)
  }

  EliminarEspecialidad(id_especialidad:number, app_user:string):Observable<EliminarEspecialidadResponse>{
    return this.http.delete<EliminarEspecialidadResponse>(`${this.api_url_especialidad}/${id_especialidad}/${app_user}`)
  }

  // SEDE

  ListarSedes():Observable<SedeResponse[]>{
    return this.http.get<SedeResponse[]>(this.api_url_sede) 
  }

  CrearSede(cuerpo_sede:SedeRequest):Observable<CrearSedeResponse>{
    cuerpo_sede.sede=cuerpo_sede.sede.trim().toUpperCase()
    return this.http.post<CrearSedeResponse>(this.api_url_sede,cuerpo_sede)
  }

  EliminarSede(id_sede:number, app_user:string):Observable<EliminarSedeResponse>{
    return this.http.delete<EliminarSedeResponse>(`${this.api_url_sede}/${id_sede}/${app_user}`)
  }

  // TIPO DE DOCUMENTO
  ListarTipoDocumento():Observable<TipoDocumentoResponse[]>{
    return this.http.get<TipoDocumentoResponse[]>(this.api_url_tipo_documento)
  }

  CrearTipoDocumento(cuerpo_tipo_documento:TipoDocumentoRequest):Observable<CrearTipoDocumentoResponse>{
    cuerpo_tipo_documento.tipo_documento=cuerpo_tipo_documento.tipo_documento.trim().toUpperCase()
    return this.http.post<CrearTipoDocumentoResponse>(this.api_url_tipo_documento,cuerpo_tipo_documento)
  }

  EliminarTipoDocumento(id_tipo_documento:number, app_user:string):Observable<EliminarTipoDocumentoResponse>{
    return this.http.delete<EliminarTipoDocumentoResponse>(`${this.api_url_tipo_documento}/${id_tipo_documento}/${app_user}`)
  }

  // JUZGADO DE ORIGEN
  ListarJuzgado():Observable<JuzgadoResponse[]>{
    return this.http.get<JuzgadoResponse[]>(this.api_url_juzgado)
  }

  CrearJuzgado(cuerpo_juzgado:JuzgadoRequest):Observable<CrearJuzgadoResponse>{
    cuerpo_juzgado.juzgado=cuerpo_juzgado.juzgado.trim().toUpperCase()
    return this.http.post<CrearJuzgadoResponse>(this.api_url_juzgado,cuerpo_juzgado)
  }

  EliminarJuzgado(id_juzgado:number, app_user:string):Observable<EliminarJuzgadoResponse>{
    return this.http.delete<EliminarJuzgadoResponse>(`${this.api_url_juzgado}/${id_juzgado}/${app_user}`)
  }

  // MATERIA
  ListarMateria():Observable<MateriaResponse[]>{
    return this.http.get<MateriaResponse[]>(this.api_url_materia)
  }

  CrearMateria(cuerpo_materia:MateriaRequest):Observable<CrearMateriaResponse>{
    cuerpo_materia.materia=cuerpo_materia.materia.trim().toUpperCase()
    return this.http.post<CrearMateriaResponse>(this.api_url_materia,cuerpo_materia)
  }

  EliminarMateria(id_materia:number, app_user:string):Observable<EliminarMateriaResponse>{
    return this.http.delete<EliminarMateriaResponse>(`${this.api_url_materia}/${id_materia}/${app_user}`)
  } 

  // TIPO DE PROCESO
  ListarTipoProceso():Observable<TipoProcesoResponse[]>{
    return this.http.get<TipoProcesoResponse[]>(this.api_url_tipo_proceso)
  }

  CrearTipoProceso(cuerpo_tipo_proceso:TipoProcesoRequest):Observable<CrearTipoProcesoResponse>{
    cuerpo_tipo_proceso.tipo_proceso=cuerpo_tipo_proceso.tipo_proceso.trim().toUpperCase()
    return this.http.post<CrearTipoProcesoResponse>(this.api_url_tipo_proceso,cuerpo_tipo_proceso)
  }

  EliminarTipoProceso(id_tipo_proceso:number, app_user:string):Observable<EliminarTipoProcesoResponse>{
    return this.http.delete<EliminarTipoProcesoResponse>(`${this.api_url_tipo_proceso}/${id_tipo_proceso}/${app_user}`)
  } 

}
