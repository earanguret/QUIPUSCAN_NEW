import { Injectable } from '@angular/core';
import { UsuarioSupervisorLineaResponse } from '../../../domain/dto/UsuarioResponse.dto';

@Injectable({
  providedIn: 'root'
})
export class SupervisorLineaService {

  private supervisor_linea: UsuarioSupervisorLineaResponse = {
    id_usuario: 0,
    username: '',
    perfil: '',
    estado: false,
    nombre: '',
    ap_paterno: '',
    ap_materno:  ''
  };
  
  constructor() { }

  get supervisor(): UsuarioSupervisorLineaResponse {
    return this.supervisor_linea;
  }

  set supervisor(value: UsuarioSupervisorLineaResponse) {
    this.supervisor_linea = value;
  }

  clear(): void {
    this.supervisor_linea = {
      id_usuario: 0,
      username: '',
      perfil: '',
      estado: false,
      nombre: '',
      ap_paterno: '',
      ap_materno:  ''
    };
  }

  
}
