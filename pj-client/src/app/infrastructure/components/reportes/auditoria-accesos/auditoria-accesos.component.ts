import { Component, OnInit } from '@angular/core';
import { eventos_usuarios_login } from '../../../../domain/dto/ReporteResponse.dto';
import { ReporteService } from '../../../services/remoto/reporte/reporte.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-auditoria-accesos',
  imports: [CommonModule],
  templateUrl: './auditoria-accesos.component.html',
  styleUrl: './auditoria-accesos.component.css'
})
export class AuditoriaAccesosComponent implements OnInit {

  listaEventosUsuarios: eventos_usuarios_login[] = [];
  listaEventosUsuariosTemp: eventos_usuarios_login[] = [];
  constructor(private reporteService: ReporteService) { }

  ngOnInit(): void {
    this.obtenerEventosUsuariosLogin()
  }

  obtenerEventosUsuariosLogin(){
    this.reporteService.ObtenerEventosUsuariosLogin().subscribe({
      next: (data: eventos_usuarios_login[]) => {
        this.listaEventosUsuarios = data;
        this.listaEventosUsuariosTemp = data;
        console.log(data);
      },
      error: (error) => {
        console.error(error);
      },
      complete: () => {
        console.log('listado de eventos usuarios exitosamente');
      }
    })
  }

}
