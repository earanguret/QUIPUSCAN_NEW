import { Component } from '@angular/core';
import { UsuarioModel } from '../../../../domain/models/Usuario.model';
import { CredencialesService } from '../../../services/local/credenciales.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-navegator',
  imports: [RouterModule, CommonModule],
  templateUrl: './navegator.component.html',
  styleUrl: './navegator.component.css'
})
export class NavegatorComponent {

  credenciales: UsuarioModel={
    username:'',
    id_usuario:0,
    id_persona:0,
    perfil:'',
  };

  constructor(private router:Router, private credencialesService:CredencialesService){ this.credenciales=this.credencialesService.credenciales }

  confirmarSalida() {
    Swal.fire({
      title: '¿Desea salir del sistema?',
      text: 'Se cerrará la sesión actual.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, salir',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        // Realiza la acción para salir del sistema, redirección y cierre de sesión
        console.log('Saliendo del sistema...');
        // this.loginService.logout();
        this.router.navigate(['/login'])
        
      }
    });
  }

}
