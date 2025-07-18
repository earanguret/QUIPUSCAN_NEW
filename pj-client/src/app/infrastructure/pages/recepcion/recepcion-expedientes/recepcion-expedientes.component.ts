import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NavegatorComponent } from '../../../shared/components/navegator/navegator.component';
import { SubnavegatorComponent } from '../../../shared/components/subnavegator/subnavegator.component';
import { CommonModule } from '@angular/common';
import { NgxPaginationModule } from 'ngx-pagination';
import { InventarioService } from '../../../services/remoto/inventario/inventario.service';
import { InventarioResponse } from '../../../../domain/dto/InventarioResponse.dto';
import { ExpedienteService } from '../../../services/remoto/expediente/expediente.service';
import { CrearExpedienteResponse, EliminarExpedienteResponse, ExpedienteResponse, ModificarExpedienteResponse } from '../../../../domain/dto/ExpedienteResponse.dto';
import { ExpedienteModel } from '../../../../domain/models/expediente.model';
import { form_inventario_creacion_vf } from '../../../validator/fromValidator/expediente.validator';
import { CredencialesService } from '../../../services/local/credenciales.service';
import { ExpedienteRequest } from '../../../../domain/dto/ExpedienteRequest.dto';
import { FormsModule } from '@angular/forms';
import { AlertaComponent } from '../../../shared/components/alerta/alerta.component';
import { EstadoService } from '../../../services/remoto/estado/estado.service';
import { CrearEstadoResponse, EliminarEstadoResponse } from '../../../../domain/dto/EstadoResponse.dto';
import { EstadoRequest } from '../../../../domain/dto/EstadoRequest.dto';
import { FlujogramaRequest } from '../../../../domain/dto/FlujogramaRequest.dto';
import { CrearFlujogramaResponse, EliminarFlujogramaResponse } from '../../../../domain/dto/FlujogramaResponse.dto';
import { FlujogramaService } from '../../../services/remoto/flujograma/flujograma.service';
import { switchMap } from 'rxjs';
import { SweetAlert } from '../../../shared/animate-messages/sweetAlert';

import { InfoInventarioComponent } from '../../../components/info-inventario/info-inventario.component';

declare var bootstrap: any;

@Component({
  selector: 'app-recepcion-expedientes',
  imports: [NavegatorComponent, SubnavegatorComponent, CommonModule, NgxPaginationModule, FormsModule, AlertaComponent, InfoInventarioComponent],
  templateUrl: './recepcion-expedientes.component.html',
  styleUrl: './recepcion-expedientes.component.css'
})
export class RecepcionExpedientesComponent implements OnInit {

  isLoading: boolean = false;
  private myModal: any;
  mensajeError: string = '';
  showCreateAlert = false;
  modificarExpediente = false;

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

  data_expediente: ExpedienteModel = {
    id_expediente: 0,
    nro_expediente: '',
    id_inventario: 0,
    id_responsable: 0,
    cod_paquete: '',
  }


  ListExpedientes: ExpedienteResponse[] = [];
  ListExpedientesTemp: ExpedienteResponse[] = [];
  p: number = 1;
  id_inventario: number = 0;

  constructor(
    private router: Router,
    private inventarioService: InventarioService,
    private activatedRoute: ActivatedRoute,
    private expedienteService: ExpedienteService,
    private credencialesService: CredencialesService,
    private estadoService: EstadoService,
    private flujogramaService: FlujogramaService,
    private sweetAlert: SweetAlert
  ) { }

  ngOnInit(): void {
    //this.ObtenerDatosInventario()
    this.id_inventario = this.activatedRoute.snapshot.params['id'];

    this.ObtenerListaExpedientes()


  }

  closeModal() {
    this.myModal.hide();
  }
  openModalCreate() {
    this.limpiarDatosInventario();
    this.modificarExpediente = false;
    this.myModal = new bootstrap.Modal(document.getElementById('exampleModalCenter'));
    this.myModal.show();
  }

  openModalEdit(data_expediente: any) {

    this.data_expediente ={
      id_expediente: data_expediente.id_expediente,
      nro_expediente: data_expediente.nro_expediente,
      id_inventario: data_expediente.id_inventario,
      id_responsable: data_expediente.id_responsable,
      cod_paquete: data_expediente.cod_paquete,
    }
    this.modificarExpediente = true;
    this.myModal = new bootstrap.Modal(document.getElementById('exampleModalCenter'));
    this.myModal.show();
    console.log(data_expediente)
  }

  limpiarDatosInventario() {
    this.mensajeError = '';
    this.modificarExpediente = false;
    this.data_expediente = {
      id_expediente: 0,
      nro_expediente: '',
      id_inventario: 0,
      id_responsable: 0,
      cod_paquete: '',
    }

  }

  RegistrarExpediente() {
    const params = this.activatedRoute.snapshot.params;
    let erroresValidacion = form_inventario_creacion_vf(this.data_expediente);
    if (erroresValidacion.length > 0) {
      let errorMensaje = '';

      erroresValidacion.forEach((error: any) => {
        errorMensaje = error.mensaje;
      });
      console.log(errorMensaje);
      this.mensajeError = errorMensaje;
      return;
    }
    this.data_expediente.id_responsable = this.credencialesService.credenciales.id_usuario;
    this.data_expediente.id_inventario = params['id'];
    let data_expediente_temp: ExpedienteRequest = { ...this.data_expediente, app_user: this.credencialesService.credenciales.username };

    this.expedienteService.CrearExpediente(data_expediente_temp).subscribe({
      next: (data: CrearExpedienteResponse) => {
        console.log(data);
        const id_expediente = data.expediente.id_expediente;
        this.CrearEstadoExpediente(id_expediente);
        this.crearFlujograma(id_expediente);
        this.limpiarDatosInventario();
        this.closeModal();
      },
      error: (error) => {

        if (error.status === 409) {
          this.mensajeError = 'Ya existe un expediente con ese número';
        } else {
          this.mensajeError = 'Error al registrar expediente. Intente más tarde.';
          console.error('Error al crear expediente:', error);
        }
        setTimeout(() => {
          this.mensajeError = '';
        }, 2000);
      },
      complete: () => {
        console.log('creacion de expediente completado');
        this.sweetAlert.MensajeToast('Expediente creado correctamente', 2000);
        setTimeout(() => {
          this.ObtenerListaExpedientes();
        }, 2000);
      }
    })
  }


