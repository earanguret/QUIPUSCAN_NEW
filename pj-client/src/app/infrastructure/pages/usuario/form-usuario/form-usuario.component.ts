import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NavegatorComponent } from '../../../shared/components/navegator/navegator.component';
import { SubnavegatorComponent } from '../../../shared/components/subnavegator/subnavegator.component';
import { PersonaModel } from '../../../../domain/models/Persona.model';
import { UsuarioModel } from '../../../../domain/models/Usuario.model';
import { PersonaService } from '../../../services/remoto/persona/persona.service';
import { UsuarioService } from '../../../services/remoto/usuario/usuario.service';
import { CrearPersonaMessageResponse, ModificarPersonaMessageResponse } from '../../../../domain/dto/PersonaResponse.dto';
import { CrearUsuarioResponse, ModificarDatosUsuarioResponse } from '../../../../domain/dto/UsuarioResponse.dto';
import { form_usuario_vf } from '../../../validator/fromValidator/usuario.validator';
import { SweetAlert } from '../../../shared/animate-messages/sweetAlert';
import { SoloNumerosDirective } from '../../../directives/solo-numeros.directive';
import { SoloLetrasDirective } from '../../../directives/solo-letras.directive';
import { validarContrasenaInput } from '../../../validator/fromValidator/usuario.validator';
import { PersonaRequest } from '../../../../domain/dto/PersonaRequest.dto';
import { CredencialesService } from '../../../services/local/credenciales.service';
import { UsuarioRequest } from '../../../../domain/dto/UsuarioRequest.dto';

@Component({
  selector: 'app-form-usuario',
  imports: [NavegatorComponent, SubnavegatorComponent, CommonModule, FormsModule, SoloNumerosDirective, SoloLetrasDirective],
  templateUrl: './form-usuario.component.html',
  styleUrl: './form-usuario.component.css'
})
export class FormUsuarioComponent implements OnInit {

  dataPersona: PersonaModel = {
    id_persona: 0,
    nombre: '',
    ap_paterno: '',
    ap_materno: '',
    dni: '',
  };

  dataUsuario: UsuarioModel = {
    id_usuario: 0,
    id_persona: 0,
    username: '',
    password: '',
    perfil: '',
    estado: null,
  };

  boton_text: string = 'Guardar';
  titulo: string = 'Creación de usuario';
  passWordValido: boolean = false;
  modificar_usuario: boolean = false;
  dni_state: boolean = false;

