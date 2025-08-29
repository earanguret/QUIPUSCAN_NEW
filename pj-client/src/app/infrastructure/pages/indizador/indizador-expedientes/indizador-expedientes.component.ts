import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NavegatorComponent } from '../../../shared/components/navegator/navegator.component';
import { SubnavegatorComponent } from '../../../shared/components/subnavegator/subnavegator.component';
import { ExpedienteResponse, ExpedienteResponseDataView } from '../../../../domain/dto/ExpedienteResponse.dto';
import { NgxPaginationModule } from 'ngx-pagination';
import { InfoInventarioComponent } from '../../../components/info-inventario/info-inventario.component';
import { ExpedienteService } from '../../../services/remoto/expediente/expediente.service';
import { map } from 'rxjs/operators';
import { CommonModule } from '@angular/common';
import { FlujogramaRequest } from '../../../../domain/dto/FlujogramaRequest.dto';
import { CrearFlujogramaResponse } from '../../../../domain/dto/FlujogramaResponse.dto';
import { CredencialesService } from '../../../services/local/credenciales.service';
import { FlujogramaService } from '../../../services/remoto/flujograma/flujograma.service';
import { EstadoService } from '../../../services/remoto/estado/estado.service';
import { EstadoMensajesResponse, MensajeGuardarResponse, ModificarEstadoResponse } from '../../../../domain/dto/EstadoResponse.dto';
import { SafeResourceUrl, DomSanitizer } from '@angular/platform-browser';
import { FtpService } from '../../../services/remoto/ftp/ftp.service';
import { InventarioService } from '../../../services/remoto/inventario/inventario.service';
import { InventarioResponse } from '../../../../domain/dto/InventarioResponse.dto';
import { form_indizacion_creacion_vf, form_indizacion_modificar_vf } from '../../../validator/fromValidator/indizacion.validator';
import { IndizacionRequest } from '../../../../domain/dto/IndizacionRequest.dto';
import { IndizacionModel } from '../../../../domain/models/Indizacion.model';
import { FormsModule } from '@angular/forms';
import { IndizacionService } from '../../../services/remoto/indizacion/indizacion.service';
import { CrearIndizacionResponse, IndizacionDataResponse, ModificarIndizacionResponse } from '../../../../domain/dto/IndizacionResponse.dto';
import { FechaConFormato } from '../../../functions/formateDate';
import { PreparacionResponseDataView } from '../../../../domain/dto/PreparacionResponse.dto';
import { DigitalizacionResponseDataView } from '../../../../domain/dto/DigitalizacionResponse.dto';
import { PreparacionService } from '../../../services/remoto/preparacion/preparacion.service';
import { DigitalizacionService } from '../../../services/remoto/digitalizacion/digitalizacion.service';
import { Mensaje, Respuesta } from '../../../../domain/models/Mensaje.model';
import { mensajeRequest } from '../../../../domain/dto/EstadoRequest.dto';
import { SweetAlert } from '../../../shared/animate-messages/sweetAlert';
import { datalistDistJudiciales } from '../../../../../../public/info/juzgados.info';
import { dataListProceso } from '../../../../../../public/info/proceso.info';
import { dataListMateria } from '../../../../../../public/info/materia.info';


declare var bootstrap: any;


@Component({
  selector: 'app-indizador-expedientes',
  imports: [NavegatorComponent, SubnavegatorComponent, NgxPaginationModule, InfoInventarioComponent, CommonModule, FormsModule],
  templateUrl: './indizador-expedientes.component.html',
  styleUrl: './indizador-expedientes.component.css'
})
export class IndizadorExpedientesComponent implements OnInit {
  private myModalReception: any;
  private myModalIndizacion: any;
  private myModalIndice: any;
  private myModalSubIndice: any;
  id_inventario: number = 0;
  checkAprobado: boolean = false;
  p: number = 1;
  modificarIndizacion: boolean = false;
  codigo_inventario: string = '';
  dataIndice: any = [];
  mostrar_mensajes_expediente: boolean = false;
  MensajesExpedienteTemp: Mensaje[] = [];

  mostrarPopupIndex: number | null = null; // Índice del mensaje con popup abierto
  nuevaRespuesta: string = '';

  listDistJudiciales: string[] = datalistDistJudiciales;
  listTipoProceso: string[] = dataListProceso;
  listMateria: string[] = dataListMateria;

