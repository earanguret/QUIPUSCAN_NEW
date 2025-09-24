import { Component, OnInit } from '@angular/core';
import { ReporteService } from '../../../services/remoto/reporte/reporte.service';
import { CommonModule } from '@angular/common';
import { eventos_modulos } from '../../../../domain/dto/ReporteResponse.dto';

@Component({
  selector: 'app-auditoria-historico-eventos',
  imports: [CommonModule],
  templateUrl: './auditoria-historico-eventos.component.html',
  styleUrl: './auditoria-historico-eventos.component.css'
})
export class AuditoriaHistoricoEventosComponent implements OnInit {

  listaEventosModulos: eventos_modulos[] = [];
  listaEventosModulosTemp: eventos_modulos[] = [];

  constructor(private reporteService: ReporteService) { }

  ngOnInit(): void {
    this.obtenerEventosModulos()
  }

  obtenerEventosModulos() {
    this.reporteService.ObtenerEventosModulos().subscribe({
      next: (data: eventos_modulos[]) => {
        this.listaEventosModulos = data;
        this.listaEventosModulosTemp = data;
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
