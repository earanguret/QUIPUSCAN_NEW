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
import { ModificarEstadoResponse } from '../../../../domain/dto/EstadoResponse.dto';
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

declare var bootstrap: any;

@Component({
  selector: 'app-digitalizacion-expedientes',
  imports: [NavegatorComponent, SubnavegatorComponent, CommonModule, FormsModule, InfoInventarioComponent, NgxPaginationModule, PreparacionViewComponent],
  templateUrl: './digitalizacion-expedientes.component.html',
  styleUrl: './digitalizacion-expedientes.component.css'
})
export class DigitalizacionExpedientesComponent implements OnInit {
  private myModal: any;

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
  nro_expediente_temp: string = '';

  modificarDigitalizacion: boolean = false;
  pdfUrl: SafeResourceUrl | null = null;

  ListObservacionesDigitalizacion: string[] = [];
  documento: any = []
  peso_documento: number = 0

  mostrar_obs_preparacion: boolean = false;
  mostrar_mensajes_expediente: boolean = false;

  codigo_inventario: string = '';
  mostrarPreparacion = false;

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
  

  // guardarPDF(file: File, nameFile: string) {
  //   if (!file) {
  //     alert("El archivo no puede estar vacío");
  //     return;
  //   }

  //   this.ftpService.uploadFile(file, this.folderPath!, nameFile).subscribe({
  //     next: (data: CrearDigitalizacionResponse) => {
  //       console.log("Respuesta del servidor:", data);
  //     },
  //     error: (error) => {
  //       if (error.status === 503) {
  //         console.error("No se pudo conectar al servidor FTP. Verifique la conexión.");
  //         alert("Error de conexión al servidor FTP, comuniquese con el area de informática.");
  //       } else if (error.status === 400) {
  //         console.error("Solicitud inválida: faltan datos requeridos.");
  //         alert("Error: Datos inválidos. Verifica el nombre del archivo y la carpeta.");
  //       } else {
  //         console.error("Error inesperado al subir el PDF:", error);
  //         alert("Error inesperado al subir el archivo.");
  //       }
  //     },
  //     complete: () => {
  //       console.log("PDF subido correctamente");
  //       this.GuardarDatosDigitalizacion();
  //     }
  //   });
  // }
  // #endregion ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

  closeModal() {
    this.myModal.hide();
    this.LimpiarDatosDigitalizacion();
    this.pdfUrl = this.sanitizer.bypassSecurityTrustResourceUrl(`img/carga_error/error_carga.pdf`);
    this.LimpiarDatosDigitalizacion();

  }

  openModalReception(id_expediente: number) {
    this.id_expediente_temp = id_expediente;
    this.modificarDigitalizacion = false;
    this.myModal = new bootstrap.Modal(document.getElementById('ModalReception'));
    this.myModal.show();
  }

  
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

  openModalDigitalizacion(id_expediente: number) {

    this.id_expediente_temp = id_expediente;
    this.mostrar_obs_preparacion = false;
    this.myModal = new bootstrap.Modal(document.getElementById('ModalDigitalizacion'));
    this.recuperarDataPreparacion(id_expediente)
    this.ObtenerExpedienteDataViewXid(id_expediente)
    this.myModal.show();

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
      this.guardarPDF(this.file!, this.nro_expediente_temp + '.pdf');
      //this.GuardarDatosDigitalizacion();
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
      observaciones: this.ListObservacionesDigitalizacion.length? this.ListObservacionesDigitalizacion.join('|'): null,
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
        this.closeModal();
      }
    })
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
      observaciones: this.ListObservacionesDigitalizacion.length? this.ListObservacionesDigitalizacion.join('|'): null,
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
          this.closeModal();
        }
      });
    };
  
    // Si hay archivo cargado y fue modificado
    if (isArchivoCargado && archivoModificado) {
      this.ftpService.uploadFile(this.file!, this.folderPathDocument!, this.nro_expediente_temp + '.pdf').subscribe({
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
    }
  }

  ObternerDigitalizacionByIdExpediente(id_expediente: number) {
    const params = this.activatedRoute.snapshot.params;
    this.digitalizacionService.ObtenerDigitalizacion(id_expediente).subscribe({
      next: (data: DigitalizacionDataResponse) => {
        this.data_digitalizacion = data;
        this.modificarDigitalizacion = true;
        this.ListObservacionesDigitalizacion = this.data_digitalizacion?.observaciones? this.data_digitalizacion.observaciones.split('|') : [];
        this.openModalDigitalizacion(this.data_digitalizacion.id_expediente);

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
    let fileName = this.nro_expediente_temp + '.pdf';
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

  // MostrarDatosPreparacion() {
  //   this.mostrar_obs_preparacion = !this.mostrar_obs_preparacion;
  //   if (this.mostrar_obs_preparacion) {
  //     this.ObtenerPreparacionByIdExpediente(this.id_expediente_temp)
  //   }
  // }

  // ObtenerPreparacionByIdExpediente(id_expediente: number) {
  //   this.preparacionService.ObtenerPreparacionXidExpediente(id_expediente).subscribe({
  //     next: (data: PreparacionResponse) => {
  //       this.data_preparacion_expediente = data;
  //       this.ListObservacionesPreparacion = this.data_preparacion_expediente.observaciones?.split('|') ?? [];
  //       console.log(this.data_preparacion_expediente);
  //     },
  //     error: (error) => {
  //       console.log(error);
  //     },
  //     complete: () => {
  //       console.log('listado de preparacion detalle completado');
  //     }
  //   })
  // }

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

  obtenerNroExpediente(nro_expediente: string) {
    this.nro_expediente_temp = nro_expediente;
  }



  RecepcionFlujograma() {
    let data_flujograma: FlujogramaRequest = {
      id_expediente: this.id_expediente_temp,
      id_responsable: this.credencialesService.credenciales.id_usuario,
      app_user: this.credencialesService.credenciales.username,
      area: 'DIGITALIZACION'
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
        this.EstadoDigitalizacionAceptado()
      }
    })
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


  AgregarObservacion() {
    const valor = (document.getElementById('observacion') as HTMLInputElement).value;
    this.ListObservacionesDigitalizacion.push(valor);
    (document.getElementById('observacion') as HTMLInputElement).value = '';
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
