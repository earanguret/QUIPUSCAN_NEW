import { Component, HostListener, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ExpedienteService } from '../../../services/remoto/expediente/expediente.service';
import { ExpedienteCoincidenciaResponse, ExpedienteResponseDataView } from '../../../../domain/dto/ExpedienteResponse.dto';
import { EstadoService } from '../../../services/remoto/estado/estado.service';
import { EstadoExpedienteResponse } from '../../../../domain/dto/EstadoResponse.dto';
import { InventarioService } from '../../../services/remoto/inventario/inventario.service';
import { InventarioDetalleResponse, InventarioResponse } from '../../../../domain/dto/InventarioResponse.dto';
import { FlujogramaResponse } from '../../../../domain/dto/FlujogramaResponse.dto';
import { FlujogramaService } from '../../../services/remoto/flujograma/flujograma.service';

@Component({
  selector: 'app-produccion-expedientes',
  imports: [CommonModule, FormsModule],
  templateUrl: './produccion-expedientes.component.html',
  styleUrl: './produccion-expedientes.component.css',
})
export class ProduccionExpedientesComponent {

  nro_progreso = 0
  nro_expediente: string = '';
  lista_expedientes: ExpedienteCoincidenciaResponse[] = [];
  mostrarCard: boolean = false;

  data_flujograma: FlujogramaResponse[] = [];

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

  data_inventario: InventarioResponse = {
    id_inventario: 0,
    id_responsable: 0,
    especialidad: '',
    anio: null,
    cantidad: 0,
    tipo_doc: '',
    serie_doc: '',
    sede: '',
    codigo: ''
  }

  estadoExpediente: EstadoExpedienteResponse = {
    id_estado_expediente: 0,
    id_expediente: 0,
    id_inventario: 0,
    estado_recepcionado: null,
    estado_preparado: null,
    estado_digitalizado: null,
    estado_indizado: null,
    estado_controlado: null,
    estado_fedatado: null,
    id_disco: 0,
    mensajes: []
  }


  constructor(
    private expedienteService: ExpedienteService,
    private eRef: ElementRef,
    private estadoService: EstadoService,
    private inventarioService: InventarioService,
    private flujogramaService: FlujogramaService
  ) { }

  BuscarExpediente() {

    if (this.nro_expediente == '') {
      alert('Debe ingresar el nro de expediente')
      return
    }


    this.expedienteService.ObtenerExpedintesByNro_expediente(this.nro_expediente).subscribe({
      next: (data: ExpedienteCoincidenciaResponse[]) => {
        console.log('datos coincidencias obtenidos:', data);
        this.lista_expedientes = data;
        console.log(this.lista_expedientes)
      },
      error: (error) => {
        console.error(error);
      },
      complete: () => {
        console.log('coincidencias obtenidas');
        this.mostrarCard = true;
      }
    })
  }

  Limpiar() {
    this.mostrarCard = false;
    // 👇 opcional: vaciar después de que acabe la animación
    setTimeout(() => this.lista_expedientes = [], 400);
  }

  @HostListener('document:click', ['$event'])
  onClickOutside(event: Event) {
    if (!this.eRef.nativeElement.contains(event.target)) {
      this.Limpiar();
    }
  }


  calcularProgreso() {

    this.nro_progreso = 0
    if (this.estadoExpediente.estado_recepcionado == 'T') {
      this.nro_progreso = 1
    }
    if (this.estadoExpediente.estado_preparado == 'T') {
      this.nro_progreso = 2
    }
    if (this.estadoExpediente.estado_digitalizado == 'T') {
      this.nro_progreso = 3
    }
    if (this.estadoExpediente.estado_indizado == 'T') {
      this.nro_progreso = 4
    }
    if (this.estadoExpediente.estado_controlado == 'T') {
      this.nro_progreso = 5
    }
    if (this.estadoExpediente.estado_fedatado == 'T') {
      this.nro_progreso = 6
    }

  }

  buscarDatosExpediente(id_expediente: number) {
    this.estadoService.ObtenerEstadoExpedienteByIdExpediente(id_expediente).subscribe({
      next: (data: EstadoExpedienteResponse) => {
        this.estadoExpediente = data;
        console.log('estao expediente:', this.estadoExpediente);
      },
      error: (error) => {
        console.log(error);
      },
      complete: () => {
        console.log('listado de estado expediente');
        this.calcularProgreso()
        this.ObtenerExpedienteDataViewXid(id_expediente)
        this.obtenerInventario(this.estadoExpediente.id_inventario)
        this.ObtenerFlujogramaByIdExpediente(id_expediente)
      }
    })
  }

  obtenerInventario(id_inventario: number) {
    this.inventarioService.ObtenerInventarioDetalle(id_inventario).subscribe({
      next: (data: InventarioDetalleResponse) => {
        this.data_inventario = data;
        console.log(data);
      },
      error: (error) => {
        console.log(error);
      },
      complete: () => {
        console.log('listado de inventario');
      }
    })
  }


   ObtenerExpedienteDataViewXid(id_expediente : number){
    this.expedienteService.ObtenerExpedienteDataViewXid(id_expediente).subscribe({
      next: (data: ExpedienteResponseDataView) => {
        this.data_expediente_header = data;
        console.log(this.data_expediente_header);
      },
      error: (error) => {
        console.log(error);
      },
      complete: () => {
        console.log('listado de preparacion detalle completado');
      }
    })
  }

  ObtenerFlujogramaByIdExpediente(id_expediente: number) {
    this.flujogramaService.ObtenerFlujogramaById(id_expediente).subscribe({
      next: (data: FlujogramaResponse[]) => {
        this.data_flujograma = data;
      },
      error: (error) => {
        console.log(error);
      },
      complete: () => {
        console.log('listado de flujograma detalle completado');
      }
    })
  }


}
