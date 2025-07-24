import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NavegatorComponent } from '../../../shared/components/navegator/navegator.component';
import { SubnavegatorComponent } from '../../../shared/components/subnavegator/subnavegator.component';
import { InfoInventarioComponent } from '../../../components/info-inventario/info-inventario.component';
import { DiscoService } from '../../../services/remoto/disco/disco.service';
import { DiscoRequest } from '../../../../domain/dto/DiscoRequest.dto';
import { InventarioService } from '../../../services/remoto/inventario/inventario.service';
import { CredencialesService } from '../../../services/local/credenciales.service';
import { InventarioResponse } from '../../../../domain/dto/InventarioResponse.dto';
import { InventarioModel } from '../../../../domain/models/Inventario.model';
import { DiscoListaResponse, ModificarDiscoResponse } from '../../../../domain/dto/DiscoResponse.dto';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { DiscoModel } from '../../../../domain/models/Disco.model';
import { SafeResourceUrl, DomSanitizer } from '@angular/platform-browser';
import { FtpService } from '../../../services/remoto/ftp/ftp.service';
import { CrearDigitalizacionResponse } from '../../../../domain/dto/DigitalizacionResponse.dto';
import { ExpedienteService } from '../../../services/remoto/expediente/expediente.service';
import { ExpedienteSinDiscoResponse } from '../../../../domain/dto/ExpedienteResponse.dto';

declare var bootstrap: any;

@Component({
  selector: 'app-boveda-expedientes',
  imports: [NavegatorComponent, SubnavegatorComponent, InfoInventarioComponent, FormsModule, CommonModule],
  templateUrl: './boveda-expedientes.component.html',
  styleUrl: './boveda-expedientes.component.css'
})
export class BovedaExpedientesComponent implements OnInit {
  private myModalCrearDisco: any;
  private myModalActaApertura: any;
  private myModalActaCierre: any;
  private myModalTarjetaApertura: any;
  private myModalTarjetaCierre: any;

  pdfUrlActaApertura: SafeResourceUrl | null = null;
  pdfUrlActaCierre: SafeResourceUrl | null = null;
  pdfUrlTarjetaApertura: SafeResourceUrl | null = null;
  pdfUrlTarjetaCierre: SafeResourceUrl | null = null;

  id_inventario: number = 0;
  file: File | null = null;

  list_data_discos:  DiscoListaResponse[] = [];
  isLoading: boolean[] = [];
  ListExpedientesPendentesDisco: ExpedienteSinDiscoResponse[] = [];

  porcentajeExpedientes: number = 0;

  data_inventario: InventarioModel = {
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

  data_disco_temp: DiscoModel = {
    id_disco: 0,
    id_inventario: 0,
    id_responsable_crear: 0,
    nombre: '',
    volumen: 0,
    capacidad_gb: 0,
    peso_ocupado: 0,
    dir_ftp_acta_apertura: '',
    dir_ftp_acta_cierre: '',
    dir_ftp_tarjeta_apertura: '',
    dir_ftp_tarjeta_cierre: '',
    peso_acta_apertura: 0,
    peso_acta_cierre: 0,
    peso_tarjeta_apertura: 0,
    peso_tarjeta_cierre: 0,
    fecha_acta_apertura: null,
    fecha_acta_cierre: null,
    fecha_tarjeta_apertura: null,
    fecha_tarjeta_cierre: null,
    id_responsable_tca: 0,
    id_responsable_tcc: 0,
    id_responsable_aa: 0,
    id_responsable_ac: 0,
    estado_cerrado: false,
    id_responsable_cierre: 0,
  }

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private discoService: DiscoService,
    private credencialesService: CredencialesService,
    private inventarioService: InventarioService,
    private sanitizer: DomSanitizer,
    private expedienteService: ExpedienteService,
    private ftpService:FtpService) { }

  ngOnInit(): void {
    this.id_inventario = this.activatedRoute.snapshot.params['id'];
    this.ObternerDatosInventario()
    this.pdfUrlTarjetaCierre = this.sanitizer.bypassSecurityTrustResourceUrl(`img/carga_error/error_carga.pdf`);
    this.pdfUrlTarjetaApertura = this.sanitizer.bypassSecurityTrustResourceUrl(`img/carga_error/error_carga.pdf`);
    this.pdfUrlActaCierre = this.sanitizer.bypassSecurityTrustResourceUrl(`img/carga_error/error_carga.pdf`);
    this.pdfUrlActaApertura = this.sanitizer.bypassSecurityTrustResourceUrl(`img/carga_error/error_carga.pdf`);
  }

