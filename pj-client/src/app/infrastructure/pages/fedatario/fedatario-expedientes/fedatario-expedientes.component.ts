import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NavegatorComponent } from '../../../shared/components/navegator/navegator.component';
import { SubnavegatorComponent } from '../../../shared/components/subnavegator/subnavegator.component';
import { ExpedienteResponse } from '../../../../domain/dto/ExpedienteResponse.dto';
import { PreparacionResponseDataView } from '../../../../domain/dto/PreparacionResponse.dto';
import { DigitalizacionResponseDataView } from '../../../../domain/dto/DigitalizacionResponse.dto';
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
import { ControlService } from '../../../services/remoto/control/control.service';
import { FlujogramaRequest } from '../../../../domain/dto/FlujogramaRequest.dto';
import { CrearFlujogramaResponse } from '../../../../domain/dto/FlujogramaResponse.dto';
import { InfoInventarioComponent } from '../../../components/info-inventario/info-inventario.component';
import { NgxPaginationModule } from 'ngx-pagination';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ModificarEstadoResponse } from '../../../../domain/dto/EstadoResponse.dto';
import { ControlResponseDataView } from '../../../../domain/dto/ControlResponse.dto';


declare var bootstrap: any;

@Component({
  selector: 'app-fedatario-expedientes',
  imports: [NavegatorComponent, SubnavegatorComponent,InfoInventarioComponent, NgxPaginationModule, CommonModule, FormsModule ],
  templateUrl: './fedatario-expedientes.component.html',
  styleUrl: './fedatario-expedientes.component.css'
})
export class FedatarioExpedientesComponent implements OnInit {


  private myModal: any;
  id_inventario: number = 0;
  ListExpedientes: ExpedienteResponse[] = [];
  ListExpedientesTemp: ExpedienteResponse[] = [];

  nro_expediente_temp: string = '';
  id_expediente_temp: number = 0;
  modificarControl: boolean = false;
  codigo_inventario: string = '';
  pdfUrl: SafeResourceUrl | null = null;
  folderPath: string | null = null;
  p: number = 1;

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

  data_control : ControlResponseDataView = {
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
  ) { }

  ngOnInit(): void {
    this.id_inventario = this.activatedRoute.snapshot.params['id'];
    this.ListarExpedientes();
    this.ObternerCodigoInventario()
    this.pdfUrl = this.sanitizer.bypassSecurityTrustResourceUrl(`img/carga_error/error_carga.pdf`);
  }

  openModalReception(id_expediente: number) {
    this.id_expediente_temp = id_expediente;
    this.modificarControl = false;
    this.myModal = new bootstrap.Modal(document.getElementById('ModalReception'));
    this.myModal.show();
  }

  closeModal() {
    this.myModal.hide();

  }
  ModalFedatario(id_expediente: number, nro_expediente: string) {

    this.id_expediente_temp = id_expediente;
    this.myModal = new bootstrap.Modal(document.getElementById('ModalFedatario'));
    this.myModal.show();
    this.recuperarFile(nro_expediente);
    this.recuperarDataPreparacion(id_expediente);
    this.recuperarDataDigitalizacion(id_expediente);
    this.recuperarDataIndizacion(id_expediente);
    this.RecuperarDatosControl(id_expediente);



  }


  obtenerNroExpediente(nro_expediente: string) {
    this.nro_expediente_temp = nro_expediente;
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
          this.closeModal();
          this.EstadoFedatarioAceptado()
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

}
