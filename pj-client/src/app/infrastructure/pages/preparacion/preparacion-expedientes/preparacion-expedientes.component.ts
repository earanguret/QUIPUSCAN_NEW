import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NavegatorComponent } from '../../../shared/components/navegator/navegator.component';
import { SubnavegatorComponent } from '../../../shared/components/subnavegator/subnavegator.component';
import { InfoInventarioComponent } from '../../../components/info-inventario/info-inventario.component';
import { ExpedienteResponse, ExpedienteResponseDataView } from '../../../../domain/dto/ExpedienteResponse.dto';
import { ExpedienteService } from '../../../services/remoto/expediente/expediente.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SoloNumerosDirective } from '../../../directives/solo-numeros.directive';
import { NgxPaginationModule } from 'ngx-pagination';
import { FlujogramaService } from '../../../services/remoto/flujograma/flujograma.service';
import { FlujogramaRequest } from '../../../../domain/dto/FlujogramaRequest.dto';
import { CredencialesService } from '../../../services/local/credenciales.service';
import { CrearFlujogramaResponse } from '../../../../domain/dto/FlujogramaResponse.dto';
import { EstadoService } from '../../../services/remoto/estado/estado.service';
import { ModificarEstadoResponse } from '../../../../domain/dto/EstadoResponse.dto';
import { PreparacionService } from '../../../services/remoto/preparacion/preparacion.service';
import { PreparacionModel } from '../../../../domain/models/Preparacion.model';
import { PreparacionRequest } from '../../../../domain/dto/PreparacionRequest.dto';
import { CrearPreparacionResponse, ModificarPreparacionResponse, PreparacionResponse, PreparacionResponseDataView } from '../../../../domain/dto/PreparacionResponse.dto';
import { form_preparacion_vf } from '../../../validator/fromValidator/preparacion.validator';
import { SweetAlert } from '../../../shared/animate-messages/sweetAlert';
import { map } from 'rxjs';

declare var bootstrap: any;

@Component({
  selector: 'app-preparacion-expedientes',
  imports: [NavegatorComponent, SubnavegatorComponent, InfoInventarioComponent,NgxPaginationModule, CommonModule, FormsModule, SoloNumerosDirective],
  templateUrl: './preparacion-expedientes.component.html',
  styleUrl: './preparacion-expedientes.component.css'
})
export class PreparacionExpedientesComponent implements OnInit {
  id_inventario: number = 0;
  p: number = 1;
  modificarPreparacion: boolean = false;
  private myModalRecepcion: any;
  private myModalPreparation: any;

  ListExpedientes: ExpedienteResponse[] = [];
  ListExpedientesTemp: ExpedienteResponse[] = [];

  ListObservaciones: string[] = [];

  id_expediente_temp: number = 0;
  nro_expediente_temp: string = '';
  observacion_temp: string = '';

  checkAprobado: boolean = false;


  nro_expedientes: number = 0;
  nro_concluidos: number = 0;
  nro_pendientes: number = 0;
  nro_rechazados: number = 0;
  list_expedinete_rechazados: ExpedienteResponse[] = [];

  data_expediente_temp: ExpedienteResponse = {
    id_expediente: 0,
    nro_expediente: '',
    id_inventario: 0,
    id_responsable: 0,
    cod_paquete: '',
    estado_recepcionado: '',
    estado_preparado: '',
    estado_digitalizado: '',
    estado_indizado: '',
    estado_controlado: '',
    estado_fedatado: '',
    estado_finalizado: '',
  }

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
 
  data_expediente_preparacion: PreparacionModel ={
    id_preparacion: 0,
    id_responsable: 0,
    id_expediente: 0,
    fojas_total: null,
    fojas_unacara: null,
    fojas_doscaras: null,
    observaciones: null,
    copias_originales: false,
    copias_simples: false
  }



