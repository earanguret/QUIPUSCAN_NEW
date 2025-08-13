import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NavegatorComponent } from '../../../shared/components/navegator/navegator.component';
import { SubnavegatorComponent } from '../../../shared/components/subnavegator/subnavegator.component';
import { CommonModule } from '@angular/common';
import { ExpedienteResponse, ExpedienteResponseDataView } from '../../../../domain/dto/ExpedienteResponse.dto';
import { InfoInventarioComponent } from '../../../components/info-inventario/info-inventario.component';
import { NgxPaginationModule } from 'ngx-pagination';
import { FlujogramaRequest } from '../../../../domain/dto/FlujogramaRequest.dto';
import { CredencialesService } from '../../../services/local/credenciales.service';
import { FlujogramaService } from '../../../services/remoto/flujograma/flujograma.service';
import { CrearFlujogramaResponse } from '../../../../domain/dto/FlujogramaResponse.dto';
import { ExpedienteService } from '../../../services/remoto/expediente/expediente.service';
import { map } from 'rxjs/operators';
import { EstadoService } from '../../../services/remoto/estado/estado.service';
import { EstadoMensajesResponse, MensajeGuardarResponse, ModificarEstadoResponse } from '../../../../domain/dto/EstadoResponse.dto';
import { SafeResourceUrl, DomSanitizer } from '@angular/platform-browser';
import { PreparacionResponseDataView } from '../../../../domain/dto/PreparacionResponse.dto';
import { PreparacionService } from '../../../services/remoto/preparacion/preparacion.service';
import { DigitalizacionService } from '../../../services/remoto/digitalizacion/digitalizacion.service';
import { PreparacionViewComponent } from '../../../components/preparacion-view/preparacion-view.component';
import { DigitalizacionModel } from '../../../../domain/models/Digitalizacion.model';
import { FtpService } from '../../../services/remoto/ftp/ftp.service';
import { CrearDigitalizacionResponse, DigitalizacionDataResponse, ModificarDigitalizacionResponse } from '../../../../domain/dto/DigitalizacionResponse.dto';
import { DigitalizacionRequest } from '../../../../domain/dto/DigitalizacionRequest.dto';
import { getFileHash } from '../../../functions/hashFuntions';
import { FormsModule } from '@angular/forms';
import { InventarioResponse } from '../../../../domain/dto/InventarioResponse.dto';
import { InventarioService } from '../../../services/remoto/inventario/inventario.service';
import { form_digitalizacion_creacion_vf, form_digitalizacion_modificar_vf } from '../../../validator/fromValidator/digitalizacion.validator';
import { PDFDocument } from 'pdf-lib';
import { Mensaje, Respuesta } from '../../../../domain/models/Mensaje.model';
import { mensajeRequest } from '../../../../domain/dto/EstadoRequest.dto';
import { SweetAlert } from '../../../shared/animate-messages/sweetAlert';

declare var bootstrap: any;

@Component({
  selector: 'app-digitalizacion-expedientes',
  imports: [NavegatorComponent, SubnavegatorComponent, CommonModule, FormsModule, InfoInventarioComponent, NgxPaginationModule, PreparacionViewComponent],
  templateUrl: './digitalizacion-expedientes.component.html',
  styleUrl: './digitalizacion-expedientes.component.css'
})
export class DigitalizacionExpedientesComponent implements OnInit {

  // mensajes: Mensaje[] = [
  //   {
  //     area_remitente: 'CONTROL',
  //     responsable: 'MCORREO',
  //     destino: 'DIGITALIZACION',
  //     fecha: new Date('2020-05-01') ,
  //     mensaje: 'CAMBIAR LA PAGINA 27',
  //     respuestas: [
  //       {
  //         area: 'CONTROL',
  //         responsable: 'MLORENZO',
  //         fecha: new Date('2020-05-02'),
  //         respuesta: 'SE ATENDIO LO SOLICITADO'
  //       },
  //       {
  //         area: 'INDIZACION',
  //         responsable: 'LCLIMA',
  //         fecha: new Date('2020-05-04'),
  //         respuesta: 'SE ATENDIO LO SOLICITADO'
  //       }
  //     ]
  //   },

