import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NavegatorComponent } from '../../../shared/components/navegator/navegator.component';
import { SubnavegatorComponent } from '../../../shared/components/subnavegator/subnavegator.component';
import { CommonModule } from '@angular/common';
import { ExpedienteResponse } from '../../../../domain/dto/ExpedienteResponse.dto';
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
import { PreparacionResponse } from '../../../../domain/dto/PreparacionResponse.dto';
import { PreparacionService } from '../../../services/remoto/preparacion/preparacion.service';
import { DigitalizacionService } from '../../../services/remoto/digitalizacion/digitalizacion.service';
import { PreparacionViewComponent } from '../../../components/preparacion-view/preparacion-view.component';
import { DigitalizacionModel } from '../../../../domain/models/Digitalizacion.model';
import { FtpService } from '../../../services/remoto/ftp/ftp.service';
import { CrearDigitalizacionResponse, DigitalizacionDataResponse } from '../../../../domain/dto/DigitalizacionResponse.dto';
import { DigitalizacionRequest } from '../../../../domain/dto/DigitalizacionRequest.dto';
import { getFileHash } from '../../../functions/hashFuntions';
import { FormsModule } from '@angular/forms';
import { InventarioResponse } from '../../../../domain/dto/InventarioResponse.dto';
import { InventarioService } from '../../../services/remoto/inventario/inventario.service';

declare var bootstrap: any;

@Component({
  selector: 'app-digitalizacion-expedientes',
  imports: [NavegatorComponent, SubnavegatorComponent, CommonModule,FormsModule, InfoInventarioComponent, NgxPaginationModule, PreparacionViewComponent],
  templateUrl: './digitalizacion-expedientes.component.html',
  styleUrl: './digitalizacion-expedientes.component.css'
})
export class DigitalizacionExpedientesComponent implements OnInit {
  private myModal: any;

  id_inventario: number = 0;
  p: number = 1;
  file: File | null = null;

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

  data_preparacion_expediente: PreparacionResponse = {
    id_expediente: 0,
    id_responsable: 0,
    observaciones: '',
    copias_originales: false,
    copias_simples: false,
    fojas_total: null,
    fojas_unacara: null,
    fojas_doscaras: null,
    create_at : null,
    username: null
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

  guardarPDF(file: File, folderPath: string, nameFile: string) {
    this.ftpService.uploadFile(file, folderPath, nameFile).subscribe({
      next: (data: CrearDigitalizacionResponse) => {
        console.log("Respuesta del servidor:", data);
      },
      error: (error) => {
        if (error.status === 503) {
          console.error("No se pudo conectar al servidor FTP. Verifique la conexión.");
          alert("Error de conexión al servidor FTP, comuniquese con el area de informática.");
        } else if (error.status === 400) {
          console.error("Solicitud inválida: faltan datos requeridos.");
          alert("Error: Datos inválidos. Verifica el nombre del archivo y la carpeta.");
        } else {
          console.error("Error inesperado al subir el PDF:", error);
          alert("Error inesperado al subir el archivo.");
        }
      },
      complete: () => {
        console.log("PDF subido correctamente");
        this.GuardarDatosDigitalizacion(folderPath);
      }
    });
  }
  // #endregion ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

  closeModal() {
    this.myModal.hide();
    this.LimpiarDatosDigitalizacion();
    this.pdfUrl = this.sanitizer.bypassSecurityTrustResourceUrl(`img/carga_error/error_carga.pdf`);

  }

  openModalReception(id_expediente: number) {
    this.id_expediente_temp = id_expediente;
    this.modificarDigitalizacion = false;
    this.myModal = new bootstrap.Modal(document.getElementById('ModalReception'));
    this.myModal.show();
    

  }

  mostrarPreparacion = false;
  openModalPreparacionView(id_expediente: number) {

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
    this.myModal.show();

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
      },
      error: (error) => {
        console.log(error);
      },
      complete: () => {
        console.log('listado de inventarios completado');
      }
    })
  }
  
  EventAction(){
    if(this.modificarDigitalizacion){
      
    } else { 
     this.guardarPDF(this.file!,this.codigo_inventario+'/EXPEDIENTES', this.nro_expediente_temp+'.pdf');
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
      observaciones: '',
      dir_ftp: '',
      hash_doc: '',
      peso_doc: null,
    }
    this.file = null;
    this.ListObservacionesDigitalizacion = [];
    this.pdfUrl = this.sanitizer.bypassSecurityTrustResourceUrl(`img/carga_error/error_carga.pdf`);
    (document.getElementById('formFile') as HTMLInputElement).value = '';


  }

  async GuardarDatosDigitalizacion(folderPath: string) {
    const hash = await getFileHash(this.file!);
  
    let data_digitalizacion_temp: DigitalizacionRequest = {
      id_responsable: this.credencialesService.credenciales.id_usuario,
      id_expediente: this.id_expediente_temp,
      fojas_total: this.data_digitalizacion.fojas_total,
      ocr: this.data_digitalizacion.ocr,
      escala_gris: this.data_digitalizacion.escala_gris,
      color: this.data_digitalizacion.color,
      observaciones: this.ListObservacionesDigitalizacion.join('|'),
      dir_ftp: folderPath,
      hash_doc: hash,
      peso_doc: this.file!.size,
      app_user: this.credencialesService.credenciales.username
    };
  
    console.log(data_digitalizacion_temp);
    
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

  ObternerDigitalizacionByIdExpediente(id_expediente: number) {
    const params = this.activatedRoute.snapshot.params;
    this.digitalizacionService.ObtenerDigitalizacion(id_expediente).subscribe({
      next: (data: DigitalizacionDataResponse) => {
        this.data_digitalizacion = data;
        this.ListObservacionesDigitalizacion = this.data_digitalizacion.observaciones?.split('|') ?? [];
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
    let fileName=this.nro_expediente_temp+'.pdf';
    let folderPath=this.codigo_inventario+'/EXPEDIENTES';
    this.ftpService.downloadFile(fileName,folderPath).subscribe({
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

  MostrarDatosPreparacion() {
    this.mostrar_obs_preparacion = !this.mostrar_obs_preparacion ;
    if (this.mostrar_obs_preparacion) {
      this.ObtenerPreparacionByIdExpediente(this.id_expediente_temp)
    }
  }

  ObtenerPreparacionByIdExpediente(id_expediente: number) {
    this.preparacionService.ObtenerPreparacionXidExpediente(id_expediente).subscribe({
      next: (data: PreparacionResponse) => {
        this.data_preparacion_expediente = data;
        this.ListObservacionesPreparacion = this.data_preparacion_expediente.observaciones?.split('|') ?? [];
        console.log(this.data_preparacion_expediente);
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


  AgregarObservacion(){
    const valor = (document.getElementById('observacion') as HTMLInputElement).value;
    this.ListObservacionesDigitalizacion.push(valor);
    (document.getElementById('observacion') as HTMLInputElement).value='';
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
