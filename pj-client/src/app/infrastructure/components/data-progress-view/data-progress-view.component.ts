import { Component, Input, OnInit } from '@angular/core';
import { PreparacionService } from '../../services/remoto/preparacion/preparacion.service';
import { DigitalizacionService } from '../../services/remoto/digitalizacion/digitalizacion.service';
import { EstadoService } from '../../services/remoto/estado/estado.service';
import { FtpService } from '../../services/remoto/ftp/ftp.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { PreparacionResponseDataView } from '../../../domain/dto/PreparacionResponse.dto';
import { DigitalizacionResponseDataView } from '../../../domain/dto/DigitalizacionResponse.dto';
import { ExpedienteResponseDataView } from '../../../domain/dto/ExpedienteResponse.dto';
import { EstadoMensajesResponse } from '../../../domain/dto/EstadoResponse.dto';
import { Mensaje } from '../../../domain/models/Mensaje.model';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { ExpedienteService } from '../../services/remoto/expediente/expediente.service';
import { IndizacionResponseDataView } from '../../../domain/dto/IndizacionResponse.dto';
import { IndizacionService } from '../../services/remoto/indizacion/indizacion.service';
import { ControlService } from '../../services/remoto/control/control.service';
import { FechaConFormato } from '../../functions/formateDate';
import { ControlResponseDataView } from '../../../domain/dto/ControlResponse.dto';

@Component({
  selector: 'app-data-progress-view',
  imports: [FormsModule, CommonModule],
  templateUrl: './data-progress-view.component.html',
  styleUrl: './data-progress-view.component.css'
})
export class DataProgressViewComponent {
  @Input() id_expediente: any;
  @Input() modulo: string = '';

  ListObservacionesPreparacion: string[] = [];
  ListObservacionesDigitalizacion: string[] = [];
  ListObservacionesIndizacion: string[] = [];
  ListObservacionesControl: string[] = [];
  ListDamandantes: any[] = []
  ListDamandados: any[] = []
  dataIndice: any = [];
  MensajesExpedienteTemp: Mensaje[] = [];

  pdfUrl: SafeResourceUrl | null = null;
  mostrar_mensajes_expediente: boolean = false;



  data_expediente_header: ExpedienteResponseDataView = {
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
    fecha_inicial: null,
    fecha_final: null,
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

  constructor(
    private preparacionService: PreparacionService,
    private digitalizacionService: DigitalizacionService,
    private indizacionService: IndizacionService,
    private controlService: ControlService,
    private ftpService: FtpService,
    private sanitizer: DomSanitizer,
    private expedienteService: ExpedienteService,
    private estadoService: EstadoService) { }

  ngOnInit(): void {

    this.ObtenerMensajesById_expediente()
    this.ObtenerExpedienteDataViewXid()
    this.ObtenerPreparacionByIdExpediente()
    this.pdfUrl = this.sanitizer.bypassSecurityTrustResourceUrl(`img/carga_error/error_carga.pdf`);
    if (this.modulo == 'DIGITALIZACION') { this.ObtenerDigitalizacionByIdExpediente() }
    if (this.modulo == 'INDIZACION') { this.ObtenerDigitalizacionByIdExpediente(), this.recuperarDataIndizacion() }
    if (this.modulo == 'CONTROL') { this.ObtenerDigitalizacionByIdExpediente(), this.recuperarDataIndizacion(), this.RecuperarDatosControl()}

  }

  ObtenerPreparacionByIdExpediente() {

    this.preparacionService.ObtenerPreparacionDataViewXidExpediente(this.id_expediente).subscribe({
      next: (data: PreparacionResponseDataView) => {
        this.data_preparacion = data;
        this.ListObservacionesPreparacion = this.data_preparacion.observaciones?.split('|') ?? [];
      },
      error: (error) => {
        console.log(error);
      },
      complete: () => {
        console.log('listado de preparacion detalle completado');
      }
    })
  }

  ObtenerDigitalizacionByIdExpediente() {

    this.digitalizacionService.ObtenerDigitalizacionDataViewXidExpediente(this.id_expediente).subscribe({
      next: (data: DigitalizacionResponseDataView) => {
        this.data_digitalizacion = data;
        this.ListObservacionesDigitalizacion = this.data_digitalizacion.observaciones?.split('|') ?? [];
      },
      error: (error) => {
        console.log(error);
      },
      complete: () => {
        console.log('listado de digitalizacion detalle completado');

      }
    })
  }

  ObtenerMensajesById_expediente() {
    this.estadoService.ObtenerMensajesById_expediente(this.id_expediente).subscribe({
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

  recuperarFile() {
    let fileName = this.data_expediente_header.nro_expediente + '.pdf';
    let folderPath = `${this.data_expediente_header.codigo_inventario}/EXPEDIENTES`;
    console.log('ftp:', folderPath, fileName)
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


  ObtenerExpedienteDataViewXid() {
    this.expedienteService.ObtenerExpedienteDataViewXid(this.id_expediente).subscribe({
      next: (data: ExpedienteResponseDataView) => {
        this.data_expediente_header = data;
        console.log(this.data_expediente_header);
      },
      error: (error) => {
        console.log(error);
      },
      complete: () => {
        console.log('listado de preparacion detalle completado');
        this.recuperarFile()
      }
    })
  }


  recuperarDataIndizacion() {
    this.indizacionService.ObtenerIndizacionDataViewXidExpediente(this.id_expediente).subscribe({
      next: (data: IndizacionResponseDataView) => {
        this.data_indizacion = data;
        this.ListObservacionesIndizacion = data.observaciones?.split('|') ?? [];
        this.ListDamandantes = JSON.parse(data.demandante ? data.demandante : '[]');
        this.ListDamandados = JSON.parse(data.demandado ? data.demandado : '[]');
        // (document.getElementById('fecha_inicio') as HTMLInputElement).value = FechaConFormato(data.fecha_inicial!);
        // (document.getElementById('fecha_final') as HTMLInputElement).value = FechaConFormato(data.fecha_final!);

        this.data_indizacion.fecha_inicial = FechaConFormato(data.fecha_inicial!);;
        this.data_indizacion.fecha_final = FechaConFormato(data.fecha_final!);
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

  RecuperarDatosControl() {
    this.controlService.ObtenerControlDataViewXidExpediente(this.id_expediente).subscribe({
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

}
