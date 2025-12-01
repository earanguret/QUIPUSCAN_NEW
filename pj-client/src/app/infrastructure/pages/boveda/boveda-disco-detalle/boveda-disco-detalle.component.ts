import { Component, OnInit } from '@angular/core';
import { NavegatorComponent } from '../../../shared/components/navegator/navegator.component';
import { SubnavegatorComponent } from '../../../shared/components/subnavegator/subnavegator.component';
import { ActivatedRoute } from '@angular/router';
import { InfoInventarioComponent } from '../../../components/info-inventario/info-inventario.component';
import { ExpedienteService } from '../../../services/remoto/expediente/expediente.service';
import { ExpedientesDiscoResponse, ExpedienteSinDiscoResponse } from '../../../../domain/dto/ExpedienteResponse.dto';
import { DiscoResponse, ModificarDiscoResponse } from '../../../../domain/dto/DiscoResponse.dto';
import { DiscoService } from '../../../services/remoto/disco/disco.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UsuarioService } from '../../../services/remoto/usuario/usuario.service';
import { UsuarioResponse } from '../../../../domain/dto/UsuarioResponse.dto';
import { firstValueFrom } from 'rxjs';
import { SafeResourceUrl, DomSanitizer } from '@angular/platform-browser';
import { CrearDigitalizacionResponse } from '../../../../domain/dto/DigitalizacionResponse.dto';
import { DiscoRequest } from '../../../../domain/dto/DiscoRequest.dto';
import { CredencialesService } from '../../../services/local/credenciales.service';
import { SftpService } from '../../../services/remoto/sftp/sftp.service';
import { EstadoAsociarExpedientesADiscoRequest } from '../../../../domain/dto/EstadoRequest.dto';
import { EstadoService } from '../../../services/remoto/estado/estado.service';
import { AsociarExpedientesADiscoResponse } from '../../../../domain/dto/EstadoResponse.dto';

declare var bootstrap: any;

@Component({
  selector: 'app-boveda-disco-detalle',
  imports: [NavegatorComponent, SubnavegatorComponent, InfoInventarioComponent, CommonModule, FormsModule],
  templateUrl: './boveda-disco-detalle.component.html',
  styleUrl: './boveda-disco-detalle.component.css'
})
export class BovedaDiscoDetalleComponent implements OnInit {
 cargandoZip = false; // variable para indicar si se está descargando el ZIP
  
  private myModalActaApertura: any;
  private myModalActaCierre: any;
  private myModalTarjetaApertura: any;
  private myModalTarjetaCierre: any;

  pdfUrlActaApertura: SafeResourceUrl | null = null;
  pdfUrlActaCierre: SafeResourceUrl | null = null;
  pdfUrlTarjetaApertura: SafeResourceUrl | null = null;
  pdfUrlTarjetaCierre: SafeResourceUrl | null = null;

  id_inventario: number = 0;
  cantidadFojas: number = 0;

  ListExpedientesPendentesDisco: ExpedienteSinDiscoResponse[] = [];
  ListExpedientesDisco: ExpedientesDiscoResponse[] = [];

  ListExpedientes_temp: any[] = [];

  file: File | null = null;

  porcentajeExpedientes: number = 0;
  peso_limite: number = 23 * 1024 * 1024 * 1024; // 23 GB en bytes, dejamos un margen de 2GB

  responsable_aa: UsuarioResponse = {
    id_usuario: 0,
    id_persona: 0,
    username: '',
    perfil: '',
    estado: null,
    nombre: '',
    ap_paterno: '',
    ap_materno: '',
    dni: ''
  };
  responsable_ac: UsuarioResponse = {
    id_usuario: 0,
    id_persona: 0,
    username: '',
    perfil: '',
    estado: null,
    nombre: '',
    ap_paterno: '',
    ap_materno: '',
    dni: ''
  };
  responsable_tca: UsuarioResponse = {
    id_usuario: 0,
    id_persona: 0,
    username: '',
    perfil: '',
    estado: null,
    nombre: '',
    ap_paterno: '',
    ap_materno: '',
    dni: ''
  };

  responsable_tcc: UsuarioResponse = {
    id_usuario: 0,
    id_persona: 0,
    username: '',
    perfil: '',
    estado: null,
    nombre: '',
    ap_paterno: '',
    ap_materno: '',
    dni: ''
  };

