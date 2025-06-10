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

declare var bootstrap: any;

@Component({
  selector: 'app-digitalizacion-expedientes',
  imports: [NavegatorComponent, SubnavegatorComponent, CommonModule, InfoInventarioComponent, NgxPaginationModule],
  templateUrl: './digitalizacion-expedientes.component.html',
  styleUrl: './digitalizacion-expedientes.component.css'
})
export class DigitalizacionExpedientesComponent implements OnInit {
  private myModal: any;

  id_inventario: number = 0;
  p: number = 1;
  ListExpedientes: ExpedienteResponse[] = [];
  ListExpedientesTemp: ExpedienteResponse[] = [];

  id_expediente_temp: number = 0;
  nro_expediente_temp: string = '';

  modificarDigitalizacion: boolean = false;
  pdfUrl: SafeResourceUrl | null = null;

  ListObservaciones: string[] = [];
  documento: any = []
  peso_documento: number = 0
  mostrar_obs_preparacion: boolean = false;
  mostrar_mensajes_expediente: boolean = false;

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

  ListObservacionesPreparacion: string[] = [];

  notasList: any[] = [
   
  ];

  constructor(private router: Router, 
            private credencialesService: CredencialesService, 
            private flujogramaService: FlujogramaService, 
            private activatedRoute: ActivatedRoute,
            private expedienteService: ExpedienteService,
            private estadoService: EstadoService,
            private sanitizer: DomSanitizer,
            private preparacionService: PreparacionService,
            private digitalizacionService: DigitalizacionService,) { }

  ngOnInit(): void {
    this.id_inventario = this.activatedRoute.snapshot.params['id'];
    this.ListarExpedientes()
    this.pdfUrl = this.sanitizer.bypassSecurityTrustResourceUrl(`img/carga_error/error_carga.pdf`);
  }

  //#region EVENTO SELECCIONADOR DE DOCUMENTO +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
  // onFileSelected(event: any) {
  //   const selectedFile = event.target.files[0];
  //   if (selectedFile) {
  //     this.convertToBase64(selectedFile);
  //     this.pdfUrl = this.sanitizer.bypassSecurityTrustResourceUrl(URL.createObjectURL(selectedFile));
  //   }
  // }
  // CONVERTIR A BASE64 Y ALMACENAR EL CODIGO EN LA PROPIEDAD CERTIFICADO.DOCUMENTO
  convertToBase64(file: File): void {
    const reader = new FileReader();
    reader.onload = (e) => {
      const base64String = reader.result as string;
      // Almacena la cadena en base64 en la propiedad documento del objeto resolucion
      this.documento = base64String.split(',')[1];
      this.peso_documento = file.size;
    };
    reader.readAsDataURL(file);
  }

  onFileSelected(event: any): void {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      // Muestra el PDF (esto puedes dejarlo)
      this.pdfUrl = this.sanitizer.bypassSecurityTrustResourceUrl(URL.createObjectURL(selectedFile));
      
      // Envía el archivo al backend
      this.guardarPDF(selectedFile,'prueba_upload');
    }
  }

  guardarPDF(file: File, folderPath: string) {
    this.digitalizacionService.uploadPDF(file, folderPath).subscribe({
      next: (data: any) => {
        console.log(data);
      },
      error: (error) => {
        console.log(error);
      },
      complete: () => {
        console.log('pdf subido correctamente');
      }
    })
  }
  // #endregion ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

  closeModal() {
    this.myModal.hide();
    this.LimpiarDatosDigitalizacion();

  }

  openModalReception(id_expediente: number) {

    this.modificarDigitalizacion = false;
    this.myModal = new bootstrap.Modal(document.getElementById('exampleModalReception'));
    this.myModal.show();
    this.id_expediente_temp = id_expediente;

  }

  openModalDigitalizacion(id_expediente: number) {

    // this.myModal.hide();
    this.id_expediente_temp = id_expediente;
    this.mostrar_obs_preparacion = false;
    this.myModal = new bootstrap.Modal(document.getElementById('exampleModalDigitalizacion'));
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
  
  EventAction(){
    if(this.modificarDigitalizacion){
      
    } else { 
     
    }
  }

  LimpiarDatosDigitalizacion() {

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

  ObternerDigitalizacionByIdExpediente(id_expediente: number) {

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
    this.ListObservaciones.push(valor);
    (document.getElementById('observacion') as HTMLInputElement).value='';
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
