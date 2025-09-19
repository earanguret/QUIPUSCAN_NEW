import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NavegatorComponent } from '../../../shared/components/navegator/navegator.component';
import { SafeResourceUrl, DomSanitizer } from '@angular/platform-browser';
import { SubnavegatorComponent } from '../../../shared/components/subnavegator/subnavegator.component';
import { InfoInventarioComponent } from '../../../components/info-inventario/info-inventario.component';
import { ExpedienteResponse, ExpedienteResponseDataView } from '../../../../domain/dto/ExpedienteResponse.dto';
import { ExpedienteService } from '../../../services/remoto/expediente/expediente.service';
import { NgxPaginationModule } from 'ngx-pagination';
import { map } from 'rxjs';
import { FlujogramaRequest } from '../../../../domain/dto/FlujogramaRequest.dto';
import { CredencialesService } from '../../../services/local/credenciales.service';
import { FlujogramaService } from '../../../services/remoto/flujograma/flujograma.service';
import { CrearFlujogramaResponse } from '../../../../domain/dto/FlujogramaResponse.dto';
import { EstadoService } from '../../../services/remoto/estado/estado.service';
import { EstadoMensajesResponse, MensajeGuardarResponse, ModificarEstadoResponse } from '../../../../domain/dto/EstadoResponse.dto';
import { CommonModule } from '@angular/common';
import { FtpService } from '../../../services/remoto/ftp/ftp.service';
import { InventarioResponse } from '../../../../domain/dto/InventarioResponse.dto';
import { InventarioService } from '../../../services/remoto/inventario/inventario.service';
import { PreparacionService } from '../../../services/remoto/preparacion/preparacion.service';
import { PreparacionResponseDataView } from '../../../../domain/dto/PreparacionResponse.dto';
import { FormsModule } from '@angular/forms';
import { DigitalizacionResponseDataView } from '../../../../domain/dto/DigitalizacionResponse.dto';
import { DigitalizacionService } from '../../../services/remoto/digitalizacion/digitalizacion.service';
import { IndizacionResponseDataView } from '../../../../domain/dto/IndizacionResponse.dto';
import { IndizacionService } from '../../../services/remoto/indizacion/indizacion.service';
import { FechaConFormato } from '../../../functions/formateDate';
import { ControlRequest } from '../../../../domain/dto/ControlRequest.dto';
import { ControlService } from '../../../services/remoto/control/control.service';
import { ControlDataResponse, ControlResponseDataView, CrearControlResponse, ModificarControlResponse } from '../../../../domain/dto/ControlResponse.dto';
import { ControlModel } from '../../../../domain/models/Control.model';
import { Mensaje } from '../../../../domain/models/Mensaje.model';
import { mensajeRequest } from '../../../../domain/dto/EstadoRequest.dto';
import { SweetAlert } from '../../../shared/animate-messages/sweetAlert';

import { DataProgressViewComponent } from '../../../components/data-progress-view/data-progress-view.component';

declare var bootstrap: any;

@Component({
  selector: 'app-control-expedientes',
  imports: [NavegatorComponent, SubnavegatorComponent, InfoInventarioComponent, NgxPaginationModule, CommonModule, FormsModule, DataProgressViewComponent],
  templateUrl: './control-expedientes.component.html',
  styleUrl: './control-expedientes.component.css'
})
export class ControlExpedientesComponent implements OnInit {
  private myModalReception: any;
  private myModalControl: any;
  private myModalControlView: any;
  private myModalDesaprobar: any;
  private myModalDetalleIndice: any;
  id_inventario: number = 0;
  ListExpedientes: ExpedienteResponse[] = [];
  ListExpedientesTemp: ExpedienteResponse[] = [];
  MensajesExpedienteTemp: Mensaje[] = [];
  mostrar_mensajes_expediente: boolean = false;
  checkAprobado: boolean = false;


  nro_expediente_temp: string = '';
  id_expediente_temp: number = 0;
  modificarControl: boolean = false;
  codigo_inventario: string = '';
  pdfUrl: SafeResourceUrl | null = null;
  folderPath: string | null = null;
  p: number = 1;
  rechazoRazon: string = '';
  moduloSeleccionado: string = '';


  // data de cabecera de informacion
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

