import { Injectable } from '@angular/core';
import { UsuarioModel } from '../../../domain/models/Usuario.model';

@Injectable({
  providedIn: 'root'
})
export class CredencialesService {

  private usuario: UsuarioModel = {
    id_usuario: 1,
    id_persona: 1,
    usuario: '',
    id_perfil: 0,
  };
  
  constructor() { }

  get credenciales(): UsuarioModel {
    return this.usuario;
  }

  set credenciales(value: UsuarioModel) {
    this.usuario = value;
  }

  clear(): void {
    this.usuario = {
      id_usuario: 0,
      id_persona: 0,
      usuario: '',
      id_perfil: 0,
    };
  }

  
}