  data_disco: DiscoResponse = {
    id_disco: 0,
    id_inventario: 0,
    id_responsable_crear: 0,
    nombre: '',
    volumen: 0,
    capacidad_gb: 0,
    espacio_ocupado: 0,
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
    private activatedRoute: ActivatedRoute,
    private expedienteService: ExpedienteService,
    private discoService: DiscoService,
    private usuarioService: UsuarioService,
    private sanitizer: DomSanitizer,
    private credencialesService: CredencialesService,
    private sftpService: SftpService,
    private estadoService: EstadoService,
  ) { }

  ngOnInit(): void {
    this.id_inventario = this.activatedRoute.snapshot.params['id_inventario'];
    console.log('el id_inventario es: ' + this.id_inventario);
    this.ObtenerDatosDisco();
    this.pdfUrlTarjetaCierre = this.sanitizer.bypassSecurityTrustResourceUrl(`img/carga_error/error_carga.pdf`);
    this.pdfUrlTarjetaApertura = this.sanitizer.bypassSecurityTrustResourceUrl(`img/carga_error/error_carga.pdf`);
    this.pdfUrlActaCierre = this.sanitizer.bypassSecurityTrustResourceUrl(`img/carga_error/error_carga.pdf`);
    this.pdfUrlActaApertura = this.sanitizer.bypassSecurityTrustResourceUrl(`img/carga_error/error_carga.pdf`);
    this.inicializadorModales()
  }

  inicializadorModales() {
    this.myModalTarjetaApertura = new bootstrap.Modal(document.getElementById('exampleModaltarjetaApertura'), {
      backdrop: true,
      keyboard: true
    });
    this.myModalTarjetaCierre = new bootstrap.Modal(document.getElementById('exampleModaltarjetaCierre'), {
      backdrop: true,
      keyboard: true
    });
    this.myModalActaApertura = new bootstrap.Modal(document.getElementById('exampleModalActaApertura'), {
      backdrop: true,
      keyboard: true
    });
    this.myModalActaCierre = new bootstrap.Modal(document.getElementById('exampleModalActaCierre'), {
      backdrop: true,
      keyboard: true
    });
  }
  openModalActaApertura() {
    this.myModalActaApertura.show();
  }
  closeModalActaApertura() {
    this.myModalActaApertura.hide();
  }

  openModalActaCierre() {
    this.myModalActaCierre.show();
  }
  closeModalActaCierre() {
    this.myModalActaCierre.hide();
  }

  openModalTarjetaApertura() {
    this.myModalTarjetaApertura.show();
  }
  closeModalTarjetaApertura() {
    this.myModalTarjetaApertura.hide();
  }
  openModalTarjetaCierre() {
    this.myModalTarjetaCierre.show();
  }
  closeModalTarjetaCierre() {
    this.myModalTarjetaCierre.hide();
  }

  ObtenerDatosDisco() {
    const params = this.activatedRoute.snapshot.params;
    this.discoService.ObtenerDiscoDetalle(params['id_disco']).subscribe({
      next: (data: DiscoResponse) => {
        this.data_disco = data;
        console.log(this.data_disco);
        if (this.data_disco.estado_cerrado == null) {
          this.listarExpedientesPendentesDisco(data.id_inventario!);
        } else {
          this.ObtenerExpedientesDisco(data.id_inventario!, data.id_disco!);
        }

      },
      error: (error) => {
        console.log(error);
      },
      complete: () => {
        console.log('listado de inventarios completado');
        this.obtenerResponsables();
      }
    })
  }