  constructor(
      private router: Router, 
      private activatedRoute: ActivatedRoute,
      private expedienteService: ExpedienteService,
      private flujogramaService: FlujogramaService,
      private credencialesService: CredencialesService,
      private estadoService: EstadoService,
      private sweetAlert: SweetAlert,
      private preparacionService: PreparacionService) {}

  ngOnInit(): void {
    this.inicializadorModales();
    this.id_inventario = this.activatedRoute.snapshot.params['id'];
    this.ListarExpedientes();
    
  }

  ListarExpedientes() {
    this.expedienteService.ListarExpedientesXidInventario(this.id_inventario).subscribe({
      next: (data: ExpedienteResponse[]) => {
        this.ListExpedientes = data;
        this.ListExpedientesTemp = data;
        this.informacionTags(this.ListExpedientesTemp);
        console.log(this.ListExpedientes);
      },
      error: (error) => {
        console.log(error);
      },
      complete: () => {
        console.log('listado de expedientes completado');
      }
    })
  }


   informacionTags(expedientes: ExpedienteResponse[]) {
      this.nro_expedientes = expedientes.length;
      this.nro_concluidos = expedientes.filter(e => e.estado_preparado === 'T').length;
      this.nro_pendientes = expedientes.filter(e => e.estado_preparado === null || e.estado_preparado === 'A').length;
      this.nro_rechazados = expedientes.filter(e => e.estado_preparado === 'R').length;
      this.ObternerExpedientesRechazadosPreparados()
    }
  
    ObternerExpedientesRechazadosPreparados() {
      this.expedienteService.ListarExpedientesXidInventario(this.id_inventario)
      .pipe(
        map((data: ExpedienteResponse[]) =>
          data.filter(exp => exp.estado_digitalizado === 'R')
        )
      )
      .subscribe({
        next: (dataFiltrada: ExpedienteResponse[]) => {
          this.list_expedinete_rechazados = dataFiltrada;
          this.nro_rechazados = dataFiltrada.length;
          console.log(this.ListExpedientes);
        },
        error: (error) => {
          console.error(error);
        },
        complete: () => {
          console.log('listado de expedientes filtrado completado');
        }
      });
    }

  inicializadorModales() {
    this.myModalRecepcion = new bootstrap.Modal(document.getElementById('exampleModalReception'), {
      backdrop: true,
      keyboard: true
    });

    this.myModalPreparation = new bootstrap.Modal(document.getElementById('exampleModalpreparation'), {
      backdrop: 'static',
      keyboard: true
    });
  }

  closeModalRecepcion() {
    this.myModalRecepcion.hide();
  }

  closeModalPreparation() {
    this.myModalPreparation.hide();
  }

  openModalReception(id_expediente:number) {

    this.modificarPreparacion = false;
    this.myModalRecepcion.show();
    this.id_expediente_temp = id_expediente;

  }

  openNewModalPreparation(id_expediente:number) {
   this.LimpiarDatosPreparacion();
    this.ObtenerExpedienteDataViewXid(id_expediente)
    this.id_expediente_temp = id_expediente;
    this.myModalPreparation.show();
  }

  openEditModalPreparation(id_expediente:number) {
   
    this.ObtenerExpedienteDataViewXid(id_expediente)
    this.recuperarDataPreparacionView(id_expediente)
    this.id_expediente_temp = id_expediente;
    this.myModalPreparation.show();
  }

