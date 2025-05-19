import { ErrorValidacion } from "../../../domain/dto/ErrorValidacion.dto";
import { PersonaModel } from "../../../domain/models/Persona.model";
import { UsuarioModel } from "../../../domain/models/Usuario.model";


export function form_usuario_vf(dataPersona: PersonaModel, dataUsuario: UsuarioModel, modificar: boolean): ErrorValidacion[] {
    const errorValidacion: ErrorValidacion[] = [];
    if (!dataPersona.nombre) {
      errorValidacion.push({ campo: 'nombre(s)', mensaje: 'Campo requerido' });
    }
    if (!dataPersona.ap_paterno) {
      errorValidacion.push({ campo: 'ap_paterno', mensaje: 'Campo requerido' });
    }
    if (!dataPersona.ap_materno) {
      errorValidacion.push({ campo: 'ap_materno', mensaje: 'Campo requerido' });
    }
    if (!dataPersona.dni) {
      errorValidacion.push({ campo: 'dni', mensaje: 'Campo requerido' });
      
    }else if(!dataPersona.dni.match(/^\d{8}$/)){
      errorValidacion.push({ campo: 'dni', mensaje: 'El DNI debe tener 8 dígitos' });
    }

    if (!dataUsuario.username) {
      errorValidacion.push({ campo: 'username', mensaje: 'Campo requerido' });
    }
    if (!dataUsuario.perfil) {
      errorValidacion.push({ campo: 'perfil', mensaje: 'Campo requerido' });
    }
    if (dataUsuario.estado === null) {
      errorValidacion.push({ campo: 'estado', mensaje: 'Campo requerido' });
    }
    if (!modificar) {
      if (!dataUsuario.password) {
        errorValidacion.push({ campo: 'password', mensaje: 'Campo requerido' });
      }
    }
  
    return errorValidacion;
  }

  export function validarContrasenaInput(value: string): { valido: boolean; password?: string } {
    const regex = /^(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{8,}$/;
    if (!regex.test(value)) {
      return { valido: false };
    } else {
      return { valido: true, password: value };
    }
  }