  listarExpedientesPendentesDisco(id_inventario: number) {
    this.expedienteService.ObtenerExpedientesById_inventario_sinDisco(id_inventario).subscribe({
      next: (data: ExpedienteSinDiscoResponse[]) => {
        this.ListExpedientesPendentesDisco = data;
        this.ListExpedientes_temp = data;
        this.porcentajeExpedientes = this.calcularPorcentajeAcumlado(data);
        this.calcularCantidadFojas(data);
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
  ObtenerExpedientesDisco(id_inventario: number, id_disco: number) {
    this.expedienteService.ObtenerExpedientesDisco(id_inventario, id_disco).subscribe({
      next: (data: ExpedientesDiscoResponse[]) => {
        this.ListExpedientesDisco = data;
        this.ListExpedientes_temp = data;
        this.porcentajeExpedientes = this.calcularPorcentajeAcumlado(data);
        this.calcularCantidadFojas(data);
        console.log(this.ListExpedientesDisco);
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
    const totalPermitido = this.peso_limite;
    const porcentaje = (pesoTotalBytes / totalPermitido) * 100;
    return parseFloat(porcentaje.toFixed(2)); // redondeado a 2 decimales
  }

  private calcularCantidadFojas(expedientes: any[]): void {
    this.cantidadFojas = expedientes.reduce((total, exp) => total + (exp.fojas_total || 0), 0);
  }

  private async ObtenerUsuarioDetalle(id_usuario: number): Promise<UsuarioResponse> {
    try {
      return await firstValueFrom(this.usuarioService.ObtenerUsuario(id_usuario));
    } catch (error) {
      console.error("Error obteniendo usuario", error);
      throw error;
    }
  }

  private async obtenerResponsables() {
    if (this.data_disco.id_responsable_aa != null) {
      this.responsable_aa = await this.ObtenerUsuarioDetalle(this.data_disco.id_responsable_aa);
      console.log(this.responsable_aa.nombre);
    }

    if (this.data_disco.id_responsable_ac != null) {
      this.responsable_ac = await this.ObtenerUsuarioDetalle(this.data_disco.id_responsable_ac);
      console.log(this.responsable_ac.nombre);
    }

    if (this.data_disco.id_responsable_tca != null) {
      this.responsable_tca = await this.ObtenerUsuarioDetalle(this.data_disco.id_responsable_tca);
      console.log(this.responsable_tca.nombre);
    }

    if (this.data_disco.id_responsable_tcc != null) {
      this.responsable_tcc = await this.ObtenerUsuarioDetalle(this.data_disco.id_responsable_tcc);
      console.log(this.responsable_tcc.nombre);
    }
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
    }else{
      console.log('no hay archivo seleccionado')
    }
  }

  async guardarPDF(file: File, nameFile: string) {
    let codigo_inventario = this.obtenerCodigoInventario(this.data_disco.nombre!);
    if (!file) {
      alert("El archivo no puede estar vacío");
      return;
    }
    try {

      const folderPathDisco = `${codigo_inventario}/DISCOS/${this.data_disco.nombre}`;
      this.sftpService.uploadFile(file, folderPathDisco, nameFile).subscribe({
        next: (data: CrearDigitalizacionResponse) => {
          console.log("Respuesta portada:", data.message);
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
    this.AgregarDataDiscoTarjetaApertura()
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

  obtenerCodigoInventario(cadena: string): string {
    const indiceV = cadena.lastIndexOf("V");

    // Si no existe "V", devolver tal cual
    if (indiceV === -1) return cadena;

    return cadena.substring(0, indiceV);
  }

  AgregarDataDiscoActaCierre() {
    let codigo_inventario = this.obtenerCodigoInventario(this.data_disco.nombre!);
    const data_disco_aux: DiscoRequest = {
      nombre: this.data_disco.nombre,
      dir_ftp_acta_cierre: `${codigo_inventario}/DISCOS/${this.data_disco.nombre}`,
      peso_acta_cierre: this.file ? this.file.size : 0,
      id_responsable_ac: this.credencialesService.credenciales.id_usuario,
      app_user: this.credencialesService.credenciales.username
    }

    this.discoService.AgregarDataDiscoActaCierre(this.data_disco.id_disco!, data_disco_aux).subscribe(
      {
        next: (data: ModificarDiscoResponse) => {
          console.log(data.message);
        },
        error: (error) => {
          console.log(error);
        },
        complete: () => {
          console.log('modificacion de disco acta cierre completada');
          this.ObtenerDatosDisco();
          this.closeModalActaCierre();
        }
      })

  }
  AgregarDataDiscoTarjetaApertura() {
    let codigo_inventario = this.obtenerCodigoInventario(this.data_disco.nombre!);
    const data_disco_aux: DiscoRequest = {
      nombre: this.data_disco.nombre,
      dir_ftp_tarjeta_apertura: `${codigo_inventario}/DISCOS/${this.data_disco.nombre}`,
      peso_tarjeta_apertura: this.file ? this.file.size : 0,
      id_responsable_tca: this.credencialesService.credenciales.id_usuario,
      app_user: this.credencialesService.credenciales.username
    }

    this.discoService.AgregarDataDiscoTarjetaApertura(this.data_disco.id_disco!, data_disco_aux).subscribe(
      {
        next: (data: ModificarDiscoResponse) => {
          console.log(data.message);
        },
        error: (error) => {
          console.log(error);
        },
        complete: () => {
          console.log('modificacion de disco tarjeta apertura completada');
          this.ObtenerDatosDisco();
          this.closeModalTarjetaApertura();
        }
      })
  }

  AgregarDataDiscoTarjetaCierre() {
    let codigo_inventario = this.obtenerCodigoInventario(this.data_disco.nombre!);
    const data_disco_aux: DiscoRequest = {
      nombre: this.data_disco.nombre,
      dir_ftp_tarjeta_cierre: `${codigo_inventario}/DISCOS/${this.data_disco.nombre}`,
      peso_tarjeta_cierre: this.file ? this.file.size : 0,
      id_responsable_tcc: this.credencialesService.credenciales.id_usuario,
      app_user: this.credencialesService.credenciales.username
    }
    this.discoService.AgregarDataDiscoTarjetaCierre(this.data_disco.id_disco!, data_disco_aux).subscribe(
      {
        next: (data: ModificarDiscoResponse) => {
          console.log(data.message);
        },
        error: (error) => {
          console.log(error);
        },
        complete: () => {
          console.log('modificacion de disco tarjeta cierre completada');
          this.ObtenerDatosDisco();
          this.closeModalTarjetaCierre();
        }
      })
  }

  AgregarDataDiscoActaApertura() {
    let codigo_inventario = this.obtenerCodigoInventario(this.data_disco.nombre!);
    const data_disco_aux: DiscoRequest = {
      nombre: this.data_disco.nombre,
      dir_ftp_acta_apertura: `${codigo_inventario}/DISCOS/${this.data_disco.nombre}`,
      peso_acta_apertura: this.file ? this.file.size : 0,
      id_responsable_aa: this.credencialesService.credenciales.id_usuario,
      app_user: this.credencialesService.credenciales.username
    }

    this.discoService.AgregarDataDiscoActaApertura(this.data_disco.id_disco!, data_disco_aux).subscribe(
      {
        next: (data: ModificarDiscoResponse) => {
          console.log(data.message);
        },
        error: (error) => {
          console.log(error);
        },
        complete: () => {
          console.log('modificacion de disco acta apertura completada');
          this.ObtenerDatosDisco();
          this.closeModalActaApertura();
        }
      })

  }



  CerrarDisco() {
    const limiteBytes = this.peso_limite; // 23 GB en bytes
    let acumulado = 0;
    const listaFinal: ExpedienteSinDiscoResponse[] = [];

    for (const exp of this.ListExpedientesPendentesDisco) {
      const peso = exp.peso_doc || 0;

      if (acumulado + peso > limiteBytes) {
        break; // no agregamos más, se superaría el límite
      }

      listaFinal.push(exp);
      acumulado += peso;
    }

    console.log('Expedientes seleccionados:', listaFinal);
    console.log('Peso total:', acumulado, 'bytes');
    console.log('Peso en GB:', (acumulado / 1024 / 1024 / 1024).toFixed(2), 'GB');

    const cuerpo_expedientes: EstadoAsociarExpedientesADiscoRequest = {
 
      lista_expedientes: listaFinal,
      id_disco: this.data_disco.id_disco!,
      app_user: this.credencialesService.credenciales.username
    }



    this.estadoService.AsociarExpedientesADisco(cuerpo_expedientes).subscribe({
      next: (data: AsociarExpedientesADiscoResponse) => {
        console.log(data.message);
      },
      error: (error) => {
        console.log(error);
      },
      complete: () => {
        console.log('expedientes asociados correctamente');
        const data_disco_aux: DiscoRequest = {
          nombre: this.data_disco.nombre,
          id_responsable_cierre: this.credencialesService.credenciales.id_usuario,
          app_user: this.credencialesService.credenciales.username,
          espacio_ocupado: this.calcularPorcentajeAcumlado(listaFinal)
        }

        this.discoService.CerrarDisco(this.data_disco.id_disco!, data_disco_aux).subscribe(
          {
            next: (data: ModificarDiscoResponse) => {
              console.log(data.message);
            },
            error: (error) => {
              console.log(error);
            },
            complete: () => {
              console.log('modificacion de disco acta cierre completada');
              this.ObtenerDatosDisco();
            }
          })
      }
    })

  }

  descargarMicroformas() {
    this.cargandoZip = true;
    this.discoService.GenerarDiscoMicroformas(this.data_disco.id_disco!, this.credencialesService.credenciales.username).subscribe({
      next: (blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `DISCO_${this.data_disco.nombre}.zip`;
        a.click();
        window.URL.revokeObjectURL(url);
      },
      error: (err) => {
        console.error('Error descargando el ZIP:', err);
        alert("Error descargando el ZIP. Detalle: " + (err?.message || ''));
        this.cargandoZip = false;
      },
      complete: () => {
        this.cargandoZip = false;
      }
    });
  }

}
