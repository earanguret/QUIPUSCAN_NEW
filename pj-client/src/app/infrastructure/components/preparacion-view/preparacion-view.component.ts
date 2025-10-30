import { Component, Input, OnInit } from '@angular/core';
import { PreparacionService } from '../../services/remoto/preparacion/preparacion.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ExpedienteService } from '../../services/remoto/expediente/expediente.service';
import { PreparacionResponseDataView } from '../../../domain/dto/PreparacionResponse.dto';
import { ExpedienteResponseDataView } from '../../../domain/dto/ExpedienteResponse.dto';

@Component({
  selector: 'app-preparacion-view',
  imports: [FormsModule, CommonModule],
  templateUrl: './preparacion-view.component.html',
  styleUrl: './preparacion-view.component.css'
})
export class PreparacionViewComponent implements OnInit {
  @Input() id_expediente: any;

  ListObservacionesPreparacion: string[] = [];

  data_expediente_header: ExpedienteResponseDataView = {
    id_expediente: 0,
    nro_expediente: '',
    id_inventario: 0,
    codigo_inventario: '',
    id_responsable: 0,
    cod_paquete: '',
    responsable: null,
    create_at: null,
    username: null,
  }

  data_preparacion: PreparacionResponseDataView = {
    id_preparacion: 0,
    id_responsable: 0,
    id_expediente: 0,
    fojas_total: null,
    fojas_unacara: null,
    fojas_doscaras: null,
    observaciones: '',
    copias_originales: false,
    copias_simples: false,
    cod_paquete: null,
    create_at: null,
    responsable: null,
    username: null,
    nro_expediente: null,
  }

  constructor(private preparacionService: PreparacionService, private expedienteService: ExpedienteService) { }

  ngOnInit(): void {
    this.ObtenerPreparacionByIdExpediente();
    this.ObtenerExpedienteDataViewXid();
  }



  ObtenerPreparacionByIdExpediente() {

    this.preparacionService.ObtenerPreparacionDataViewXidExpediente(this.id_expediente).subscribe({
      next: (data: PreparacionResponseDataView) => {
        this.data_preparacion = data;
        this.ListObservacionesPreparacion = this.data_preparacion.observaciones?.split('|') ?? [];
      },
      error: (error) => {
        console.log(error);
      },
      complete: () => {
        console.log('listado de preparacion detalle completado');
      }
    })
  }


  ObtenerExpedienteDataViewXid() {
    this.expedienteService.ObtenerExpedienteDataViewXid(this.id_expediente).subscribe({
      next: (data: ExpedienteResponseDataView) => {
        this.data_expediente_header = data;
      },
      error: (error) => {
        console.log(error);
      },
      complete: () => {
        console.log('listado de preparacion detalle completado');
      }
    })
  }


}
