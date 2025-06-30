import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NavegatorComponent } from '../../../shared/components/navegator/navegator.component';
import { SafeResourceUrl, DomSanitizer } from '@angular/platform-browser';
import { SubnavegatorComponent } from '../../../shared/components/subnavegator/subnavegator.component';
import { InfoInventarioComponent } from '../../../components/info-inventario/info-inventario.component';
import { ExpedienteResponse } from '../../../../domain/dto/ExpedienteResponse.dto';
import { ExpedienteService } from '../../../services/remoto/expediente/expediente.service';
import { NgxPaginationModule } from 'ngx-pagination';
import { map } from 'rxjs';
import { FlujogramaRequest } from '../../../../domain/dto/FlujogramaRequest.dto';
import { CredencialesService } from '../../../services/local/credenciales.service';
import { FlujogramaService } from '../../../services/remoto/flujograma/flujograma.service';
import { CrearFlujogramaResponse } from '../../../../domain/dto/FlujogramaResponse.dto';
import { EstadoService } from '../../../services/remoto/estado/estado.service';
import { ModificarEstadoResponse } from '../../../../domain/dto/EstadoResponse.dto';
import { CommonModule } from '@angular/common';
import { FtpService } from '../../../services/remoto/ftp/ftp.service';
import { InventarioResponse } from '../../../../domain/dto/InventarioResponse.dto';
import { InventarioService } from '../../../services/remoto/inventario/inventario.service';

declare var bootstrap: any;

@Component({
  selector: 'app-control-expedientes',
  imports: [NavegatorComponent, SubnavegatorComponent, InfoInventarioComponent, NgxPaginationModule, CommonModule],
  templateUrl: './control-expedientes.component.html',
  styleUrl: './control-expedientes.component.css'
})
export class ControlExpedientesComponent implements OnInit {
  private myModal: any;
  id_inventario: number = 0;
  ListExpedientes: ExpedienteResponse[] = [];
  ListExpedientesTemp: ExpedienteResponse[] = [];
  ListObservacionesIndizacion: string[] = [];
  nro_expediente_temp: string = '';
  id_expediente_temp: number = 0;
  modificarControl: boolean = false;
  codigo_inventario: string = '';
  pdfUrl: SafeResourceUrl | null = null;
  folderPath: string | null = null;
  p: number = 1;
  constructor(private router: Router,
    private activatedRoute: ActivatedRoute,
    private expedienteService: ExpedienteService,
    private credencialesService: CredencialesService,
    private flujogramaService: FlujogramaService,
    private estadoService: EstadoService,
    private sanitizer: DomSanitizer,
    private ftpService: FtpService,
    private inventarioService: InventarioService,
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
  openModalControl(id_expediente: number) {

    this.id_expediente_temp = id_expediente;
    this.myModal = new bootstrap.Modal(document.getElementById('ModalIndizacion'));
    this.myModal.show();
    this.recuperarFile();

  }

  recuperarFile() {
    let fileName = this.nro_expediente_temp + '.pdf';
    let folderPath = this.folderPath!;
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
     // this.ModificarControl()

    } else {
     // this.GuardarControl()
    }
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
  obtenerNroExpediente(nro_expediente: string) {
    this.nro_expediente_temp = nro_expediente;
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


  AgregarObservacion() {
    const valor = (document.getElementById('observacion') as HTMLInputElement).value;
    this.ListObservacionesIndizacion.push(valor);
    (document.getElementById('observacion') as HTMLInputElement).value = '';
  }

  EliminarObservacion(index: number) {
    this.ListObservacionesIndizacion.splice(index, 1);
  }

  SubirObservacion(index: number) {
    if (index > 0) {
      const temp = this.ListObservacionesIndizacion[index - 1];
      this.ListObservacionesIndizacion[index - 1] = this.ListObservacionesIndizacion[index];
      this.ListObservacionesIndizacion[index] = temp;
    }
  }

  BajarObservacion(index: number) {
    if (index < this.ListObservacionesIndizacion.length - 1) {
      const temp = this.ListObservacionesIndizacion[index + 1];
      this.ListObservacionesIndizacion[index + 1] = this.ListObservacionesIndizacion[index];
      this.ListObservacionesIndizacion[index] = temp;
    }
  }

}