  openModalCrearDisco() {
    this.myModalCrearDisco = new bootstrap.Modal(document.getElementById('ModalCrearDisco'));
    this.myModalCrearDisco.show();
  }

  closeModalCrearDisco() {
    this.myModalCrearDisco.hide();
  }

  openModalRegistrarActaApertura(disco: DiscoModel) {
    this.myModalActaApertura = new bootstrap.Modal(document.getElementById('exampleModalActaApertura'));
    this.myModalActaApertura.show();
    this.pdfUrlActaApertura = this.sanitizer.bypassSecurityTrustResourceUrl(`img/carga_error/error_carga.pdf`);
    this.data_disco_temp = disco;
    console.log(disco)
    
  }
  closeModalRegistrarActaApertura() {
    this.myModalActaApertura.hide();
  }

  openModalRegistrarActaCierre(disco: DiscoModel) {
    this.myModalActaCierre = new bootstrap.Modal(document.getElementById('exampleModalActaCierre'));
    this.myModalActaCierre.show();
    this.pdfUrlActaCierre = this.sanitizer.bypassSecurityTrustResourceUrl(`img/carga_error/error_carga.pdf`);
    this.data_disco_temp = disco;
    console.log(disco)
    
  }
  closeModalRegistrarActaCierre() {
    this.myModalActaCierre.hide();
  }

  openModalRegistrarTarjetaApertura(disco: DiscoModel) {
    this.myModalTarjetaApertura = new bootstrap.Modal(document.getElementById('exampleModaltarjetaApertura'));
    this.myModalTarjetaApertura.show(); 
    this.pdfUrlTarjetaApertura = this.sanitizer.bypassSecurityTrustResourceUrl(`img/carga_error/error_carga.pdf`);
    this.data_disco_temp = disco;
    console.log(disco);
  }

  closeModalRegistrarTarjetaApertura() {
    this.myModalTarjetaApertura.hide();
  }

  openModalRegistrarTarjetaCierre(disco: DiscoModel) {
    this.myModalTarjetaCierre = new bootstrap.Modal(document.getElementById('exampleModaltarjetaCierre'));
    this.myModalTarjetaCierre.show();
    this.pdfUrlTarjetaCierre = this.sanitizer.bypassSecurityTrustResourceUrl(`img/carga_error/error_carga.pdf`);
    this.data_disco_temp = disco;
    console.log(disco)
    
  }
  closeModalRegistrarTarjetaCierre() {
    this.myModalTarjetaCierre.hide();
  }

  crearDisco() {
    const data_disco_temp: DiscoRequest = {
      id_inventario: this.data_inventario.id_inventario,
      id_responsable_crear: this.credencialesService.credenciales.id_usuario,
      nombre: `${this.data_inventario.codigo}V${this.list_data_discos.length + 1}`,
      capacidad_gb: 25,
      volumen : this.list_data_discos.length +1,
      app_user: this.credencialesService.credenciales.username
    }

    console.log(data_disco_temp)

    this.discoService.CrearDisco(data_disco_temp).subscribe({
      next: (data: any) => {
        console.log(data.text);
      },
      error: (error) => {
        console.log(error);
      },
      complete: () => {
        console.log('creacion de disco completado');
        this.listarDiscosByInventario(this.data_inventario.id_inventario);
        this.closeModalCrearDisco();
      }
    })
  }

  listarDiscosByInventario(id_inventario: number) {
    this.discoService.ListarDiscosByInventario(id_inventario).subscribe({
      next: (data: DiscoListaResponse[]) => {
        this.list_data_discos = data;
        console.log(this.list_data_discos);
      },
      error: (error) => {
        console.log(error);
      },
      complete: () => {
        console.log('listado de discos completado');
      }
    })
  }

  listarExpedientesPendentesDisco(id_inventario: number) {
    this.expedienteService.ObtenerExpedientesById_inventario_sinDisco(id_inventario).subscribe({
      next: (data: ExpedienteSinDiscoResponse[]) => {
        this.ListExpedientesPendentesDisco = data;
         this.porcentajeExpedientes = this.calcularPorcentajeAcumlado(data);
        console.log(this.ListExpedientesPendentesDisco);
      },
      error: (error) => {
        console.log(error);
      },
      complete: () => {
        console.log('listado de expedientes pendientes disco completado');
      }
    })
  }

