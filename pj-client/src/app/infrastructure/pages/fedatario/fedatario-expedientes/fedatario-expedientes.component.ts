import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NavegatorComponent } from '../../../shared/components/navegator/navegator.component';
import { SubnavegatorComponent } from '../../../shared/components/subnavegator/subnavegator.component';
import { ExpedienteResponse, ExpedienteResponseDataView } from '../../../../domain/dto/ExpedienteResponse.dto';
import { PreparacionResponseDataView } from '../../../../domain/dto/PreparacionResponse.dto';
import { DigitalizacionResponseDataView, DigitalizacionTotalImagenesResponse } from '../../../../domain/dto/DigitalizacionResponse.dto';
import { IndizacionResponseDataView } from '../../../../domain/dto/IndizacionResponse.dto';
import { map } from 'rxjs';
import { InventarioResponse } from '../../../../domain/dto/InventarioResponse.dto';
import { FechaConFormato } from '../../../functions/formateDate';
import { SafeResourceUrl, DomSanitizer } from '@angular/platform-browser';
import { ExpedienteService } from '../../../services/remoto/expediente/expediente.service';
import { CredencialesService } from '../../../services/local/credenciales.service';
import { FlujogramaService } from '../../../services/remoto/flujograma/flujograma.service';
import { EstadoService } from '../../../services/remoto/estado/estado.service';
import { FtpService } from '../../../services/remoto/ftp/ftp.service';
import { InventarioService } from '../../../services/remoto/inventario/inventario.service';
import { PreparacionService } from '../../../services/remoto/preparacion/preparacion.service';
import { DigitalizacionService } from '../../../services/remoto/digitalizacion/digitalizacion.service';
import { IndizacionService } from '../../../services/remoto/indizacion/indizacion.service';
import { FedatarioService } from '../../../services/remoto/fedatario/fedatario.service';
import { ControlService } from '../../../services/remoto/control/control.service';
import { FlujogramaRequest } from '../../../../domain/dto/FlujogramaRequest.dto';
import { CrearFlujogramaResponse } from '../../../../domain/dto/FlujogramaResponse.dto';
import { InfoInventarioComponent } from '../../../components/info-inventario/info-inventario.component';
import { NgxPaginationModule } from 'ngx-pagination';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { EstadoMensajesResponse, MensajeGuardarResponse, ModificarEstadoResponse } from '../../../../domain/dto/EstadoResponse.dto';
import { ControlResponseDataView } from '../../../../domain/dto/ControlResponse.dto';
import { FirmaDigitalEncontradaResponse, FirmaDigitalResponse } from '../../../../domain/dto/FirmaDigitalResponse.dto';
import { FirmaDigitalService } from '../../../services/remoto/firmaDigital/firma-digital.service';
import { CrearFedatarioResponse, FedatarioResponseDataView } from '../../../../domain/dto/FedatarioResponse.dto';
import { Mensaje } from '../../../../domain/models/Mensaje.model';
import { mensajeRequest } from '../../../../domain/dto/EstadoRequest.dto';
import { SweetAlert } from '../../../shared/animate-messages/sweetAlert';
import { PDFDocument } from 'pdf-lib';


declare var bootstrap: any;

@Component({
  selector: 'app-fedatario-expedientes',
  imports: [NavegatorComponent, SubnavegatorComponent, InfoInventarioComponent, NgxPaginationModule, CommonModule, FormsModule],
  templateUrl: './fedatario-expedientes.component.html',
  styleUrl: './fedatario-expedientes.component.css'
})
export class FedatarioExpedientesComponent implements OnInit {


  private myModalFedatario: any;
  private myModalReception: any;
  show_message_panel: boolean = false;
  show_sign_panel: boolean = false;
  id_inventario: number = 0;
  ListExpedientes: ExpedienteResponse[] = [];
  ListExpedientesTemp: ExpedienteResponse[] = [];
  certificado: string | null = null;
  titulo_certificado: string | null = null;
  mensaje_certificado: string | null = null;
  mensaje_firmado: string | null = null;
  msg_firmado: boolean = false;
  mostrar_mensajes_expediente: boolean = false;
  MensajesExpedienteTemp: Mensaje[] = [];