  EliminarExpediente(id: number) {
    this.flujogramaService.EliminarFlujograma(id).pipe(
      switchMap((data1: EliminarFlujogramaResponse) => {
        console.log('Flujograma eliminado:', data1);
        return this.estadoService.EliminarEstado(id);
      }),
      switchMap((data2: EliminarEstadoResponse) => {
        console.log('Estado eliminado:', data2);
        return this.expedienteService.EliminarExpediente(id);
      })
    ).subscribe({
      next: (data3: EliminarExpedienteResponse) => {
        console.log('Expediente eliminado:', data3);
      },
      error: (error) => {
        console.error('Error durante la eliminación:', error);
      },
      complete: () => {
        console.log('Eliminación completa');
        this.ObtenerListaExpedientes();
      }
    });
  }

  ModificarExpediente() {
    let data_expediente_temp: ExpedienteRequest = { ...this.data_expediente, app_user: this.credencialesService.credenciales.username };
    this.expedienteService.ModificarExpediente(data_expediente_temp.id_expediente!, data_expediente_temp).subscribe({
      next: (data: ModificarExpedienteResponse) => {
        console.log(data);
      },
      error: (error) => {
        console.log(error);
      },
      complete: () => {
        console.log('modificacion de expediente completado');
        this.ObtenerListaExpedientes();
        this.closeModal();
      }
    })
  }

  CrearEstadoExpediente(id_expediente: number) {

    let data_estado: EstadoRequest = {
      id_expediente: id_expediente,
      app_user: this.credencialesService.credenciales.username
    }
    console.log(data_estado);
    this.estadoService.CrearEstado(data_estado).subscribe({
      next: (data: CrearEstadoResponse) => {
        console.log(data);
      },
      error: (error) => {
        console.log(error);
      },
      complete: () => {
        console.log('creacion de estado expediente completado');

      }
    })
  }

  crearFlujograma(id_expediente: number) {

    let data_flujograma: FlujogramaRequest = {
      id_expediente: id_expediente,
      id_responsable: this.credencialesService.credenciales.id_usuario,
      area: 'RECEPCION',
      app_user: this.credencialesService.credenciales.username
    }

    this.flujogramaService.CrearFlujograma(data_flujograma).subscribe({
      next: (data: CrearFlujogramaResponse) => {
        console.log(data);
      },
      error: (error) => {
        console.log(error);
      },
      complete: () => {
        console.log('creacion de flujograma completado');
      }
    })

  }

  EventAction() {
    if (this.modificarExpediente) {
      this.ModificarExpediente();
    } else {
      this.RegistrarExpediente();

    }
  }

  ObtenerListaExpedientes() {
    const params = this.activatedRoute.snapshot.params;
    this.expedienteService.ListarExpedientesXidInventario(params['id']).subscribe({
      next: (data: ExpedienteResponse[]) => {
        this.ListExpedientes = data;
        this.ListExpedientesTemp = data;
        console.log('lista de expedientes:');
        console.log(data)
      },
      error: (error) => {
        console.log(error);
      },
      complete: () => {
        console.log('listado de expedientes completado');
      }
    })
  }

  // ObtenerListaExpedientes() {
  //   this.expedienteService.ListarExpedientesXidInventario(this.id_inventario).subscribe({
  //     next: (data: ExpedienteResponse[]) => {
  //       this.ListExpedientes = data;
  //       console.log(this.ListExpedientes);

  //     },
  //     error: (error) => {
  //       console.log(error);
  //     },
  //     complete: () => {
  //       console.log('listado de expedientes completado');
  //     }
  //   })
  // }
  ObtenerDatosInventario() {
    const params = this.activatedRoute.snapshot.params;
    this.inventarioService.ObtenerInventarioDetalle(params['id']).subscribe({
      next: (data: InventarioResponse) => {

        this.data_inventario = data;
        console.log(this.data_inventario);
      },
      error: (error) => {
        console.log(error);
      },
      complete: () => {
        console.log('listado de inventarios completado');
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

  // EnviarExpedientesPreparacion() {
  //   this.isLoading = true;
  //     if (this.exp_count_pendientes > 0) {
  //       this.ListExpedientes.forEach((expediente: any) => {
  //         if (expediente.estado_preparado==null) {
  //           this.estadoService.AprobarPreparacion(expediente.id_expediente, this.credencialesService.credenciales.username).subscribe({
  //             next: (data:any) => {
  //               console.log(data);
  //             },
  //             error: (error) => {
  //               console.log(error);
  //             },
  //             complete: () => {
  //               console.log('expediente preparado');
  //               this.ObtenerListaExpedientes();
  //             }
  //           })
  //         }
  //       })
  //       setTimeout(() => {
  //         this.isLoading = false;
  //         this.ObtenerListaExpedientes();
  //       // mensaje : se enviaron los expedientes
  //       }, 2000);

  //     }
  //     else {
  //       this.isLoading = false;
  //       // mensaje : no hay expedientes pendientes
  //     }

  // }

}