  private calcularPorcentajeAcumlado(expedientes: ExpedienteSinDiscoResponse[]): number {
    const pesoTotalBytes = expedientes.reduce((total, exp) => total + (exp.peso_doc || 0), 0);
    const totalPermitido = 23 * 1024 * 1024 * 1024; // 25 GB en bytes
  
    const porcentaje = (pesoTotalBytes / totalPermitido) * 100;
    return parseFloat(porcentaje.toFixed(2)); // redondeado a 2 decimales
  }

  ObternerDatosInventario() {
    const params = this.activatedRoute.snapshot.params;
    this.inventarioService.ObtenerInventarioDetalle(params['id']).subscribe({
      next: (data: InventarioResponse) => {
        this.data_inventario = data;
        this.listarDiscosByInventario(data.id_inventario)
        this.listarExpedientesPendentesDisco(data.id_inventario)
      },
      error: (error) => {
        console.log(error);
      },
      complete: () => {
        console.log('listado de inventarios completado');
      }
    })
  }


    //#region EVENTO SELECCIONADOR DE DOCUMENTO +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
    onFileSelectedTarjetaApertura(event: any): void {
      const selectedFile = event.target.files[0];
      if (selectedFile) {
        this.pdfUrlTarjetaApertura = this.sanitizer.bypassSecurityTrustResourceUrl(URL.createObjectURL(selectedFile));
        console.log(selectedFile)
        this.file = selectedFile;
      }
    }
    onFileSelectedTarjetaCierre(event: any): void {
      const selectedFile = event.target.files[0];
      if (selectedFile) {
        this.pdfUrlTarjetaCierre = this.sanitizer.bypassSecurityTrustResourceUrl(URL.createObjectURL(selectedFile));
        console.log(selectedFile)
        this.file = selectedFile;
      }
    }
    onFileSelectedActaApertura(event: any): void {
      const selectedFile = event.target.files[0];
      if (selectedFile) {
        this.pdfUrlActaApertura = this.sanitizer.bypassSecurityTrustResourceUrl(URL.createObjectURL(selectedFile));
        console.log(selectedFile)
        this.file = selectedFile;
      }
    }
    onFileSelectedActaCierre(event: any): void {
      const selectedFile = event.target.files[0];
      if (selectedFile) {
        this.pdfUrlActaCierre = this.sanitizer.bypassSecurityTrustResourceUrl(URL.createObjectURL(selectedFile));
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
        
        const folderPathDisco = `${this.data_inventario.codigo}/DISCOS/${this.data_disco_temp.nombre}`;
        // `${this.data_inventario.codigo}V${this.list_data_discos.length + 1}`
        // Subir portada primero
        this.ftpService.uploadFile(file, folderPathDisco, nameFile).subscribe({
          next: (data: CrearDigitalizacionResponse) => {
            console.log("Respuesta portada:", data);
          },
          error: (error) => {
            console.error("Error al subir la portada:", error);
            alert("Error al subir la portada. Detalle: " + (error?.message || ''));
          },
          complete: () => {
            console.log("Portada subida correctamente");
    
          }
        });
    
      } catch (error) {
        console.error("Error al procesar el PDF:", error);
        alert("Ocurrió un error al extraer la primera hoja del PDF.");
      }
    }
    
    // #endregion ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

    guardarPDFTarjetaCalibracionApertura() {
      const nameFile = `TCA.pdf`;
      this.guardarPDF(this.file!, nameFile);
      this.guardarDataDiscoTarjetaApertura()
    }
    guardarPDFTarjetaCalibracionCierre() {
      const nameFile = `TCC.pdf`;
      this.guardarPDF(this.file!, nameFile);
      this.AgregarDataDiscoTarjetaCierre()
    }
    guardarPDFActaApertura() {
      const nameFile = `AA.pdf`;
      this.guardarPDF(this.file!, nameFile);
      this.AgregarDataDiscoActaApertura()
    }
    guardarPDFActaCierre() {
      const nameFile = `AC.pdf`;
      this.guardarPDF(this.file!, nameFile);
      this.AgregarDataDiscoActaCierre()
    }