  data_preparacion_header: ExpedienteResponseDataView = {
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

  data_digitalizacion: DigitalizacionResponseDataView = {
    id_digitalizacion: 0,
    id_responsable: 0,
    id_expediente: 0,
    fojas_total: null,
    ocr: false,
    escala_gris: false,
    color: false,
    observaciones: '',
    dir_ftp: null,
    hash_doc: null,
    peso_doc: null,
    create_at: null,
    responsable: null,
    username: null,
  }

  data_indizacion: IndizacionResponseDataView = {
    id_indizacion: 0,
    id_responsable: 0,
    id_expediente: 0,
    indice: '',
    observaciones: '',
    juzgado_origen: '',
    tipo_proceso: '',
    materia: '',
    demandante: '',
    demandado: '',
    fecha_inicial: new Date(),
    fecha_final: new Date(),
    create_at: null,
    responsable: null,
    username: null,
  }

  ListObservacionesPreparacion: string[] = [];
  ListObservacionesDigitalizacion: string[] = [];
  ListObservacionesIndizacion: string[] = [];
  ListObservacionesControl: string[] = [];
  ListDamandantes: any[] = []
  ListDamandados: any[] = []
  dataIndice: any = [];

  data_control_temp: ControlResponseDataView = {
    id_control: 0,
    id_responsable: 0,
    id_expediente: 0,
    observaciones: '',
    val_observaciones: null,
    val_datos: null,
    val_nitidez: null,
    val_pruebas_impresion: null,
    val_copia_fiel: null,
    create_at: null,
    responsable: null,
    username: null,
  }

  data_control: ControlModel = {
    id_responsable: 0,
    id_expediente: 0,
    observaciones: '',
    val_observaciones: null,
    val_datos: null,
    val_nitidez: null,
    val_pruebas_impresion: null,
    val_copia_fiel: null,
  }


  constructor(
    private activatedRoute: ActivatedRoute,
    private expedienteService: ExpedienteService,
    private credencialesService: CredencialesService,
    private flujogramaService: FlujogramaService,
    private estadoService: EstadoService,
    private sanitizer: DomSanitizer,
    private ftpService: FtpService,
    private inventarioService: InventarioService,
    private preparacionService: PreparacionService,
    private digitalizacionService: DigitalizacionService,
    private indizacionService: IndizacionService,
    private controlService: ControlService,
    private sweetAlert: SweetAlert,
  ) { }

  ngOnInit(): void {
    this.inicializadorModales();
    this.id_inventario = this.activatedRoute.snapshot.params['id'];
    this.ListarExpedientes();
    this.ObternerCodigoInventario()
    this.pdfUrl = this.sanitizer.bypassSecurityTrustResourceUrl(`img/carga_error/error_carga.pdf`);
  }

  inicializadorModales() {
    this.myModalDetalleIndice = new bootstrap.Modal(document.getElementById('Modal_detalle_indice'), {
      backdrop: false,
      keyboard: true
    });

    this.myModalReception = new bootstrap.Modal(document.getElementById('ModalReception'), {
      backdrop: true,
      keyboard: true
    });

    this.myModalControl = new bootstrap.Modal(document.getElementById('ModalControl'), {
      backdrop: true,
      keyboard: true
    });

    this.myModalControlView = new bootstrap.Modal(document.getElementById('ModalControlView'), {
      backdrop: true,
      keyboard: true
    });

    this.myModalDesaprobar = new bootstrap.Modal(document.getElementById('exampleModalCenter_desaprobar'), {
      backdrop: false,
      keyboard: false
    });
  }

  closeModalControlView() {
    this.myModalControlView.hide();
  }
  mostrarControl: boolean = false;

  openModalControlView(id_expediente: number) {
    this.mostrarControl = false; // fuerza destrucción del componente si ya estaba
    this.id_expediente_temp = id_expediente;
    setTimeout(() => {
      this.mostrarControl = true;
      this.myModalControlView.show();
    });
  }

  openModalReception(id_expediente: number) {
    this.id_expediente_temp = id_expediente;
    this.modificarControl = false;
    this.myModalReception.show();
  }

  closeModalReception() {
    this.myModalReception.hide();
  }

  openModalControl(id_expediente: number, nro_expediente: string, modificar_control: boolean) {

    this.id_expediente_temp = id_expediente;
    this.recuperarFile(nro_expediente);
    this.ObtenerExpedienteDataViewXid(id_expediente)
    this.recuperarDataPreparacion(id_expediente);
    this.recuperarDataDigitalizacion(id_expediente);
    this.recuperarDataIndizacion(id_expediente);
    this.ObtenerMensajesById_expediente(id_expediente);
    this.RecuperarDatosControlView(id_expediente)
    this.mostrar_mensajes_expediente = false;

    if (modificar_control === true) {
      this.modificarControl = true;
      this.RecuperarDatosControl(id_expediente)
      this.myModalControl.show();

    }
    if (modificar_control === false) {
      this.LimpiarControl()
      this.modificarControl = false;
      this.myModalControl.show();
    }
  }

  closeModalControl() {
    this.myModalControl.hide();
  }

  openModalDesaprobar() {
    this.limpiarModarDsaprobar();
    this.myModalDesaprobar.show();
  }

  closeModalDesaprobar() {
    this.myModalDesaprobar.hide();
  }

  limpiarModarDsaprobar() {
    this.rechazoRazon = '';
    this.moduloSeleccionado = '';
  }

  informacionTags(expedientes: ExpedienteResponse[]) {
    this.nro_expedientes = expedientes.length;
    this.nro_concluidos = expedientes.filter(e => e.estado_controlado === 'T').length;
    this.nro_pendientes = expedientes.filter(e => e.estado_controlado === null || e.estado_controlado === 'A').length;
    this.nro_rechazados = expedientes.filter(e => e.estado_controlado === 'R').length;
    this.ObternerExpedientesRechazadosControl()
  }

  ObternerExpedientesRechazadosControl() {
    this.expedienteService.ListarExpedientesXidInventario(this.id_inventario)
      .pipe(
        map((data: ExpedienteResponse[]) =>
          data.filter(exp => exp.estado_controlado === 'R')
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

  openModalDetalleIndice(items: any[], index: number) {
    console.log('datos detalle indice', items[index]);

    this.myModalDetalleIndice.show();

    // Setear valores
    (<HTMLInputElement>document.getElementById('indizacion_descripcion_2')).value = items[index].descripcion;
    (<HTMLInputElement>document.getElementById('indizacion_indice_2')).value = items[index].indice;
    (<HTMLInputElement>document.getElementById('indizacion_fojas_2')).value = items[index].fojas;
    (<HTMLInputElement>document.getElementById('fecha_indice_2')).value = items[index].fecha;
    (<HTMLInputElement>document.getElementById('indizacion_textarea_2')).value = items[index].check_textarea;
    (<HTMLInputElement>document.getElementById('indizacion_radio_original_2')).checked = items[index].check_original;
    (<HTMLInputElement>document.getElementById('indizacion_radio_copia_2')).checked = items[index].check_copia;
    (<HTMLInputElement>document.getElementById('indizacion_radio_copia_certificada_2')).checked = items[index].check_copia_certificada;
    (<HTMLInputElement>document.getElementById('indizacion_radio_copia_copia_certificada_2')).checked = items[index].check_copia_copia_certificada;
  }

  closeModalDetalleIndice() {
    this.myModalDetalleIndice.hide();
  }

  LimpiarControl() {
    this.data_control = {
      id_expediente: 0,
      id_responsable: 0,
      observaciones: '',
      val_observaciones: null,
      val_datos: null,
      val_nitidez: null,
      val_pruebas_impresion: null,
      val_copia_fiel: null,
    }

    this.ListObservacionesControl = [];
    this.data_control_temp = {
      id_expediente: 0,
      id_control: 0,
      id_responsable: 0,
      observaciones: '',
      val_observaciones: null,
      val_datos: null,
      val_nitidez: null,
      val_pruebas_impresion: null,      
      val_copia_fiel: null,  
      create_at: null,
      responsable: null,
      username: null, 
    }
  }

  ObtenerMensajesById_expediente(id_expediente: number) {
    this.estadoService.ObtenerMensajesById_expediente(id_expediente).subscribe({
      next: (data: EstadoMensajesResponse) => {
        try {
          // Si data es un string JSON, lo parsea. Si ya es array, lo usa directamente.
          const mensajes = typeof data === 'string' ? JSON.parse(data) : data;
          this.MensajesExpedienteTemp = Array.isArray(mensajes) ? mensajes : [];
          console.log('Mensajes cargados:', this.MensajesExpedienteTemp);
        } catch (e) {
          console.error('Error al parsear mensajes:', e);
          this.MensajesExpedienteTemp = [];
        }
      },
      error: (error) => {
        console.error(error);
        this.MensajesExpedienteTemp = [];
      },
      complete: () => {
        console.log('listado de mensajes completado');
      }
    });
  }


  ObtenerExpedienteDataViewXid(id_expediente: number) {
    this.expedienteService.ObtenerExpedienteDataViewXid(id_expediente).subscribe({
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

  obtenerExpedienteTem(expediente_temp: ExpedienteResponse) {
    this.data_expediente_temp = expediente_temp;
    console.log(this.data_expediente_temp)
  }

  recuperarFile(nro_expediente_temp: string) {
    let fileName = nro_expediente_temp + '.pdf';
    let folderPath = this.folderPath!;
    console.log(folderPath);
    console.log(fileName);
    this.ftpService.downloadFile(fileName, folderPath).subscribe({
      next: (data: Blob) => {
        console.log(data);
        let temp = new Blob([data], { type: 'application/pdf' });
        this.pdfUrl = this.sanitizer.bypassSecurityTrustResourceUrl(URL.createObjectURL(temp));
      },
      error: (error) => {
        console.log(error);
      },
      complete: () => {
        console.log('recuperacion de archivo completada');
      }
    })
  }

  recuperarDataPreparacion(id_expediente: number) {
    this.preparacionService.ObtenerPreparacionDataViewXidExpediente(id_expediente).subscribe({
      next: (data: PreparacionResponseDataView) => {
        this.data_preparacion = data;
        this.ListObservacionesPreparacion = data.observaciones?.split('|') ?? [];
      },
      error: (error) => {
        console.log(error);
      },
      complete: () => {
        console.log('listado de preparacion detalle completado');
      }
    })
  }

  recuperarDataDigitalizacion(id_expediente: number) {
    this.digitalizacionService.ObtenerDigitalizacionDataViewXidExpediente(id_expediente).subscribe({
      next: (data: DigitalizacionResponseDataView) => {
        this.data_digitalizacion = data;
        this.ListObservacionesDigitalizacion = data.observaciones?.split('|') ?? [];
        console.log(this.data_digitalizacion);
      },
      error: (error) => {
        console.log(error);
      },
      complete: () => {
        console.log('listado de digitalizacion detalle completado');
      }
    })
  }

  recuperarDataIndizacion(id_expediente: number) {
    this.indizacionService.ObtenerIndizacionDataViewXidExpediente(id_expediente).subscribe({
      next: (data: IndizacionResponseDataView) => {
        this.data_indizacion = data;
        this.ListObservacionesIndizacion = data?.observaciones ? data.observaciones.split('|') : [];
        this.ListDamandantes = JSON.parse(data.demandante ? data.demandante : '[]');
        this.ListDamandados = JSON.parse(data.demandado ? data.demandado : '[]');
        (document.getElementById('fecha_inicio') as HTMLInputElement).value = FechaConFormato(data.fecha_inicial!);
        (document.getElementById('fecha_final') as HTMLInputElement).value = FechaConFormato(data.fecha_final!);
        this.dataIndice = JSON.parse(data.indice ? data.indice : '[]')
      },
      error: (error) => {
        console.log(error);
      },
      complete: () => {
        console.log('listado de indizacion detalle completado');
      }
    })
  }

  RecuperarDatosControl(id_expediente: number) {
    this.controlService.ObtenerDatosControl(id_expediente).subscribe({
      next: (data: ControlDataResponse) => {
        this.data_control.id_control = data.id_control;
        this.data_control.id_responsable = data.id_responsable;
        this.data_control.id_expediente = data.id_expediente;
        this.data_control.observaciones = data.observaciones;
        this.data_control.val_observaciones = data.val_observaciones;
        this.data_control.val_datos = data.val_datos;
        this.data_control.val_nitidez = data.val_nitidez;
        this.data_control.val_pruebas_impresion = data.val_pruebas_impresion;
        this.data_control.val_copia_fiel = data.val_copia_fiel;
        this.ListObservacionesControl = data.observaciones?.split('|') ?? [];
      },
      error: (error) => {
        console.log(error);
      },
      complete: () => {
        console.log('listado de control detalle completado');
      }
    })
  }

  RecuperarDatosControlView(id_expediente: number) {
    this.controlService.ObtenerControlDataViewXidExpediente(id_expediente).subscribe({
      next: (data: ControlResponseDataView) => {
        this.data_control_temp = data;
      },
      error: (error) => {
        console.log(error);
      },
      complete: () => {
        console.log('listado de control detalle completado');
      }
    })
  }

  ObternerCodigoInventario() {
    const params = this.activatedRoute.snapshot.params;
    this.inventarioService.ObtenerInventarioDetalle(params['id']).subscribe({
      next: (data: InventarioResponse) => {
        this.codigo_inventario = data.codigo;
        this.folderPath = this.codigo_inventario + '/EXPEDIENTES';
      },
      error: (error) => {
        console.log(error);
      },
      complete: () => {
        console.log('listado de inventarios completado');
      }
    })
  }

  EventAction() {
    if (this.modificarControl) {
      this.ModificarControl()

    } else {
      this.GuardarControl()
    }
  }

  GuardarControl() {
    const data_control_request: ControlRequest = {
      id_responsable: this.credencialesService.credenciales.id_usuario,
      id_expediente: this.id_expediente_temp,
      observaciones: this.ListObservacionesControl.length ? this.ListObservacionesControl.join('|') : null,
      val_observaciones: this.data_control.val_observaciones,
      val_datos: this.data_control.val_datos,
      val_nitidez: this.data_control.val_nitidez,
      val_pruebas_impresion: this.data_control.val_pruebas_impresion,
      val_copia_fiel: this.data_control.val_copia_fiel,
      app_user: this.credencialesService.credenciales.username
    }
    console.log(data_control_request)
    this.controlService.CrearControl(data_control_request).subscribe({
      next: (data: CrearControlResponse) => {
        console.log(data.message);
      },
      error: (error) => {
        console.log(error);
      },
      complete: () => {
        console.log('Aprobacion de control completado');
        this.EstadoControlTrabajado()
        this.closeModalControl();
        this.sweetAlert.MensajeSimpleSuccess('Expediente Controlado', `Expediente ${this.data_preparacion_header.nro_expediente} paso el control de calidad con exito`);
      }
    })
  }

  ModificarControl() {
    const data_control_request: ControlRequest = {
      id_responsable: this.credencialesService.credenciales.id_usuario,
      id_expediente: this.id_expediente_temp,
      observaciones: this.ListObservacionesControl.length ? this.ListObservacionesControl.join('|') : null,
      val_observaciones: this.data_control.val_observaciones,
      val_datos: this.data_control.val_datos,
      val_nitidez: this.data_control.val_nitidez,
      val_pruebas_impresion: this.data_control.val_pruebas_impresion,
      val_copia_fiel: this.data_control.val_copia_fiel,
      app_user: this.credencialesService.credenciales.username
    }

    this.controlService.ModificarControl(this.id_expediente_temp, data_control_request).subscribe({
      next: (data: ModificarControlResponse) => {
        console.log(data.message);
      },
      error: (error) => {
        console.log(error);
      },
      complete: () => {
        console.log('modificacion de control completado');
        this.EstadoControlTrabajado()
        this.closeModalControl();
        this.sweetAlert.MensajeSimpleSuccess('Expediente Modificado', `Expediente ${this.data_preparacion_header.nro_expediente} modificado con exito`);
      }
    })
  }

  EstadoControlTrabajado() {
    this.estadoService.TrabajadoControl(this.id_expediente_temp, this.credencialesService.credenciales.username).subscribe({
      next: (data: ModificarEstadoResponse) => {
        console.log(data.message);
      },
      error: (error) => {
        console.log(error);
      },
      complete: () => {
        console.log('estado control de calidad trabajado correctamente');
        this.ListarExpedientes();
      }
    })
  }

  ListarExpedientes() {
    this.expedienteService.ListarExpedientesXidInventario(this.id_inventario)
      .pipe(
        map((data: ExpedienteResponse[]) =>
          data.filter(exp => exp.estado_indizado === 'T')
        )
      )
      .subscribe({
        next: (dataFiltrada: ExpedienteResponse[]) => {
          this.ListExpedientes = dataFiltrada;
          this.ListExpedientesTemp = dataFiltrada;
          this.informacionTags(this.ListExpedientesTemp);
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

  RecepcionFlujograma() {
    let data_flujograma: FlujogramaRequest = {
      id_expediente: this.id_expediente_temp,
      id_responsable: this.credencialesService.credenciales.id_usuario,
      app_user: this.credencialesService.credenciales.username,
      area: 'CONTROL'
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
        this.EstadoIndizacionAceptado()
        this.closeModalReception();

        const esRecepcionado = this.data_expediente_temp.estado_fedatado === 'R';

        this.openModalControl(this.data_expediente_temp.id_expediente, this.data_expediente_temp.nro_expediente, esRecepcionado);
      }
    })
  }

  EstadoIndizacionAceptado() {
    this.estadoService.RecepcionarControl(this.id_expediente_temp, this.credencialesService.credenciales.username).subscribe({
      next: (data: ModificarEstadoResponse) => {
        console.log(data.message);
      },
      error: (error) => {
        console.log(error);
      },
      complete: () => {
        console.log('estado digitalizacion aceptado correctamente');
        this.ListarExpedientes();
      }
    })
  }

  rechazarExpediente() {
    const razon = this.rechazoRazon?.toUpperCase();
    const destino = this.moduloSeleccionado;

    if (!destino || !razon) {
      // console.warn('Debe seleccionar un módulo y proporcionar una razón');
      alert('Debe seleccionar un módulo y proporcionar una razón');
      return;
    }

    const idExpediente = this.data_expediente_temp.id_expediente;
    const usuario = this.credencialesService.credenciales.username;

    // Mapa de funciones por módulo
    const rechazarFnMap = {
      DIGITALIZACION: () =>
        this.estadoService.RechazarControlDigitalizacion(idExpediente, usuario),
      INDIZACION: () =>
        this.estadoService.RechazarControlIndizacion(idExpediente, usuario)
    };

    const rechazarFn = rechazarFnMap[destino as keyof typeof rechazarFnMap];

    if (!rechazarFn) {
      console.error('Destino no soportado:', destino);
      return;
    }

    rechazarFn().subscribe({
      next: (data: ModificarEstadoResponse) => console.log(data.message),
      error: (error) => console.error(error),
      complete: () => {
        console.log(`rechazo a ${destino} exitoso`);
        this.ListarExpedientes();

        const nuevoMensaje: Mensaje = {
          area_remitente: 'CONTROL',
          responsable: usuario,
          destino,
          fecha: new Date(),
          mensaje: razon,
          respuestas: []
        };

        this.MensajesExpedienteTemp.push(nuevoMensaje);

        const dataMessage: mensajeRequest = {
          mensaje: JSON.stringify(this.MensajesExpedienteTemp),
          app_user: usuario
        };

        this.estadoService.GuardarMensajeById_expediente(idExpediente, dataMessage).subscribe({
          next: (data: MensajeGuardarResponse) => console.log(data.message),
          error: (error) => console.error(error),
          complete: () => {
            console.log('guardar mensaje exitosa');
            this.closeModalControl();
            this.closeModalDesaprobar();
            this.sweetAlert.MensajeSimpleInfo('EXPEDIENTE RECHAZADO', `El expediente ${this.data_expediente_temp.nro_expediente} ha sido rechazado correctamente`);
            this.ListarExpedientes();
          }
        });
      }
    });
  }

  // ---------------------------------------------------------------------------

  AgregarObservacion() {
    const valor = (document.getElementById('observacion') as HTMLInputElement).value;
    this.ListObservacionesControl.push(valor);
    (document.getElementById('observacion') as HTMLInputElement).value = '';
  }

  EliminarObservacion(index: number) {
    this.ListObservacionesControl.splice(index, 1);
  }

  SubirObservacion(index: number) {
    if (index > 0) {
      const temp = this.ListObservacionesControl[index - 1];
      this.ListObservacionesControl[index - 1] = this.ListObservacionesControl[index];
      this.ListObservacionesControl[index] = temp;
    }
  }

  BajarObservacion(index: number) {
    if (index < this.ListObservacionesControl.length - 1) {
      const temp = this.ListObservacionesControl[index + 1];
      this.ListObservacionesControl[index + 1] = this.ListObservacionesControl[index];
      this.ListObservacionesControl[index] = temp;
    }
  }



}