  //   {
  //     area_remitente: 'FEDAARIO',
  //     responsable: 'EARANGURE',
  //     destino: 'INDIZACION',
  //     fecha: new Date('2020-05-01'),
  //     mensaje: 'CAMBIAR LA PAGINA 27',
  //     respuestas: [
  //       {
  //         area: 'CONTROL',
  //         responsable: 'MLORENZO',
  //         fecha:  new Date('2020-05-02'),
  //         respuesta: 'SE ATENDIO LO SOLICITADO'
  //       },
  //       {
  //         area: 'INDIZACION',
  //         responsable: 'LCLIMA',
  //         fecha: new Date('2020-05-04'),
  //         respuesta: 'SE ATENDIO LO SOLICITADO'
  //       }
  //     ]
  //   },
  //   {
  //     area_remitente: 'FEDAARIO',
  //     responsable: 'EARANGURE',
  //     destino: 'INDIZACION',
  //     fecha: new Date('2020-05-01'),
  //     mensaje: 'CAMBIAR LA PAGINA 27',
  //     respuestas: [
  //       {
  //         area: 'CONTROL',
  //         responsable: 'MLORENZO',
  //         fecha:  new Date('2020-05-02'),
  //         respuesta: 'SE ATENDIO LO SOLICITADO'
  //       },
  //       {
  //         area: 'INDIZACION',
  //         responsable: 'LCLIMA',
  //         fecha:  new Date('2020-05-04'),
  //         respuesta: 'SE ATENDIO LO SOLICITADO'
  //       }
  //     ]
  //   }
  // ];

  MensajesExpedienteTemp: Mensaje[] = [];

  mostrarPopupIndex: number | null = null; // Índice del mensaje con popup abierto
  nuevaRespuesta: string = '';

  togglePopup(index: number) {
    this.mostrarPopupIndex = this.mostrarPopupIndex === index ? null : index;
    console.log(this.mostrarPopupIndex)
  }

  cerrarPopup() {
    this.mostrarPopupIndex = null;
    this.nuevaRespuesta = ''
  }

  checkAprobado: boolean = false;

  private myModalReception: any;
  private myModalDigitalizacion: any;

  id_inventario: number = 0;
  p: number = 1;
  file: File | null = null;
  folderPathDocument: string | null = null;
  folderPathPortada: string | null = null;

  ListExpedientes: ExpedienteResponse[] = [];
  ListExpedientesTemp: ExpedienteResponse[] = [];


  ListObservacionesPreparacion: string[] = [];
  notasList: any[] = [];

  id_expediente_temp: number = 0;
  observacion_temp: string = '';


  modificarDigitalizacion: boolean = false;
  pdfUrl: SafeResourceUrl | null = null;

  ListObservacionesDigitalizacion: string[] = [];
  documento: any = []
  peso_documento: number = 0

  mostrar_obs_preparacion: boolean = false;
  mostrar_mensajes_expediente: boolean = false;

  codigo_inventario: string = '';
  mostrarPreparacion = false;

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

  data_digitalizacion: DigitalizacionModel = {
    id_digitalizacion: 0,
    id_responsable: 0,
    id_expediente: 0,
    fojas_total: null,
    ocr: false,
    escala_gris: false,
    color: false,
    observaciones: '',
    dir_ftp: '',
    hash_doc: '',
    peso_doc: null,
  }



  constructor(private router: Router,
    private credencialesService: CredencialesService,
    private flujogramaService: FlujogramaService,
    private activatedRoute: ActivatedRoute,
    private expedienteService: ExpedienteService,
    private estadoService: EstadoService,
    private sanitizer: DomSanitizer,
    private preparacionService: PreparacionService,
    private digitalizacionService: DigitalizacionService,
    private ftpService: FtpService,
    private sweetAlert: SweetAlert,
    private inventarioService: InventarioService) { }

  ngOnInit(): void {
    this.id_inventario = this.activatedRoute.snapshot.params['id'];
    this.ListarExpedientes()
    this.ObternerCodigoInventario()
    this.pdfUrl = this.sanitizer.bypassSecurityTrustResourceUrl(`img/carga_error/error_carga.pdf`);
  }