  originalPersona = { };
  originalUsuario = { };

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private personaService: PersonaService,
    private usuarioService: UsuarioService,
    private credencialesService: CredencialesService,
    private sweetAlert: SweetAlert) { }

  ngOnInit(): void {
    this.CargarPagina()
  }

  CargarPagina() {
    const params = this.activatedRoute.snapshot.params
    if (params['id_usuario']) {
      this.ObtenerDatosUsuario(params['id_usuario'])
      this.dni_state = true;
    }
  }

  ComparardatosModificados(actual: any, original: any): boolean {
    return JSON.stringify(actual) !== JSON.stringify(original);
  }

  validarContrasena(event: any) {
    const inputPassword = event.target.value;
    const { valido, password } = validarContrasenaInput(inputPassword);
    if (valido) {
      this.dataUsuario.password = password;
      this.passWordValido = true;
      
    } else {
      this.dataUsuario.password = undefined;
      this.passWordValido = false;
    }
  }
  
  //+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
  GuardarRegistroUsuario() {
    const erroresValidacion = form_usuario_vf(this.dataPersona, this.dataUsuario, this.modificar_usuario);
    if (erroresValidacion.length > 0) {
      let errorMensaje = '';
      erroresValidacion.forEach(error => {
        errorMensaje += `Error en el campo :"${error.campo}": ${error.mensaje} \n`;
      });
      alert(errorMensaje);
      return;
    }
  
    if (this.modificar_usuario) {
      const personaCambiada = this.ComparardatosModificados(this.dataPersona, this.originalPersona);
      const usuarioCambiado = this.ComparardatosModificados(
        { ...this.dataUsuario, password: undefined},
        this.originalUsuario
      );
    
      if (personaCambiada) {
        this.ModificarDatosPersona();
      }
    
      if (usuarioCambiado) {
        this.ModificarDatosUsuario();
      }
    
      if (this.dataUsuario.password?.trim()) {
        this.ModificarPasswordUsuario(this.dataUsuario.password);
      }

      if (personaCambiada||usuarioCambiado||this.dataUsuario.password?.trim()){
        this.sweetAlert.MensajeExito('Usuario modificado');
        this.router.navigate(['/principal/list-usuario']);
      }
      else{
        alert('No se ha modificado nada, solo presione volver para regresar a la lista de usuarios')
      }
    } else {
      this.CrearPersona();
    }
  }

  CrearUsuario() {
    this.dataUsuario.id_persona=this.dataPersona.id_persona;
    console.log(this.dataUsuario)
    const data_usuario_tem:UsuarioRequest = {
      id_persona: this.dataPersona.id_persona,
      username: this.dataUsuario.username,
      password: this.dataUsuario.password!,
      perfil: this.dataUsuario.perfil,
      estado: this.dataUsuario.estado!,
      app_user: this.credencialesService.credenciales.username
    }
    this.usuarioService.CrearUsuario(data_usuario_tem).subscribe({
      next: (usuario: CrearUsuarioResponse) => {
        console.log('Usuario creado:', usuario);
      },
      error: (err) => {
        if (err.status === 409) {
          console.error('El usuario ya existe:', err);
          alert('El usuario ya existe.');
        } else if (err.status === 500) {
          console.error('Error interno del servidor:', err);
          alert('Error interno del servidor. verifique la consola.');
        } else {
          console.error('Error desconocido:', err);
          alert('Ocurrió un error inesperado. Verifique el servidor.');
        }
      },
      complete: () => {
        this.sweetAlert.MensajeExito('Usuario creado');
        this.router.navigate(['/principal/list-usuario']);
      }
    })
  }

  ModificarDatosUsuario(){
    const data_usuario_tem:UsuarioRequest = {
      username: this.dataUsuario.username,
      perfil: this.dataUsuario.perfil,
      estado: this.dataUsuario.estado!,
      app_user: this.credencialesService.credenciales.username
    }
    this.usuarioService.ModificarDatosUsuario(this.dataUsuario.id_usuario,data_usuario_tem).subscribe({
      next: (data: ModificarDatosUsuarioResponse) => {
        console.log('Usuario modificado:', data);
      },
      error: (err) => {
        if (err.status === 404) {
          console.error('El usuario no existe:', err);
          alert('El usuario no existe.');
        } else if (err.status === 500) {
          console.error('Error interno del servidor:', err);
          alert('Error interno del servidor. verifique la consola.');
        } else {
          console.error('Error desconocido:', err);
          alert('Ocurrió un error inesperado. Verifique el servidor.');
        }
      },
      complete: () => {
        console.log('Proceso de modificación de usuario completado');
        
      }
    })
  }

  ModificarPasswordUsuario(password: string) {
    this.usuarioService.ModificarPasswordUsuario(this.dataUsuario.id_usuario,password, this.credencialesService.credenciales.username).subscribe({
      next: (data: ModificarDatosUsuarioResponse) => {
        console.log('Usuario modificado:', data);
      },
      error: (err) => {
        if (err.status === 404) {
          console.error('El usuario no existe:', err);          
          alert('El usuario no existe.');
        } else if (err.status === 500) {
          console.error('Error interno del servidor:', err);
          alert('Error interno del servidor. verifique la consola.');
        } else {
          console.error('Error desconocido:', err);
          alert('Ocurrió un error inesperado. Verifique el servidor.');
        }
      },
      complete: () => {
        console.log('Proceso de modificación de usuario completado');
      }
    })
  }

  CrearPersona( ) {
    console.log(this.dataPersona)
    const data_persona_tem:PersonaRequest = {
      nombre: this.dataPersona.nombre,
      ap_paterno: this.dataPersona.ap_paterno,
      ap_materno: this.dataPersona.ap_materno,
      dni: this.dataPersona.dni,
      app_user: this.credencialesService.credenciales.username
    }

    this.personaService.CrearPersona(data_persona_tem).subscribe({
      next: (data: CrearPersonaMessageResponse) => {
        console.log('Persona creada:', data);
        this.dataPersona.id_persona=data.id_persona;
      },
      error: (err) => {
        if (err.status === 409) {
          console.error('La persona ya existe:', err);
          console.log('La persona ya existe.');
          this.CrearUsuario() // Si la persona ya existe, de todas formas crear el usuario
        } else if (err.status === 500) {
          console.error('Error interno del servidor:', err);
          alert('Error interno del servidor. verifique la consola.');
        } else {
          console.error('Error desconocido:', err);
          alert('Ocurrió un error inesperado. Verifique el servidor.');
        }
      },
      complete: () => {
        console.log('Proceso de creación de persona completado');
        this.CrearUsuario()
      }
    })
  }

  ModificarDatosPersona(){
    const data_persona_tem:PersonaRequest = {
          nombre: this.dataPersona.nombre,
          ap_paterno: this.dataPersona.ap_paterno,
          ap_materno: this.dataPersona.ap_materno,
          dni: this.dataPersona.dni,
          app_user: this.credencialesService.credenciales.username
        }

    this.personaService.ModificarPersona(this.dataPersona.id_persona,data_persona_tem).subscribe({
      next: (data: ModificarPersonaMessageResponse) => {
        console.log('Datos de la persona modificados:', data);
      },
      error: (err) => {
        if (err.status === 404) {                
          console.error('La persona no existe:', err);
          alert('La persona no existe.');
        } else if (err.status === 500) {
          console.error('Ocurrió un error inesperado. Verifique el servidor.');          
          alert('Ocurrió un error inesperado. Verifique el servidor.');
        }
      },
      complete: () => {
        console.log('Proceso de modificación de persona completado');
      }
    })
  }

  //+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
  BuscarPersonByDNI() {
    this.personaService.ObtenerDatosPersonaByDNI(this.dataPersona.dni).subscribe({
      next: (persona: PersonaModel) => {
        this.dataPersona.nombre = persona.nombre;
        this.dataPersona.ap_paterno = persona.ap_paterno;
        this.dataPersona.ap_materno = persona.ap_materno;
        this.dataPersona.id_persona = persona.id_persona;

      },
      error: (err) => {
        if (err.status === 404) {
          console.error('La persona no existe:', err);
          
          this.dni_state = true;
        } else if (err.status === 500) {
          console.error('Error interno del servidor:', err);
          alert('Error interno del servidor. verifique la consola.');
        } else {
          console.error('Error desconocido:', err);
          alert('Ocurrió un error inesperado. Verifique el servidor.');
        }
      },
      complete: () => {
        console.log('Proceso de recuperacion persona completado');
        this.dni_state = true;
      }
    })
  }

  ReiniciarFormulario() {
    this.dataPersona.nombre = '';
    this.dataPersona.ap_paterno = '';
    this.dataPersona.ap_materno = '';
    this.dataPersona.dni = '';
    this.dataUsuario.username = '';
    this.dataUsuario.password = '';
    this.dataUsuario.perfil = '';
    this.dataUsuario.estado = null;
    this.dataUsuario.id_persona = 0;
    this.dni_state = false;
  }

  ObtenerDatosUsuario(id_usuario: number) {
    this.usuarioService.ObtenerUsuario(id_usuario).subscribe({
      next: (usuario: UsuarioModel) => {
        delete usuario.password
        this.dataUsuario.id_usuario = usuario.id_usuario;
        this.dataUsuario.id_persona = usuario.id_persona;
        this.dataUsuario.username = usuario.username;
        this.dataUsuario.perfil = usuario.perfil;
        this.dataUsuario.estado = usuario.estado;
        this.modificar_usuario = true
        console.log('Usuario encontrado:', usuario);
      },
      error: (err) => {
        if (err.status === 404) {
          console.error('El usuario no existe:', err);
          alert('El usuario no existe.');
        } else if (err.status === 500) {
          console.error('Error interno del servidor:', err);
          alert('Error interno del servidor. verifique la consola.');
        } else {
          console.error('Error desconocido:', err);
          alert('Ocurrió un error inesperado. Verifique el servidor.');
        }
      },
      complete: () => {
        console.log('Proceso de recuperacion usuario completado');
        const { password, ...rest } = this.dataUsuario;
        this.originalUsuario = { ...rest };
        this.ObtenerDatosPersona(this.dataUsuario.id_persona)
      }

    })
  }

  ObtenerDatosPersona(id_persona: number) {
    this.personaService.ObtenerPersona(id_persona).subscribe({
      next: (persona: PersonaModel) => {

        this.dataPersona.id_persona = persona.id_persona;
        this.dataPersona.nombre = persona.nombre;
        this.dataPersona.ap_paterno = persona.ap_paterno;
        this.dataPersona.ap_materno = persona.ap_materno;
        this.dataPersona.dni = persona.dni;

        this.modificar_usuario = true
        console.log('Persona encontrado:', persona);
      },
      error: (err) => {
        if (err.status === 404) {
          console.error('La persona no existe:', err);
          alert('La persona no existe.');
        } else if (err.status === 500) {
          console.error('Error interno del servidor:', err);
          alert('Error interno del servidor. verifique la consola.');
        } else {
          console.error('Error desconocido:', err);
          alert('Ocurrió un error inesperado. Verifique el servidor.');
        }
      },
      complete: () => {
        console.log('Proceso de recuperacion persona completado');
        this.titulo = 'Modificar Usuario'
        this.boton_text = 'Modificar'
        this.originalPersona = { ...this.dataPersona};
      }
    })
  }
}
