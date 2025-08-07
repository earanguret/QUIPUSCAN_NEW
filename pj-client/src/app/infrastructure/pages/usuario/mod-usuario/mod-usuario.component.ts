import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NavegatorComponent } from '../../../shared/components/navegator/navegator.component';
import { SubnavegatorComponent } from '../../../shared/components/subnavegator/subnavegator.component';
import { CredencialesService } from '../../../services/local/credenciales.service';
import { FormsModule } from '@angular/forms';
import { PersonaRequest } from '../../../../domain/dto/PersonaRequest.dto';
import { PersonaModel } from '../../../../domain/models/Persona.model';
import { PersonaService } from '../../../services/remoto/persona/persona.service';
import { ModificarPersonaMessageResponse } from '../../../../domain/dto/PersonaResponse.dto';
import { UsuarioModel } from '../../../../domain/models/Usuario.model';
import { SweetAlert } from '../../../shared/animate-messages/sweetAlert';

@Component({
  selector: 'app-mod-usuario',
  imports: [NavegatorComponent, SubnavegatorComponent, CommonModule, FormsModule],
  templateUrl: './mod-usuario.component.html',
  styleUrl: './mod-usuario.component.css'
})
export class ModUsuarioComponent implements OnInit {

  data_persona: PersonaModel ={
    id_persona:0,
    nombre:'',
    ap_paterno:'',
    ap_materno:'',
    dni:'',
  };
  credenciales: UsuarioModel;

  constructor( private credencialesService:CredencialesService,
     private personaService:PersonaService,
     private sweetAlert: SweetAlert
    ) {this.credenciales=this.credencialesService.credenciales; }
  
  ngOnInit(): void {
    this.recuperarDatosPersona()
  }

  recuperarDatosPersona(){
    this.personaService.ObtenerPersona(this.credenciales.id_persona).subscribe({
      next: (data:PersonaModel) => {
        this.data_persona = data;
      },
      error: (error) => {
        console.log(error);
      },
      complete: () => {
        console.log('listado de personas completado');
      }
    })
  }

  modificarPersona(){
    const data_persona_tem:PersonaRequest = {
      nombre: this.data_persona.nombre,
      ap_paterno: this.data_persona.ap_paterno,
      ap_materno: this.data_persona.ap_materno,
      dni: this.data_persona.dni,
      app_user: this.credenciales.username
    }
  

    this.personaService.ModificarPersona(this.data_persona.id_persona,data_persona_tem).subscribe({
      next: (data:ModificarPersonaMessageResponse) => {
        console.log(data);
      },
      error: (error) => {
        console.log(error);
      },
      complete: () => {
        console.log('modificacion de persona completada');
        this.sweetAlert.MensajeToast('Persona modificada correctamente', 2000);
      }
    })  
  }

}