  //#region EVENTO SELECCIONADOR DE DOCUMENTO +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
  onFileSelected(event: any): void {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      this.pdfUrl = this.sanitizer.bypassSecurityTrustResourceUrl(URL.createObjectURL(selectedFile));
      console.log(selectedFile)
      this.file = selectedFile;
    }
  }

  async guardarPDF(file: File, nameFile: string) {
    if (!file) {
      alert("El archivo no puede estar vacío");
      return;
    }

    try {
      // Leer el archivo como ArrayBuffer
      const arrayBuffer = await file.arrayBuffer();

      // Cargar el PDF original
      const originalPdf = await PDFDocument.load(arrayBuffer);

      // Crear un nuevo PDF y copiar la primera página
      const newPdf = await PDFDocument.create();
      const [firstPage] = await newPdf.copyPages(originalPdf, [0]);
      newPdf.addPage(firstPage);

      // Serializar el nuevo PDF a bytes
      const pdfBytes = await newPdf.save();

      // Crear nuevo archivo con la primera página
      const firstPageFile = new File([pdfBytes], `primera_${nameFile}`, { type: 'application/pdf' });

      // Subir portada primero
      this.ftpService.uploadFile(firstPageFile, this.folderPathPortada!, nameFile).subscribe({
        next: (data: CrearDigitalizacionResponse) => {
          console.log("Respuesta portada:", data);
        },
        error: (error) => {
          console.error("Error al subir la portada:", error);
          alert("Error al subir la portada. Detalle: " + (error?.message || ''));
        },
        complete: () => {
          console.log("Portada subida correctamente");

          // Ahora subir el documento completo
          this.ftpService.uploadFile(file, this.folderPathDocument!, nameFile).subscribe({
            next: (data: CrearDigitalizacionResponse) => {
              console.log("Respuesta documento:", data);
            },
            error: (error) => {
              console.error("Error al subir el documento:", error);
              alert("Error al subir el documento. Detalle: " + (error?.message || ''));
            },
            complete: () => {
              console.log("Documento completo subido correctamente");
              this.GuardarDatosDigitalizacion();
            }
          });
        }
      });

    } catch (error) {
      console.error("Error al procesar el PDF:", error);
      alert("Ocurrió un error al extraer la primera hoja del PDF.");
    }
  }

  // #endregion ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++


  openModalPreparacionPreView(id_expediente: number) {

    this.mostrarPreparacion = false; // fuerza destrucción del componente si ya estaba
    this.id_expediente_temp = id_expediente;

    // Espera un tick del ciclo de Angular para que *ngIf lo vuelva a renderizar
    setTimeout(() => {
      this.mostrarPreparacion = true;
      const modal = new bootstrap.Modal(document.getElementById('ModalPreparationView')!);
      modal.show();
    });
  }

  openModalReception(id_expediente: number) {
    this.id_expediente_temp = id_expediente;
    this.modificarDigitalizacion = false;
    this.myModalReception = new bootstrap.Modal(document.getElementById('ModalReception'));
    this.myModalReception.show();
  }

  closeModalReception() {
    if (this.myModalReception) {
      this.myModalReception.hide();
    }
    this.LimpiarDatosDigitalizacion();
    this.pdfUrl = this.sanitizer.bypassSecurityTrustResourceUrl(`img/carga_error/error_carga.pdf`);
  }


  openModalDigitalizacion(id_expediente: number, modificar_digitalizacion: boolean) {
    this.id_expediente_temp = id_expediente;
    this.mostrar_obs_preparacion = false;

    this.recuperarDataPreparacion(id_expediente);
    this.ObtenerExpedienteDataViewXid(id_expediente);
    this.ObtenerMensajesById_expediente(id_expediente);

    this.modificarDigitalizacion = modificar_digitalizacion;

    if (modificar_digitalizacion) {
      this.ObternerDigitalizacionByIdExpediente(id_expediente);
    } else {
      this.LimpiarDatosDigitalizacion();
    }

    this.myModalDigitalizacion = new bootstrap.Modal(document.getElementById('ModalDigitalizacion'));
    this.myModalDigitalizacion.show();

    this.closeModalReception();
  }


  closeModalDigitalizacion() {
    // Quitar el foco de cualquier elemento dentro del modal
    (document.activeElement as HTMLElement)?.blur();

    // Cerrar el modal si está definido
    if (this.myModalDigitalizacion) {
      this.myModalDigitalizacion.hide();
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
        area: 'DIGITALIZACION',
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

  ListarExpedientes() {
    this.expedienteService.ListarExpedientesXidInventario(this.id_inventario)
      .pipe(
        map((data: ExpedienteResponse[]) =>
          data.filter(exp => exp.estado_preparado === 'T')
        )
      )
      .subscribe({
        next: (dataFiltrada: ExpedienteResponse[]) => {
          this.ListExpedientes = dataFiltrada;
          this.ListExpedientesTemp = dataFiltrada;
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
        this.folderPathDocument = this.codigo_inventario + '/EXPEDIENTES';
        this.folderPathPortada = this.codigo_inventario + '/PORTADAS';
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
    if (this.modificarDigitalizacion) {
      this.ModificarDigitalizacion();

    } else {
      this.guardarPDF(this.file!, this.data_expediente_temp.nro_expediente + '.pdf');
    }
  }

  LimpiarDatosDigitalizacion() {
    this.data_digitalizacion = {
      id_digitalizacion: 0,
      id_responsable: 0,
      id_expediente: 0,
      fojas_total: null,
      ocr: false,
      escala_gris: false,
      color: false,
      observaciones: null,
      dir_ftp: '',
      hash_doc: '',
      peso_doc: null,
    }
    this.file = null;
    this.ListObservacionesDigitalizacion = [];
    this.pdfUrl = this.sanitizer.bypassSecurityTrustResourceUrl(`img/carga_error/error_carga.pdf`);
    (document.getElementById('formFile') as HTMLInputElement).value = '';
    this.observacion_temp = '';
    this.modificarDigitalizacion = false;
  }

  async GuardarDatosDigitalizacion() {
    const hash = await getFileHash(this.file!);

    let data_digitalizacion_temp: DigitalizacionRequest = {
      id_responsable: this.credencialesService.credenciales.id_usuario,
      id_expediente: this.id_expediente_temp,
      fojas_total: this.data_digitalizacion.fojas_total,
      ocr: this.data_digitalizacion.ocr,
      escala_gris: this.data_digitalizacion.escala_gris,
      color: this.data_digitalizacion.color,
      observaciones: this.ListObservacionesDigitalizacion.length ? this.ListObservacionesDigitalizacion.join('|') : null,
      dir_ftp: this.folderPathDocument,
      hash_doc: hash,
      peso_doc: this.file!.size,
      app_user: this.credencialesService.credenciales.username
    };

    const erroresValidacion = form_digitalizacion_creacion_vf(data_digitalizacion_temp);
    if (erroresValidacion.length > 0) {
      let errorMensaje = '';
      erroresValidacion.forEach(error => {
        errorMensaje += `Error en el campo :"${error.campo}": ${error.mensaje}`;
      });
      alert(errorMensaje)
      console.log(errorMensaje)
      return;
    }

    this.digitalizacionService.CrearDigitalizacion(data_digitalizacion_temp).subscribe({
      next: (data: CrearDigitalizacionResponse) => {
        console.log(data);
      },
      error: (error) => {
        console.log(error);
      },
      complete: () => {
        console.log('creacion de digitalizacion completado');
        this.EstadoDigitalizacionTrabajado()
        this.closeModalDigitalizacion();
        this.sweetAlert.MensajeSimpleSuccess('Expediente Digitalizado',`Expediente ${this.data_preparacion_header.nro_expediente} digitalizado con exito` );
      }
    })
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
       // this.ListarExpedientes();
      }
    });
    
  }


  async ModificarDigitalizacion() {
    const usuario = this.credencialesService.credenciales;
    const expediente = this.id_expediente_temp;
    const isArchivoCargado = !!this.file;

    const hashActual = isArchivoCargado ? await getFileHash(this.file!) : this.data_digitalizacion.hash_doc;
    const hashPrevio = this.data_digitalizacion.hash_doc;
    const archivoModificado = hashActual !== hashPrevio;

    const dataDigitalizacion: DigitalizacionRequest = {
      id_responsable: usuario.id_usuario,
      id_expediente: expediente,
      fojas_total: this.data_digitalizacion.fojas_total,
      ocr: this.data_digitalizacion.ocr,
      escala_gris: this.data_digitalizacion.escala_gris,
      color: this.data_digitalizacion.color,
      observaciones: this.ListObservacionesDigitalizacion.length ? this.ListObservacionesDigitalizacion.join('|') : null,
      dir_ftp: this.folderPathDocument,
      hash_doc: hashActual,
      peso_doc: isArchivoCargado ? this.file!.size : this.data_digitalizacion.peso_doc,
      app_user: usuario.username
    };


    const erroresValidacion = form_digitalizacion_modificar_vf(dataDigitalizacion);
    if (erroresValidacion.length > 0) {
      let errorMensaje = '';
      erroresValidacion.forEach(error => {
        errorMensaje += `Error en el campo :"${error.campo}": ${error.mensaje}`;
      });
      alert(errorMensaje)
      console.log(errorMensaje)
      return;
    }
    // Función auxiliar para actualizar datos en backend
    const actualizarDatos = () => {
      this.digitalizacionService.ModificarDatosDigitalizacion(expediente, dataDigitalizacion).subscribe({
        next: (data: ModificarDigitalizacionResponse) => {
          console.log("✅ Datos actualizados:", data);
        },
        complete: () => {
          console.log("✔️ Modificación de digitalización completada");
          this.EstadoDigitalizacionTrabajado();
          this.ModificarRespuestaMensaje();
          this.closeModalDigitalizacion();
          this.sweetAlert.MensajeSimpleSuccess('Expediente Modificado',`Expediente ${this.data_preparacion_header.nro_expediente} modificado con exito` );

        }
      });
    };

    // Si hay archivo cargado y fue modificado
    if (isArchivoCargado && archivoModificado) {
      this.ftpService.uploadFile(this.file!, this.folderPathDocument!, this.data_expediente_temp.nro_expediente + '.pdf').subscribe({
        next: (data: CrearDigitalizacionResponse) => {
          console.log("📁 Archivo subido:", data);
        },
        error: (error) => {
          if (error.status === 503) {
            console.error("No se pudo conectar al servidor FTP.");
            alert("Error de conexión al servidor FTP. Comuníquese con el área de informática.");
          } else if (error.status === 400) {
            console.error("Solicitud inválida. Verifique los datos enviados.");
            alert("Datos inválidos. Verifica el nombre del archivo y la carpeta.");
          } else {
            console.error("Error inesperado al subir el archivo:", error);
            alert("Ocurrió un error inesperado al subir el archivo.");
          }
        },
        complete: () => {
          console.log("Archivo subido correctamente.");
          actualizarDatos();
          this.ModificarRespuestaMensaje();
        }
      });
    } else {
      // No hay archivo cargado o es el mismo que ya existía
      if (!isArchivoCargado) {
        console.warn("No se cargó ningún archivo nuevo.");
      } else {
        console.log("ℹEl archivo no ha cambiado. Solo se actualizarán los metadatos.");
      }
      actualizarDatos();
      this.ModificarRespuestaMensaje();
    }
  }

  ObternerDigitalizacionByIdExpediente(id_expediente: number) {

    this.digitalizacionService.ObtenerDigitalizacion(id_expediente).subscribe({
      next: (data: DigitalizacionDataResponse) => {
        this.data_digitalizacion = data;
        this.modificarDigitalizacion = true;
        this.ListObservacionesDigitalizacion = this.data_digitalizacion?.observaciones ? this.data_digitalizacion.observaciones.split('|') : [];
        this.recuperarFile()
      },
      error: (error) => {
        console.log(error);
      },
      complete: () => {
        console.log('listado de digitalizacion detalle completado');
      }
    })
  }

  recuperarFile() {
    let fileName = this.data_expediente_temp.nro_expediente + '.pdf';
    let folderPath = this.folderPathDocument!;
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

  obtenerExpedienteTem(expediente_temp: ExpedienteResponse) {
    this.data_expediente_temp = expediente_temp;
    console.log(this.data_expediente_temp)
  }



  RecepcionFlujograma() {
    const data_flujograma: FlujogramaRequest = {
      id_expediente: this.id_expediente_temp,
      id_responsable: this.credencialesService.credenciales.id_usuario,
      app_user: this.credencialesService.credenciales.username,
      area: 'DIGITALIZACION'
    };

    this.flujogramaService.CrearFlujograma(data_flujograma).subscribe({
      next: (data: CrearFlujogramaResponse) => {
        console.log(data.message);
      },
      error: (error) => {
        console.error('Error al crear flujograma:', error);
      },
      complete: () => {
        console.log('flujograma creado correctamente');

        const esRecepcionado = this.data_expediente_temp.estado_digitalizado === 'R';
        this.openModalDigitalizacion(this.id_expediente_temp, esRecepcionado);
        this.EstadoDigitalizacionAceptado();
      }
    });
  }

  EstadoDigitalizacionAceptado() {
    this.estadoService.RecepcionarDigitalizacion(this.id_expediente_temp, this.credencialesService.credenciales.username).subscribe({
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

  EstadoDigitalizacionTrabajado() {
    this.estadoService.TrabajadoDigitalizacion(this.id_expediente_temp, this.credencialesService.credenciales.username).subscribe({
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


  AgregarObservacion(){
    if(this.observacion_temp==''){
      alert('Debe escribir algo para agregar la observación')
      return;
    }
    const valor = this.observacion_temp;
    this.ListObservacionesDigitalizacion.push(valor);
    this.observacion_temp = '';
  }

  EliminarObservacion(index: number) {
    this.ListObservacionesDigitalizacion.splice(index, 1);
  }

  SubirObservacion(index: number) {
    if (index > 0) {
      const temp = this.ListObservacionesDigitalizacion[index - 1];
      this.ListObservacionesDigitalizacion[index - 1] = this.ListObservacionesDigitalizacion[index];
      this.ListObservacionesDigitalizacion[index] = temp;
    }
  }

  BajarObservacion(index: number) {
    if (index < this.ListObservacionesDigitalizacion.length - 1) {
      const temp = this.ListObservacionesDigitalizacion[index + 1];
      this.ListObservacionesDigitalizacion[index + 1] = this.ListObservacionesDigitalizacion[index];
      this.ListObservacionesDigitalizacion[index] = temp;
    }
  }
}