  ObtenerExpedienteDataViewXid(id_expediente:number) {
    console.log('expediente recuperado:',id_expediente)
    this.expedienteService.ObtenerExpedienteDataViewXid(id_expediente).subscribe({
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

  recuperarDataPreparacionView(id_expediente: number) {
    this.preparacionService.ObtenerPreparacionDataViewXidExpediente(id_expediente).subscribe({
      next: (data: PreparacionResponseDataView) => {
        this.data_preparacion = data;
      },
      error: (error) => {
        console.log(error);
      },
      complete: () => {
        console.log('listado de preparacion detalle completado');
      }
    })
  }

  obtenerExpedienteTem(expediente_temp: ExpedienteResponse) {
    this.data_expediente_temp = expediente_temp;
    console.log(this.data_expediente_temp)
  }

  buscarEnObjeto(event: any) {
    this.p = 1
    let objetosFiltrados = []
    const textoBusqueda = event.target.value.toLowerCase();
    objetosFiltrados = this.ListExpedientesTemp.filter((objeto:
      {
        nro_expediente: string;
      }) => {
      const nombre_expediente = objeto.nro_expediente.toLowerCase();
      return nombre_expediente.includes(textoBusqueda);
    });
    this.ListExpedientes = objetosFiltrados
  }

  EventAction(){
    if(this.modificarPreparacion){
      this.ModificarPreparacion()
    } else { 
      this.CrearPreparacion()
    }
  }

  // 
  RecepcionFlujograma() {
    let data_flujograma: FlujogramaRequest = {
      id_expediente: this.id_expediente_temp,
      id_responsable: this.credencialesService.credenciales.id_usuario,
      app_user: this.credencialesService.credenciales.username,
      area: 'PREPARACION'
    }
   this.flujogramaService.CrearFlujograma(data_flujograma).subscribe({
      next: (data: CrearFlujogramaResponse) => {
        console.log(data.message);
      },
      error: (error) => {
        console.log(error);
      },
      complete: () => {
        console.log('flujograma creado correctamente');
        this.openNewModalPreparation(this.id_expediente_temp);
        this.EstadoPreparacionAceptado()
        this.closeModalRecepcion();
      }
    })
  }

  EstadoPreparacionAceptado() {
    this.estadoService.RecepcionarPreparacion(this.id_expediente_temp, this.credencialesService.credenciales.username).subscribe({
      next: (data: ModificarEstadoResponse) => {
        console.log(data.message);
      },
      error: (error) => {
        console.log(error);
      },
      complete: () => {
        console.log('estado preparacion aceptado correctamente');
        this.ListarExpedientes();
      }
    })
  }

  EstadoPreparacionTrabajado() {
    this.estadoService.TrabajadoPreparacion(this.id_expediente_temp, this.credencialesService.credenciales.username).subscribe({
      next: (data: ModificarEstadoResponse) => {
        console.log(data.message);
      },
      error: (error) => {
        console.log(error);
      },
      complete: () => {
        console.log('estado preparacion aceptado correctamente');
        this.ListarExpedientes();
      }
    })
  }

  CrearPreparacion() {

    const erroresValidacion = form_preparacion_vf(this.data_expediente_preparacion);
        if (erroresValidacion.length > 0) {
          let errorMensaje = '';
          erroresValidacion.forEach(error => {
            errorMensaje += `Error en el campo :"${error.campo}": ${error.mensaje}`;
          });
          alert(errorMensaje)
          console.log(errorMensaje)
          return;
        }

    let data_preparacion_request: PreparacionRequest = {
      id_responsable: this.credencialesService.credenciales.id_usuario,
      id_expediente: this.id_expediente_temp,
      fojas_total: this.data_expediente_preparacion.fojas_total,
      fojas_unacara: this.data_expediente_preparacion.fojas_unacara,
      fojas_doscaras: this.data_expediente_preparacion.fojas_doscaras,
      observaciones: this.ListObservaciones.length? this.ListObservaciones.join('|'): null,
      copias_originales: this.data_expediente_preparacion.copias_originales,
      copias_simples: this.data_expediente_preparacion.copias_simples,
      app_user: this.credencialesService.credenciales.username
    }



    this.preparacionService.CrearPreparacion(data_preparacion_request).subscribe({
      next: (data: CrearPreparacionResponse) => {
        console.log(data.message);
      },
      error: (error) => {
        console.log(error);
      },
      complete: () => {
        console.log('creacion de preparacion completado');
        this.EstadoPreparacionTrabajado()
        this.closeModalPreparation();
        this.sweetAlert.MensajeSimpleSuccess('Expediente preparado',`Expediente ${this.data_expediente_header.nro_expediente} Preparado con exito` );
      }
    })

  }

  obternerPreparacionByIdExpediente(id_expediente: number ){

    this.preparacionService.ObtenerPreparacionXidExpediente(id_expediente).subscribe({
      next: (data: PreparacionResponse) => {
        console.log(data);
        this.data_expediente_preparacion = data;
        this.modificarPreparacion = true;
        this.ListObservaciones = this.data_expediente_preparacion?.observaciones? this.data_expediente_preparacion.observaciones.split('|') : [];
        this.openEditModalPreparation(id_expediente);
      },
      error: (error) => {
        console.log(error);
      },
      complete: () => {
        console.log('listado de preparacion detalle completado');
      }
    })    
  }


  ModificarPreparacion() {
    const erroresValidacion = form_preparacion_vf(this.data_expediente_preparacion);
    if (erroresValidacion.length > 0) {
      let errorMensaje = '';
      erroresValidacion.forEach(error => {
        errorMensaje += `Error en el campo :"${error.campo}": ${error.mensaje}`;
      });
      alert(errorMensaje)
      console.log(errorMensaje)
      return;
    }

    let data_expediente_preparacion_request: PreparacionRequest = {
      id_responsable: this.credencialesService.credenciales.id_usuario,
      id_expediente: this.id_expediente_temp,
      fojas_total: this.data_expediente_preparacion.fojas_total,
      fojas_unacara: this.data_expediente_preparacion.fojas_unacara,
      fojas_doscaras: this.data_expediente_preparacion.fojas_doscaras,
      observaciones: this.ListObservaciones.length? this.ListObservaciones.join('|'): null,
      copias_originales: this.data_expediente_preparacion.copias_originales,
      copias_simples: this.data_expediente_preparacion.copias_simples,
      app_user: this.credencialesService.credenciales.username
    }

    this.preparacionService.ModificarPreparacion(this.data_expediente_preparacion.id_expediente,data_expediente_preparacion_request).subscribe({
      next: (data: ModificarPreparacionResponse) => {
        console.log(data.message);
      },
      error: (error) => {
        console.log(error);
      },
      complete: () => {
        console.log('modificacion de preparacion completado');
        this.ListarExpedientes();
        this.closeModalPreparation();
        this.sweetAlert.MensajeSimpleSuccess('Expediente Modificado',`Expediente ${this.data_expediente_header.nro_expediente} modificado con exito` );
      }
    })  
  }

  LimpiarDatosPreparacion(){
    this.data_expediente_preparacion = {
      id_expediente: 0,
      id_responsable: 0,
      observaciones: '',
      copias_originales: false,
      copias_simples: false,
      fojas_total: null,
      fojas_unacara: null,
      fojas_doscaras: null
    }

    this.ListObservaciones = [];
    this.modificarPreparacion = false;
    this.observacion_temp = '';
  }


  // manejo de observaciones
  AgregarObservacion(){
    if(this.observacion_temp==''){
      alert('Debe escribir algo para agregar la observación')
      return;
    }
    const valor = this.observacion_temp;
    this.ListObservaciones.push(valor);
    this.observacion_temp = '';
  }

  EliminarObservacion(index: number) {
    this.ListObservaciones.splice(index, 1);
  }

  SubirObservacion(index: number) {
    if (index > 0) {
      const temp = this.ListObservaciones[index - 1];
      this.ListObservaciones[index - 1] = this.ListObservaciones[index];
      this.ListObservaciones[index] = temp;
    }
  }
  
  BajarObservacion(index: number) {
    if (index < this.ListObservaciones.length - 1) {
      const temp = this.ListObservaciones[index + 1];
      this.ListObservaciones[index + 1] = this.ListObservaciones[index];
      this.ListObservaciones[index] = temp;
    }
  }
  
}
