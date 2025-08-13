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
import { CrearPreparacionResponse, ModificarPreparacionResponse, PreparacionResponse } from '../../../../domain/dto/PreparacionResponse.dto';
import { form_preparacion_vf } from '../../../validator/fromValidator/preparacion.validator';
import { SweetAlert } from '../../../shared/animate-messages/sweetAlert';

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
  private myModal: any;

  ListExpedientes: ExpedienteResponse[] = [];
  ListExpedientesTemp: ExpedienteResponse[] = [];

  ListObservaciones: string[] = [];

  id_expediente_temp: number = 0;
  nro_expediente_temp: string = '';
  observacion_temp: string = '';

  checkAprobado: boolean = false;

  data_preparacion_header: ExpedienteResponseDataView = {
    id_expediente: 0,
    nro_expediente: '',
    id_inventario: 0,
    id_responsable: 0,
    cod_paquete: '',
    responsable: null,
    create_at: null,
    username: null,
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
    this.id_inventario = this.activatedRoute.snapshot.params['id'];
    this.ListarExpedientes();
    
  }

  ListarExpedientes() {
    this.expedienteService.ListarExpedientesXidInventario(this.id_inventario).subscribe({
      next: (data: ExpedienteResponse[]) => {
        this.ListExpedientes = data;
        this.ListExpedientesTemp = data;
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

  closeModal() {
    this.myModal.hide();
    this.LimpiarDatosPreparacion();
    
  }

  openModalReception(id_expediente:number) {

    this.modificarPreparacion = false;
    this.myModal = new bootstrap.Modal(document.getElementById('exampleModalReception'));
    this.myModal.show();
    this.id_expediente_temp = id_expediente;

  }

  openModalPreparation(id_expediente:number) {
    this.id_expediente_temp = id_expediente;
    this.myModal = new bootstrap.Modal(document.getElementById('exampleModalpreparation'));
    this.myModal.show();
  }

  ObtenerExpedienteDataViewXid(expediente:any) {
    console.log('expediente recuperado:',expediente)
    this.expedienteService.ObtenerExpedienteDataViewXid(expediente.id_expediente).subscribe({
      next: (data: ExpedienteResponseDataView) => {
        this.data_preparacion_header = data;
      },
      error: (error) => {
        console.log(error);
      },
      complete: () => {
        console.log('listado de preparacion detalle completado');
      }
    })
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
        this.EstadoPreparacionAceptado()
       

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
        this.closeModal();
        this.sweetAlert.MensajeSimpleSuccess('Expediente preparado',`Expediente ${this.data_preparacion_header.nro_expediente} Preparado con exito` );
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
        this.openModalPreparation(id_expediente);
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
        this.closeModal();
        this.sweetAlert.MensajeSimpleSuccess('Expediente Modificado',`Expediente ${this.data_preparacion_header.nro_expediente} modificado con exito` );
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

  // 

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