    // data de cabecera de informacion
    nro_expedientes: number = 0;
    nro_concluidos: number = 0;
    nro_pendientes: number = 0;
    nro_rechazados: number = 0;
    list_expedinete_rechazados: ExpedienteResponse[] = [];

  togglePopup(index: number) {
    this.mostrarPopupIndex = this.mostrarPopupIndex === index ? null : index;
    console.log(this.mostrarPopupIndex)
  }

  cerrarPopup() {
    this.mostrarPopupIndex = null;
    this.nuevaRespuesta = ''
  }

  ListExpedientes: ExpedienteResponse[] = [];
  ListExpedientesTemp: ExpedienteResponse[] = [];
  observacion_temp: string = '';

  ListDamandantes: any[] = []
  ListDamandados: any[] = []
  ListObservaciones: string[] = [];
  ListObservacionesPreparacion: string[] = [];
  ListObservacionesDigitalizacion: string[] = [];

  nro_expediente_temp: string = '';
  id_expediente_temp: number = 0;
  folderPath: string | null = null;

  index: number = 0//indice de la lista demandante o demandado
  index_indizacion: number = 0//indice del la lista de indizacion
  itemTemp: any = []//item temporal
  modificar_parte = false//condicional que permitira modificar parte
  // modificar_indizacion = false

  pdfUrl: SafeResourceUrl | null = null;

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

  dataIndizacion: IndizacionModel = {
    id_responsable: 0,
    id_expediente: 0,
    indice: '',
    observaciones: '',
    juzgado_origen: '',
    tipo_proceso: '',
    materia: '',
    demandante: '',
    demandado: '',
    fecha_inicial: null,
    fecha_final: null,
  }

  constructor(private router: Router,
    private expedienteService: ExpedienteService,
    private activatedRoute: ActivatedRoute,
    private sanitizer: DomSanitizer,
    private credencialesService: CredencialesService,
    private flujogramaService: FlujogramaService,
    private estadoService: EstadoService,
    private ftpService: FtpService,
    private inventarioService: InventarioService,
    private preparacionService: PreparacionService,
    private sweetAlert: SweetAlert,
    private digitalizacionService: DigitalizacionService,
    private indizacionService: IndizacionService) { }

  ngOnInit(): void {
    this.id_inventario = this.activatedRoute.snapshot.params['id'];
    this.ListarExpedientes()
    this.pdfUrl = this.sanitizer.bypassSecurityTrustResourceUrl(`img/carga_error/error_carga.pdf`);
    this.ObternerCodigoInventario()
    console.log('Opciones cargadas:', this.listDistJudiciales);
   
  }

  closeModalReception() {
    this.myModalReception.hide();
    this.pdfUrl = this.sanitizer.bypassSecurityTrustResourceUrl(`img/carga_error/error_carga.pdf`);
  }

  openModalReception(id_expediente: number) {
    this.id_expediente_temp = id_expediente;
    this.modificarIndizacion = false;
    this.myModalReception = new bootstrap.Modal(document.getElementById('ModalReception'));
    this.myModalReception.show();
  }

  openModalIndizacion(id_expediente: number, nro_expediente: string, modificar_indizacion: boolean) {

    this.recuperarFile(nro_expediente)
    this.id_expediente_temp = id_expediente;
    this.ObtenerExpedienteDataViewXid(id_expediente)
    this.recuperarDataPreparacion(id_expediente)
    this.recuperarDataDigitalizacion(id_expediente)
    this.ObtenerMensajesById_expediente(id_expediente)
    if (modificar_indizacion === true) {
      this.modificarIndizacion = true;
      this.ObtenerIndizacionById_expediente(id_expediente)
      this.myModalIndizacion = new bootstrap.Modal(document.getElementById('ModalIndizacion'));
      this.myModalIndizacion.show();

    }
    if (modificar_indizacion === false) {
      this.LimpiarIndizacion();
      this.modificarIndizacion = false;
      this.myModalIndizacion = new bootstrap.Modal(document.getElementById('ModalIndizacion'));
      this.myModalIndizacion.show();
    }
  }