  private myModalDesaprobar: any;
  rechazoRazon: string = '';
  moduloSeleccionado: string = '';


  nro_expediente_temp: string = '';
  id_expediente_temp: number = 0;
  modificarControl: boolean = false;
  codigo_inventario: string = '';
  pdfUrl: SafeResourceUrl | null = null;
  folderPathDocument: string | null = null;
  folderPathPortada: string | null = null;
  folderPathFirma: string | null = null;
  p: number = 1;
  progreso_firma = 0;
  firmaProgressStatus = false;
  buttonFirma = true;


  // data de cabecera de informacion
  nro_expedientes: number = 0;
  nro_concluidos: number = 0;
  nro_pendientes: number = 0;
  nro_rechazados: number = 0;
  nro_imagenes: number = 0;
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

  data_control: ControlResponseDataView = {
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

  data_fedatario: FedatarioResponseDataView = {
    id_fedatar: 0,
    id_responsable: 0,
    id_expediente: 0,
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

  constructor(private router: Router,
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
    private fedatarioService: FedatarioService,
    private sweetAlert: SweetAlert,
    private firmaDigitalService: FirmaDigitalService,
  ) { }

  ngOnInit(): void {
    this.id_inventario = this.activatedRoute.snapshot.params['id'];
    this.ListarExpedientes();
    this.ObternerCodigoInventario()
    this.encontrarCertificado()
    this.pdfUrl = this.sanitizer.bypassSecurityTrustResourceUrl(`img/carga_error/error_carga.pdf`);
  }

  openModalReception(id_expediente: number) {
    this.id_expediente_temp = id_expediente;
    this.modificarControl = false;
    this.myModalReception = new bootstrap.Modal(document.getElementById('ModalReception'));
    this.myModalReception.show();
  }

  closeModalReception() {
    this.myModalReception.hide();

  }
  openModalFedatario(expediente_temp: ExpedienteResponse) {

    this.id_expediente_temp = expediente_temp.id_expediente;
    this.myModalFedatario = new bootstrap.Modal(document.getElementById('ModalFedatario'));
    this.myModalFedatario.show();
    this.mostrar_mensajes_expediente = false;
    this.ObtenerExpedienteDataViewXid(expediente_temp.id_expediente);
    if(expediente_temp.estado_fedatado=='T'){
      this.recuperarFileFirmado(expediente_temp.nro_expediente);
      this.RecuperarDatosFedatario(expediente_temp.id_expediente);
    }else{
      this.recuperarFile(expediente_temp.nro_expediente);
    }
    this.recuperarDataPreparacion(expediente_temp.id_expediente);
    this.recuperarDataDigitalizacion(expediente_temp.id_expediente);
    this.recuperarDataIndizacion(expediente_temp.id_expediente);
    this.RecuperarDatosControl(expediente_temp.id_expediente);
    this.ObtenerMensajesById_expediente(expediente_temp.id_expediente);
  }

  ObtenerMensajesById_expediente(id_expediente: number) {
    console.log('id_expediente_prueba:', id_expediente);
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

  closeModalFedatario() {
    this.myModalFedatario.hide();
    this.mostrar_mensajes_expediente = false;
    this.show_sign_panel = false;
    this.msg_firmado = false;
    this.buttonFirma = true;
    (document.getElementById('password_certificado') as HTMLInputElement).value='';
  
  }

  openModalDesaprobar() {

    this.myModalDesaprobar = new bootstrap.Modal(document.getElementById('exampleModalCenter_desaprobar'));
    this.myModalDesaprobar.show();
  }

  closeModalDesaprobar() {
    this.myModalDesaprobar.hide();
  }

  obtenerExpedienteTemp(expediente: ExpedienteResponse) {
    this.data_expediente_temp = expediente;
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

  recuperarFile(nro_expediente_temp: string) {
    let fileName = nro_expediente_temp + '.pdf';
    let folderPath = this.folderPathDocument!;
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
  
  async recuperarFileFirmado(nro_expediente_temp: string) {
    const fileName = nro_expediente_temp + '.pdf';
    const folderPath = this.folderPathDocument!;
    const pathFirmados = this.folderPathFirma!; // 👈 asegúrate de tener esta ruta configurada
  
    try {
      // Descargar expediente
      const expediente$ = this.ftpService.downloadFile(fileName, folderPath);
      // Descargar firmado
      const firmado$ = this.ftpService.downloadFile(fileName, pathFirmados);
  
      // Esperar ambos en paralelo
      const [expedienteBlob, firmadoBlob] = await Promise.all([
        expediente$.toPromise(),
        firmado$.toPromise()
      ]);
  
      // Convertir a ArrayBuffer
      const expedienteBuffer = await expedienteBlob!.arrayBuffer();
      const firmadoBuffer = await firmadoBlob!.arrayBuffer();
  
      // Cargar PDFs
      const expedientePdf = await PDFDocument.load(expedienteBuffer);
      const firmadoPdf = await PDFDocument.load(firmadoBuffer);
  
      // Crear un nuevo PDF
      const finalPdf = await PDFDocument.create();
  
      // Copiar la primera página desde firmado
      const [firstPageFirmado] = await finalPdf.copyPages(firmadoPdf, [0]);
      finalPdf.addPage(firstPageFirmado);
  
      // Copiar el resto de las páginas del expediente (desde la segunda)
      const restPages = await finalPdf.copyPages(
        expedientePdf,
        expedientePdf.getPageIndices().slice(1)
      );
      restPages.forEach(p => finalPdf.addPage(p));
  
      // Guardar como Uint8Array
      const finalBytes = await finalPdf.save();
  
      // Convertir a Blob y mostrar en el visor
      const temp = new Blob([finalBytes], { type: 'application/pdf' });
      this.pdfUrl = this.sanitizer.bypassSecurityTrustResourceUrl(
        URL.createObjectURL(temp)
      );
  
      console.log('📄 Expediente combinado generado correctamente');
    } catch (error) {
      console.error('❌ Error al recuperar o combinar archivos:', error);
    }
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
        this.ListObservacionesIndizacion = data.observaciones?.split('|') ?? [];
        this.ListDamandantes = JSON.parse(data.demandante ? data.demandante : '[]');
        this.ListDamandados = JSON.parse(data.demandado ? data.demandado : '[]');
        (document.getElementById('fecha_inicio') as HTMLInputElement).value = FechaConFormato(data.fecha_inicial!);
        (document.getElementById('fecha_final') as HTMLInputElement).value = FechaConFormato(data.fecha_final!);
        console.log(this.data_indizacion);
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
    this.controlService.ObtenerControlDataViewXidExpediente(id_expediente).subscribe({
      next: (data: ControlResponseDataView) => {
        this.data_control = data;
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

  RecuperarDatosFedatario(id_expediente: number) {
    this.fedatarioService.ObtenerFedatarioDataViewXidExpediente(id_expediente).subscribe({
      next: (data: FedatarioResponseDataView) => {
        this.data_fedatario = data;
      },
      error: (error) => {
        console.log(error);
      },
      complete: () => {
        console.log('listado de fedatario detalle completado');
      }
    })
  }

  ObternerCodigoInventario() {
    const params = this.activatedRoute.snapshot.params;
    this.inventarioService.ObtenerInventarioDetalle(params['id']).subscribe({
      next: (data: InventarioResponse) => {
        this.codigo_inventario = data.codigo;
        this.folderPathDocument = `${this.codigo_inventario}/EXPEDIENTES`;
        this.folderPathPortada = `${this.codigo_inventario}/PORTADAS`;
        this.folderPathFirma = `/${this.codigo_inventario}/FIRMADOS`;

      },
      error: (error) => {
        console.log(error);
      },
      complete: () => {
        console.log('listado de inventarios completado');
      }
    })
  }

 
  
  informacionTags(expedientes: ExpedienteResponse[]) {
    this.nro_expedientes = expedientes.length;
    this.nro_concluidos = expedientes.filter(e => e.estado_fedatado === 'T').length;
    this.nro_pendientes = expedientes.filter(e => e.estado_fedatado === null || e.estado_fedatado === 'A').length;
    this.nro_rechazados = expedientes.filter(e => e.estado_fedatado === 'R').length;
    this.obtenerTotalImagenesEnFedatario()
    this.ObternerExpedientesRechazadosFedatario()
  }

  obtenerTotalImagenesEnFedatario() {
    this.digitalizacionService.ObtenerTotalImagenesEnFedatario(this.id_inventario).subscribe({
      next: (data: DigitalizacionTotalImagenesResponse) => {
        console.log(data);
        this.nro_imagenes = Number( data.total_imagenes);
      },
      error: (error) => {
        console.log(error);
      },
      complete: () => {
        console.log('obtener total de imagenes completado');
      }
    })
  }

  ObternerExpedientesRechazadosFedatario() {
    this.expedienteService.ListarExpedientesXidInventario(this.id_inventario)
      .pipe(
        map((data: ExpedienteResponse[]) =>
          data.filter(exp => exp.estado_fedatado === 'R')
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


  ListarExpedientes() {
    this.expedienteService.ListarExpedientesXidInventario(this.id_inventario)
      .pipe(
        map((data: ExpedienteResponse[]) =>
          data.filter(exp => exp.estado_controlado === 'T')
        
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
      area: 'FEDATARIO'
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
        this.closeModalReception();
        this.EstadoFedatarioAceptado()
        this.openModalFedatario(this.data_expediente_temp);

      }
    })
  }

  EstadoFedatarioAceptado() {
    this.estadoService.RecepcionarFedado(this.id_expediente_temp, this.credencialesService.credenciales.username).subscribe({
      next: (data: ModificarEstadoResponse) => {
        console.log(data.message);
      },
      error: (error) => {
        console.log(error);
      },
      complete: () => {
        console.log('estado fedatario aceptado correctamente');
        this.ListarExpedientes();
      }
    })
  }

  EstadoFedatarioTrabajado() {
    this.estadoService.TrabajadoFedado(this.id_expediente_temp, this.credencialesService.credenciales.username).subscribe({
      next: (data: ModificarEstadoResponse) => {
        console.log(data.message);
      },
      error: (error) => {
        console.log(error);
      },
      complete: () => {
        console.log('estado fedatario aceptado correctamente');
        this.ListarExpedientes();
      }
    })
  }

  crearFedatario() {
    const data_fedatario = {
      id_responsable: this.credencialesService.credenciales.id_usuario,
      id_expediente: this.id_expediente_temp,
      app_user: this.credencialesService.credenciales.username,
    }
    console.log(data_fedatario)
    this.fedatarioService.crearFedatario(data_fedatario).subscribe({
      next: (data: CrearFedatarioResponse) => {
        console.log(data.message);
      },
      error: (error) => {
        console.log(error);
      },
      complete: () => {
        console.log('fedatario creado correctamente');
      }
    })
  }

  rechazarExpediente() {
    const razon = this.rechazoRazon?.toUpperCase();
    const destino = this.moduloSeleccionado;
  
    if (!destino || !razon) {
      alert('Debe seleccionar un módulo y proporcionar una razón');
      return;
    }
  
    const idExpediente = this.data_expediente_temp.id_expediente;
    const usuario = this.credencialesService.credenciales.username;
  
    // Mapa de funciones por módulo
    const rechazarFnMap = {
      DIGITALIZACION: () =>
        this.estadoService.RechazarFedatarioDigitalizacion(idExpediente, usuario),
      INDIZACION: () =>
        this.estadoService.RechazarFedatarioIndizacion(idExpediente, usuario)
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
          area_remitente: 'FEDATARIO',
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
            this.sweetAlert.MensajeSimpleInfo('EXPEDIENTE RECHAZADO',`El expediente ${this.data_expediente_temp.nro_expediente} ha sido rechazado correctamente` );
            this.closeModalDesaprobar();
            this.closeModalFedatario();
            this.ListarExpedientes();
          }
        });
      }
    });
  }

  mostarSignPanel() {
    this.show_sign_panel = !this.show_sign_panel;
  }

  progress_bar_sign() {
    let password = (document.getElementById('password_certificado') as HTMLInputElement).value;
    if (password.trim() === '') {
      alert("La contraseña no puede estar vacía")
      return;
    }

    this.firmaProgressStatus = true;
    this.buttonFirma = false;

    const interval = setInterval(() => {
      if (this.progreso_firma < 100) {
        // Incremento aleatorio entre 3 y 10
        const randomIncrement = Math.floor(Math.random() * 8) + 3;
        this.progreso_firma = Math.min(this.progreso_firma + randomIncrement, 100);
      } else {
        clearInterval(interval);

        // Esperar 2 segundos antes de ocultar la barra
        setTimeout(() => {
          this.firmaProgressStatus = false;
          this.progreso_firma = 0;
          this.msg_firmado = true;
          this.mensaje_firmado = '¡Firma exitosa!';
        }, 2000);
      }
    }, 500);
  }

  terminarFirma(){
    this.closeModalFedatario();
    this.sweetAlert.MensajeExito('Expediente firmado correctamente');
  }

  firmarDocumento() {
    const dataFirma = {
      nombrePdf: `${this.data_expediente_temp.nro_expediente}.pdf`,
      nombreCertificado: `${this.credencialesService.credenciales.username}.pfx`,
      password: (document.getElementById('password_certificado') as HTMLInputElement).value,
      ubicacion: "Cusco, Perú",
      cargo: "Fedatario-QUIPUSCAN",
      carpetaOrigen: `${this.folderPathPortada}`,
      carpetaFirmados: `${this.folderPathFirma}`,
      carpetaCertificados: "/CERTIFICADOS"
    }
    console.log(dataFirma)

    this.firmaDigitalService.FirmarDocumento(dataFirma).subscribe({
      next: (data: FirmaDigitalResponse) => {
        console.log(data);
        this.EstadoFedatarioTrabajado();
        this.crearFedatario()
        this.progress_bar_sign()

      },
      error: (error) => {
        console.log(error);
        alert('no es posible firmar el documento comuniquese con el area de informatica');
        this.buttonFirma = true;
      },
      complete: () => {
        console.log('firmado correctamente');

      }
    })
  }

  encontrarCertificado() {
    const usuario = this.credencialesService.credenciales.username;
    this.firmaDigitalService.EncontrarFirmaDigital(usuario).subscribe({
      next: (data: FirmaDigitalEncontradaResponse) => {
        console.log(data);
        if (data.existe) {
          this.certificado = data.certificado;
          this.titulo_certificado = data.mensaje;
        }
      },
      error: (error) => {
        console.error("❌ Error al consultar firma digital:", error);

        if (error.status === 0) {
          this.titulo_certificado = 'No se pudo conectar con el servidor. Verifique su red.';
        } else if (error.status === 404) {
          this.titulo_certificado = 'No existe certificado asociado';
        } else if (error.status === 500) {
          this.titulo_certificado = 'Ocurrió un error en el servidor al buscar el certificado.';
        } else {
          this.titulo_certificado = error?.error?.mensaje || 'Ocurrió un error inesperado.';
        }
      },
      complete: () => {
        console.log('✅ Búsqueda de firma digital finalizada');
      }
    });
  }
}