    // -------------------------------------------------------------------------------------------------------------------------
   guardarDataDiscoTarjetaApertura() {
    const data_disco_aux: DiscoRequest = {
     
      dir_ftp_tarjeta_apertura:  `${this.data_inventario.codigo}/DISCOS/${this.data_disco_temp.nombre}`,
      peso_tarjeta_apertura: this.file ? this.file.size : 0,
      fecha_tarjeta_apertura: new Date(),
      id_responsable_tca: this.credencialesService.credenciales.id_usuario,
      app_user: this.credencialesService.credenciales.username
    }

    console.log(data_disco_aux)

    this.discoService.AgregarDataDiscoTarjetaApertura(this.data_disco_temp.id_disco!,data_disco_aux).subscribe(
      {
        next: (data: ModificarDiscoResponse) => {
          console.log(data.message);
        },
        error: (error) => {
          console.log(error);
        },
        complete: () => {
          console.log('modificacion de disco tarjeta apertura completada');
          this.listarDiscosByInventario(this.data_inventario.id_inventario)
          this.closeModalRegistrarTarjetaApertura();
        }
      })
    
   }

   AgregarDataDiscoTarjetaCierre() {
      const data_disco_aux: DiscoRequest = {
       
        dir_ftp_tarjeta_cierre:  `${this.data_inventario.codigo}/DISCOS/${this.data_disco_temp.nombre}`,
        peso_tarjeta_cierre: this.file ? this.file.size : 0,
        fecha_tarjeta_cierre: new Date(),
        id_responsable_tcc: this.credencialesService.credenciales.id_usuario,
        app_user: this.credencialesService.credenciales.username
      }
  
      console.log(data_disco_aux)
  
      this.discoService.AgregarDataDiscoTarjetaCierre(this.data_disco_temp.id_disco!,data_disco_aux).subscribe(
        {
          next: (data: ModificarDiscoResponse) => {
            console.log(data.message);
          },
          error: (error) => {
            console.log(error);
          },
          complete: () => {
            console.log('modificacion de disco tarjeta cierre completada');
            this.listarDiscosByInventario(this.data_inventario.id_inventario)
            this.closeModalRegistrarTarjetaCierre();
          }
        })  
   }

   AgregarDataDiscoActaApertura() {
    const data_disco_aux: DiscoRequest = {
     
      dir_ftp_acta_apertura:  `${this.data_inventario.codigo}/DISCOS/${this.data_disco_temp.nombre}`,
      peso_acta_apertura: this.file ? this.file.size : 0,
      fecha_acta_apertura: new Date(),
      id_responsable_aa: this.credencialesService.credenciales.id_usuario,
      app_user: this.credencialesService.credenciales.username
    }

    console.log(data_disco_aux)

    this.discoService.AgregarDataDiscoActaApertura(this.data_disco_temp.id_disco!,data_disco_aux).subscribe(
      {
        next: (data: ModificarDiscoResponse) => {
          console.log(data.message);
        },
        error: (error) => {
          console.log(error);
        },
        complete: () => {
          console.log('modificacion de disco acta apertura completada');
          this.listarDiscosByInventario(this.data_inventario.id_inventario)
          this.closeModalRegistrarActaApertura();
        }
      })
    
   }

   AgregarDataDiscoActaCierre() {
    const data_disco_aux: DiscoRequest = {
     
      dir_ftp_acta_cierre:  `${this.data_inventario.codigo}/DISCOS/${this.data_disco_temp.nombre}`,
      peso_acta_cierre: this.file ? this.file.size : 0,
      fecha_acta_cierre: new Date(),
      id_responsable_ac: this.credencialesService.credenciales.id_usuario,
      app_user: this.credencialesService.credenciales.username
    }

    console.log(data_disco_aux)

    this.discoService.AgregarDataDiscoActaCierre(this.data_disco_temp.id_disco!,data_disco_aux).subscribe(
      {
        next: (data: ModificarDiscoResponse) => {
          console.log(data.message);
        },
        error: (error) => {
          console.log(error);
        },
        complete: () => {
          console.log('modificacion de disco acta cierre completada');
          this.listarDiscosByInventario(this.data_inventario.id_inventario)
          this.closeModalRegistrarActaCierre();
        }
      })
    
   }

   CerrarDisco(disco:any) {
    const data_disco_aux: DiscoRequest = {
      id_responsable_cierre: this.credencialesService.credenciales.id_usuario,
      app_user: this.credencialesService.credenciales.username
    }

    console.log(data_disco_aux)

    this.discoService.CerrarDisco(disco.id_disco!,data_disco_aux).subscribe(
      {
        next: (data: ModificarDiscoResponse) => {
          console.log(data.message);
        },
        error: (error) => {
          console.log(error);
        },
        complete: () => {
          console.log('modificacion de disco acta cierre completada');
          this.listarDiscosByInventario(this.data_inventario.id_inventario)
          this.closeModalRegistrarActaCierre();
        }
      })

      
   }

   

  

}