  closeModalIndizacion() {
    this.myModalIndizacion.hide();
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

  LimpiarIndizacion() {
    this.dataIndizacion = {
      id_responsable: 0,
      id_expediente: 0,
      indice: '',
      observaciones: '',
      juzgado_origen: '',
      tipo_proceso: '',
      materia: '',
      demandante: '',
      demandado: '',
      fecha_inicial: null,
      fecha_final: null,
    }

    this.dataIndice = []
    this.ListDamandados = []
    this.ListDamandantes = []
    this.ListObservaciones = []
    this.modificarIndizacion = false
    this.observacion_temp = '';

  }
  ListarExpedientes() {
    this.expedienteService.ListarExpedientesXidInventario(this.id_inventario)
      .pipe(
        map((data: ExpedienteResponse[]) =>
          data.filter(exp => exp.estado_digitalizado === 'T')
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

  informacionTags(expedientes: ExpedienteResponse[]) {
    this.nro_expedientes = expedientes.length;
    this.nro_concluidos = expedientes.filter(e => e.estado_indizado === 'T').length;
    this.nro_pendientes = expedientes.filter(e => e.estado_indizado === null || e.estado_indizado === 'A').length;
    this.nro_rechazados = expedientes.filter(e => e.estado_indizado === 'R').length;
    this.ObternerExpedientesRechazadosIndizacion()
  }

  ObternerExpedientesRechazadosIndizacion() {
    this.expedienteService.ListarExpedientesXidInventario(this.id_inventario)
    .pipe(
      map((data: ExpedienteResponse[]) =>
        data.filter(exp => exp.estado_indizado === 'R')
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

  obtenerExpedienteTemp(expediente: ExpedienteResponse) {
    this.data_expediente_temp = expediente;
  }

  RecepcionFlujograma() {
    let data_flujograma: FlujogramaRequest = {
      id_expediente: this.id_expediente_temp,
      id_responsable: this.credencialesService.credenciales.id_usuario,
      app_user: this.credencialesService.credenciales.username,
      area: 'INDIZACION'
    }
    this.flujogramaService.CrearFlujograma(data_flujograma).subscribe({
      next: (data: CrearFlujogramaResponse) => {
        console.log(data.message);
      },
      error: (error) => {
        console.log(error);
      },
      complete: () => {
        this.EstadoIndizacionAceptado();

        const esRecepcionado = this.data_expediente_temp.estado_indizado == 'R';
        this.openModalIndizacion(this.data_expediente_temp.id_expediente, this.data_expediente_temp.nro_expediente, esRecepcionado);

        this.closeModalReception();
      }
    })
  }

  EstadoIndizacionAceptado() {
    this.estadoService.RecepcionarIndizacion(this.id_expediente_temp, this.credencialesService.credenciales.username).subscribe({
      next: (data: ModificarEstadoResponse) => {
        console.log(data.message);
      },
      error: (error) => {
        console.log(error);
      },
      complete: () => {
        console.log('estado indizacion aceptado correctamente');
        this.ListarExpedientes();
      }
    })
  }

  EstadoIndizacionTrabajado() {
    this.estadoService.TrabajadoIndizacion(this.id_expediente_temp, this.credencialesService.credenciales.username).subscribe({
      next: (data: ModificarEstadoResponse) => {
        console.log(data.message);
      },
      error: (error) => {
        console.log(error);
      },
      complete: () => {
        console.log('estado indizacion aceptado correctamente');
        this.ListarExpedientes();
      }
    })
  }

  EventAction() {
    if (this.modificarIndizacion) {
      this.ModificarDatosIndizacion();

    } else {
      this.GuardarDatosIndizacion();
    }
  }


  ObtenerIndizacionById_expediente(id_expediente: number) {
    this.indizacionService.ObtenerIndizacionById_expediente(id_expediente).subscribe({
      next: (data: IndizacionDataResponse) => {
        console.log('data indizacion recuperada:', data);
        this.dataIndizacion.juzgado_origen = data.juzgado_origen!;
        this.dataIndizacion.tipo_proceso = data.tipo_proceso!;
        this.dataIndizacion.materia = data.materia!;
        this.ListDamandantes = JSON.parse(data.demandante ? data.demandante : '[]');
        this.ListDamandados = JSON.parse(data.demandado ? data.demandado : '[]');
        this.dataIndizacion.fecha_inicial = FechaConFormato(data.fecha_inicial!);;
        this.dataIndizacion.fecha_final = FechaConFormato(data.fecha_final!);
        // (document.getElementById('fecha_inicio') as HTMLInputElement).value = FechaConFormato(data.fecha_inicial!);
        // (document.getElementById('fecha_final') as HTMLInputElement).value = FechaConFormato(data.fecha_final!);

        this.ListObservaciones = data?.observaciones? data.observaciones.split('|') : [];

        this.dataIndice = JSON.parse(data.indice ? data.indice : '[]')
        console.log(data);
      },
      error: (error) => {
        console.log(error);
      },
      complete: () => {
        console.log('listado de indizacion detalle completado');
      }
    })
  }

  GuardarDatosIndizacion() {
    const dataIndizacion_temp: IndizacionRequest = {
      id_responsable: this.credencialesService.credenciales.id_usuario,
      id_expediente: this.id_expediente_temp,
      indice: JSON.stringify(this.dataIndice),
      observaciones: this.ListObservaciones.length? this.ListObservaciones.join('|'): null,
      juzgado_origen: this.dataIndizacion.juzgado_origen.trim(),
      tipo_proceso: this.dataIndizacion.tipo_proceso.trim(),
      materia: this.dataIndizacion.materia.trim(),
      demandante: JSON.stringify(this.ListDamandantes),
      demandado: JSON.stringify(this.ListDamandados),
      fecha_inicial: this.dataIndizacion.fecha_inicial==null ? null : new Date(this.dataIndizacion.fecha_inicial),
      fecha_final: this.dataIndizacion.fecha_final==null ? null : new Date(this.dataIndizacion.fecha_final),
      app_user: this.credencialesService.credenciales.username
    }
    console.log(this.dataIndizacion);
    console.log(dataIndizacion_temp)
    const erroresValidacion = form_indizacion_creacion_vf(dataIndizacion_temp);
    if (erroresValidacion.length > 0) {
      let errorMensaje = '';
      erroresValidacion.forEach(error => {
        errorMensaje += `Error en el campo :"${error.campo}": ${error.mensaje}`;
      });
      alert(errorMensaje)
      console.log(errorMensaje)
      return;
    }
    else {
      //alert('listos para guardar')
      console.log(dataIndizacion_temp)
      this.indizacionService.CrearIndizacion(dataIndizacion_temp).subscribe({
        next: (data: CrearIndizacionResponse) => {
          console.log(data.message);
        },
        error: (error) => {
          console.log(error);
        },
        complete: () => {
          console.log('creacion de indizacion completado');
          this.EstadoIndizacionTrabajado()
          this.closeModalIndizacion();
          this.sweetAlert.MensajeSimpleSuccess('Expediente Indizado',`Expediente ${this.data_preparacion_header.nro_expediente} indizado con exito` );
        }
      })
    }
  }

  ModificarDatosIndizacion() {
    const dataIndizacion_temp: IndizacionRequest = {
      id_responsable: this.credencialesService.credenciales.id_usuario,
      id_expediente: this.id_expediente_temp,
      indice: JSON.stringify(this.dataIndice),
      observaciones: this.ListObservaciones.length? this.ListObservaciones.join('|'): null,
      juzgado_origen: this.dataIndizacion.juzgado_origen.trim(),
      tipo_proceso: this.dataIndizacion.tipo_proceso.trim(),
      materia: this.dataIndizacion.materia.trim(),
      demandante: JSON.stringify(this.ListDamandantes),
      demandado: JSON.stringify(this.ListDamandados),
      fecha_inicial: this.dataIndizacion.fecha_inicial==null ? null : new Date(this.dataIndizacion.fecha_inicial),
      fecha_final: this.dataIndizacion.fecha_final==null ? null : new Date(this.dataIndizacion.fecha_final),
      app_user: this.credencialesService.credenciales.username
    }
    console.log(this.dataIndizacion);
    console.log(dataIndizacion_temp)
    const erroresValidacion = form_indizacion_modificar_vf(dataIndizacion_temp);
    if (erroresValidacion.length > 0) {
      let errorMensaje = '';
      erroresValidacion.forEach(error => {
        errorMensaje += `Error en el campo :"${error.campo}": ${error.mensaje}`;
      });
      alert(errorMensaje)
      console.log(errorMensaje)
      return;
    }
    else {
      //alert('listos para guardar')

      this.indizacionService.ModificarIndizacion(dataIndizacion_temp.id_expediente, dataIndizacion_temp).subscribe({
        next: (data: ModificarIndizacionResponse) => {
          console.log(data.message);
        },
        error: (error) => {
          console.log(error);
        },
        complete: () => {
          console.log('creacion de indizacion completado');
          this.EstadoIndizacionTrabajado();
          this.ModificarRespuestaMensaje();
          this.closeModalIndizacion();
          this.sweetAlert.MensajeSimpleSuccess('Expediente Modificado',`Expediente ${this.data_preparacion_header.nro_expediente} modificado con exito` );
        }
      })
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
        this.MensajesExpedienteTemp = []; // Siempre asegúrate que sea un array
      },
      complete: () => {
        console.log('listado de mensajes completado');
      }
    });
  }

  agregarRespuesta(index: number, nuevaRespuesta: string): void {


    if (index >= 0 && index < this.MensajesExpedienteTemp.length) {
      let dataRespuesta: Respuesta = {
        area: 'INDIZACION',
        responsable: this.credencialesService.credenciales.username,
        fecha: new Date(),
        respuesta: nuevaRespuesta
      };
      this.MensajesExpedienteTemp[index].respuestas.push(dataRespuesta);
    } else {
      console.error("Índice de mensaje inválido");
    }

    this.cerrarPopup();
  }

  ModificarRespuestaMensaje() {
      const dataMessage: mensajeRequest = {
        mensaje: JSON.stringify(this.MensajesExpedienteTemp),
        app_user: this.credencialesService.credenciales.username
      };
  
      this.estadoService.GuardarMensajeById_expediente(
        this.data_expediente_temp.id_expediente,
        dataMessage
      ).subscribe({
        next: (data: MensajeGuardarResponse) => console.log(data.message),
        error: (error) => console.error(error),
        complete: () => {
          console.log('guardar mensaje exitosa');
          this.ListarExpedientes();
        }
      });
      
    }
  // manejo demandates --------------------------------------------------------------------------------------
  AgregarDemandante() {
    const demandante = (document.getElementById('demandante') as HTMLInputElement).value;
    const id = (document.getElementById('id_demandante') as HTMLInputElement).value;

    if (demandante.trim() === '') {
      alert('Debe escribir datos para agregar el demandante');
      return;
    }

    this.ListDamandantes.push({ demandante, id });
    (document.getElementById('demandante') as HTMLInputElement).value = '';
    (document.getElementById('id_demandante') as HTMLInputElement).value = '';
  }

  EliminarDemandante(index: number) {
    this.ListDamandantes.splice(index, 1);
  }

  SubirDemandante(index: number) {
    if (index > 0) {
      const temp = this.ListDamandantes[index - 1];
      this.ListDamandantes[index - 1] = this.ListDamandantes[index];
      this.ListDamandantes[index] = temp;
    }
  }

  BajarDemandante(index: number) {
    if (index < this.ListDamandantes.length - 1) {
      const temp = this.ListDamandantes[index + 1];
      this.ListDamandantes[index + 1] = this.ListDamandantes[index];
      this.ListDamandantes[index] = temp;
    }
  }

  // manejo demandados --------------------------------------------------------------------------------------

  AgregarDemandado() {
    const demandado = (document.getElementById('demandado') as HTMLInputElement).value;
    const id = (document.getElementById('id_demandado') as HTMLInputElement).value;

    if (demandado.trim() === '') {
      alert('Debe escribir datos para agregar el demandado');
      return;
    }

    this.ListDamandados.push({ demandado, id });
    (document.getElementById('demandado') as HTMLInputElement).value = '';
    (document.getElementById('id_demandado') as HTMLInputElement).value = '';
  }

  EliminarDemandado(index: number) {
    this.ListDamandados.splice(index, 1);
  }

  SubirDemandado(index: number) {
    if (index > 0) {
      const temp = this.ListDamandados[index - 1];
      this.ListDamandados[index - 1] = this.ListDamandados[index];
      this.ListDamandados[index] = temp;
    }
  }

  BajarDemandado(index: number) {
    if (index < this.ListDamandados.length - 1) {
      const temp = this.ListDamandados[index + 1];
      this.ListDamandados[index + 1] = this.ListDamandados[index];
      this.ListDamandados[index] = temp;
    }
  }
  // --------------------------------------------------------------------------------------------------------------------------------------------------------
  
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

  //MANEJADOR DE ITEMS DE INDIZACION
  limpiarCamposIndice() {
    (<HTMLInputElement>document.getElementById('indizacion_descripcion')).value = '';
    (<HTMLInputElement>document.getElementById('indizacion_indice')).value = '';
    (<HTMLInputElement>document.getElementById('indizacion_fojas')).value = '';
    (<HTMLInputElement>document.getElementById('fecha_indice')).value = '';
    (<HTMLInputElement>document.getElementById('indizacion_textarea')).value = '';
    (<HTMLInputElement>document.getElementById('indizacion_radio_original')).checked = false;
    (<HTMLInputElement>document.getElementById('indizacion_radio_copia')).checked = false;
    (<HTMLInputElement>document.getElementById('indizacion_radio_copia_certificada')).checked = false;  
    (<HTMLInputElement>document.getElementById('indizacion_radio_copia_copia_certificada')).checked = false;
  }
  limpiarCamposSubIndice() {
    (<HTMLInputElement>document.getElementById('indizacion_descripcion_2')).value = '';
    (<HTMLInputElement>document.getElementById('indizacion_indice_2')).value = '';
    (<HTMLInputElement>document.getElementById('indizacion_fojas_2')).value = '';
    (<HTMLInputElement>document.getElementById('fecha_indice_2')).value = '';
    (<HTMLInputElement>document.getElementById('indizacion_textarea_2')).value = '';
    (<HTMLInputElement>document.getElementById('indizacion_radio_original_2')).checked = false;
    (<HTMLInputElement>document.getElementById('indizacion_radio_copia_2')).checked = false;
    (<HTMLInputElement>document.getElementById('indizacion_radio_copia_certificada_2')).checked = false;  
    (<HTMLInputElement>document.getElementById('indizacion_radio_copia_copia_certificada_2')).checked = false;
  }

  addItem() {
    this.limpiarCamposIndice();
  
    (document.activeElement as HTMLElement)?.blur();
  
    const modalElement = document.getElementById('Modal_Indizador_primero')!;
    this.myModalIndice = new bootstrap.Modal(modalElement);
    this.myModalIndice.show();
    
  
    // Esperar a que el modal termine de abrirse
    modalElement.addEventListener('shown.bs.modal', () => {
      const inputElement = modalElement.querySelector<HTMLInputElement>('#indizacion_descripcion'); // ajusta el ID
      if (inputElement) {
        inputElement.focus();
      }
    }, { once: true }); // Se asegura de que se ejecute solo una vez
  }

  addSubItem(items: any[], index: number) {
    this.limpiarCamposSubIndice()
    this.itemTemp = items
    this.index_indizacion = index
    this.myModalSubIndice = new bootstrap.Modal(document.getElementById('Modal_Indizador_segundo'));
    this.myModalSubIndice.show();

    const botonRegistrar = document.getElementById('boton_agregar_subitem');
    if (botonRegistrar) {
      botonRegistrar.onclick = () => this.registrarSubItem(items, index);
    }
  }

  closeModalIndice() {
    this.myModalIndice.hide();
  }
  closeModalSubIndice() {
    this.myModalSubIndice.hide();
  }

  registrarItem() {

    let datosIndex: any = {};
    datosIndex.descripcion = (<HTMLInputElement>document.getElementById('indizacion_descripcion')).value;
    datosIndex.indice = (<HTMLInputElement>document.getElementById('indizacion_indice')).value;
    datosIndex.fojas = (<HTMLInputElement>document.getElementById('indizacion_fojas')).value;
    datosIndex.fecha = (<HTMLInputElement>document.getElementById('fecha_indice')).value;
      datosIndex.check_original = (<HTMLInputElement>document.getElementById('indizacion_radio_original')).checked;
      datosIndex.check_copia = (<HTMLInputElement>document.getElementById('indizacion_radio_copia')).checked;
      datosIndex.check_copia_certificada = (<HTMLInputElement>document.getElementById('indizacion_radio_copia_certificada')).checked;
      datosIndex.check_copia_copia_certificada = (<HTMLInputElement>document.getElementById('indizacion_radio_copia_copia_certificada')).checked;
    datosIndex.check_textarea = (<HTMLInputElement>document.getElementById('indizacion_textarea')).value;
    datosIndex.subItems = []

    this.dataIndice.push(datosIndex)
    this.myModalIndice.hide()
  }

  registrarSubItem(items: any[], index: number) {
    let datosIndex: any = {};
    datosIndex.descripcion = (<HTMLInputElement>document.getElementById('indizacion_descripcion_2')).value;
    datosIndex.indice = (<HTMLInputElement>document.getElementById('indizacion_indice_2')).value;
    datosIndex.fojas = (<HTMLInputElement>document.getElementById('indizacion_fojas_2')).value;
    datosIndex.fecha = (<HTMLInputElement>document.getElementById('fecha_indice_2')).value;
      datosIndex.check_original = (<HTMLInputElement>document.getElementById('indizacion_radio_original_2')).checked;
      datosIndex.check_copia = (<HTMLInputElement>document.getElementById('indizacion_radio_copia_2')).checked;
      datosIndex.check_copia_certificada = (<HTMLInputElement>document.getElementById('indizacion_radio_copia_certificada_2')).checked;
      datosIndex.check_copia_copia_certificada = (<HTMLInputElement>document.getElementById('indizacion_radio_copia_copia_certificada_2')).checked;
    datosIndex.check_textarea = (<HTMLInputElement>document.getElementById('indizacion_textarea_2')).value;
    // datosIndex.subItems=[]
    if (datosIndex) {
      if (!items[index].subItems) {
        items[index].subItems = [];
      }
      items[index].subItems.push(datosIndex);
    }
    this.myModalSubIndice.hide()
  }
  editItem(items: any[], index: number) {

    this.itemTemp = items
    this.index_indizacion = index
    this.myModalSubIndice = new bootstrap.Modal(document.getElementById('Modal_Indizador_segundo'));
    this.myModalSubIndice.show();
    (<HTMLInputElement>document.getElementById('indizacion_descripcion_2')).value = items[index].descripcion;
    (<HTMLInputElement>document.getElementById('indizacion_indice_2')).value = items[index].indice;
    (<HTMLInputElement>document.getElementById('indizacion_fojas_2')).value = items[index].fojas;
    (<HTMLInputElement>document.getElementById('fecha_indice_2')).value = items[index].fecha;
    (<HTMLInputElement>document.getElementById('indizacion_textarea_2')).value = items[index].check_textarea;
      (<HTMLInputElement>document.getElementById('indizacion_radio_original_2')).checked = items[index].check_original;
      (<HTMLInputElement>document.getElementById('indizacion_radio_copia_2')).checked = items[index].check_copia;
      (<HTMLInputElement>document.getElementById('indizacion_radio_copia_certificada_2')).checked = items[index].check_copia_certificada;
      (<HTMLInputElement>document.getElementById('indizacion_radio_copia_copia_certificada_2')).checked = items[index].check_copia_copia_certificada;
    const botonRegistrar = document.getElementById('boton_agregar_subitem');
    if (botonRegistrar) {
      botonRegistrar.onclick = () => this.registrarModificarItem(items, index);
    }
  }
  registrarModificarItem(items: any[], index: number) {
    items[index].descripcion = (<HTMLInputElement>document.getElementById('indizacion_descripcion_2')).value;
    items[index].indice = (<HTMLInputElement>document.getElementById('indizacion_indice_2')).value;
    items[index].fojas = (<HTMLInputElement>document.getElementById('indizacion_fojas_2')).value;
    items[index].fecha = (<HTMLInputElement>document.getElementById('fecha_indice_2')).value;
      items[index].check_original = (<HTMLInputElement>document.getElementById('indizacion_radio_original_2')).checked;
      items[index].check_copia = (<HTMLInputElement>document.getElementById('indizacion_radio_copia_2')).checked;
      items[index].check_copia_certificada = (<HTMLInputElement>document.getElementById('indizacion_radio_copia_certificada_2')).checked;
      items[index].check_copia_copia_certificada = (<HTMLInputElement>document.getElementById('indizacion_radio_copia_copia_certificada_2')).checked;
    items[index].check_textarea = (<HTMLInputElement>document.getElementById('indizacion_textarea_2')).value;
    this.myModalSubIndice.hide()
  }
  deleteItem(items: any[], index: number) {
    items.splice(index, 1);
  }

}
