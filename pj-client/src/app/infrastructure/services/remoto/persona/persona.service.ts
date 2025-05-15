import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../../../environment/environment';
import { PersonaModel } from '../../../../domain/models/Persona.model';
import { CrearPersonaMessageResponse, ModificarPersonaMessageResponse, PersonaResponse } from '../../../../domain/dto/PersonaResponse.dto';


@Injectable({
  providedIn: 'root'
})
export class PersonaService {

  constructor(private http: HttpClient) { }

  api_uri_persona=`${environment.urlApi}/persona`;

  listarPersonas():Observable<PersonaResponse[]>{
    return this.http.get<PersonaResponse[]>(this.api_uri_persona)
  }

  ObtenerPersona(id_persona:number):Observable<PersonaModel>{
    return this.http.get<PersonaModel>(this.api_uri_persona+`/${id_persona}`)
  }

  ObtenerDatosPersonaByDNI(dni:string):Observable<PersonaResponse>{
    return this.http.get<PersonaResponse>(this.api_uri_persona+`/dni/${dni}`)
  }

  CrearPersona(cuerpo_persona:PersonaModel):Observable<CrearPersonaMessageResponse>{
    cuerpo_persona.nombre=cuerpo_persona.nombre.trim().toUpperCase()
    cuerpo_persona.ap_paterno=cuerpo_persona.ap_paterno.trim().toUpperCase()
    cuerpo_persona.ap_materno=cuerpo_persona.ap_materno.trim().toUpperCase()

    return this.http.post<CrearPersonaMessageResponse>(this.api_uri_persona,cuerpo_persona)
  }

  ModificarPersona(id_persona:number,cuerpo_persona:any):Observable<ModificarPersonaMessageResponse>{
    cuerpo_persona.nombre=cuerpo_persona.nombre.trim().toUpperCase()
    cuerpo_persona.ap_paterno=cuerpo_persona.ap_paterno.trim().toUpperCase()
    cuerpo_persona.ap_materno=cuerpo_persona.ap_materno.trim().toUpperCase()
    return this.http.put<ModificarPersonaMessageResponse>(this.api_uri_persona+`/${id_persona}`,cuerpo_persona)
  }

}
