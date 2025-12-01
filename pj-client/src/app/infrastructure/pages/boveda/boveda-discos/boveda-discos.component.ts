import { Component, OnInit } from '@angular/core';
import { NavegatorComponent } from '../../../shared/components/navegator/navegator.component';
import { SubnavegatorComponent } from '../../../shared/components/subnavegator/subnavegator.component';
import { InfoInventarioComponent } from '../../../components/info-inventario/info-inventario.component';
import { DiscoRequest } from '../../../../domain/dto/DiscoRequest.dto';
import { InventarioModel } from '../../../../domain/models/Inventario.model';
import { DiscoService } from '../../../services/remoto/disco/disco.service';
import { CredencialesService } from '../../../services/local/credenciales.service';
import { DiscoResponse } from '../../../../domain/dto/DiscoResponse.dto';
import { ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { InventarioResponse } from '../../../../domain/dto/InventarioResponse.dto';
import { InventarioService } from '../../../services/remoto/inventario/inventario.service';
import { Router } from '@angular/router';
import { ExpedienteSinDiscoResponse } from '../../../../domain/dto/ExpedienteResponse.dto';
import { ExpedienteService } from '../../../services/remoto/expediente/expediente.service';

declare var bootstrap: any;

@Component({
  selector: 'app-boveda-discos',
  imports: [NavegatorComponent, SubnavegatorComponent, InfoInventarioComponent, FormsModule, CommonModule],
  templateUrl: './boveda-discos.component.html',
  styleUrl: './boveda-discos.component.css'
})
export class BovedaDiscosComponent implements OnInit {

  private myModalCrearDisco: any;
  id_inventario: number = 0;

  porcentajeExpedientes: number = 0;
  peso_limite: number = 23 * 1024 * 1024 * 1024;

  list_data_discos: DiscoResponse[] = [];

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

  constructor(
    private activatedRoute: ActivatedRoute,
    private discoService: DiscoService,
    private credencialesService: CredencialesService,
    private inventarioService: InventarioService,
    private router: Router,
    private expedienteService: ExpedienteService,
  ) { }

  ngOnInit(): void {
    this.id_inventario = this.activatedRoute.snapshot.params['id_inventario'];
    this.inicializadorModales();
    this.ObternerDatosInventario();
   
  }

  inicializadorModales() {
    this.myModalCrearDisco = new bootstrap.Modal(document.getElementById('ModalCrearDisco'), {
      backdrop: true,
      keyboard: true
    });
  }
  openModalCrearDisco() {
    this.myModalCrearDisco.show();
  }
  closeModalCrearDisco() {
    this.myModalCrearDisco.hide();
  }

  crearDisco() {
    const data_disco_temp: DiscoRequest = {
      id_inventario: this.data_inventario.id_inventario,
      id_responsable_crear: this.credencialesService.credenciales.id_usuario,
      nombre: `${this.data_inventario.codigo}V${this.list_data_discos.length + 1}`,
      capacidad_gb: 25,
      volumen: this.list_data_discos.length + 1,
      app_user: this.credencialesService.credenciales.username
    }
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
      next: (data: DiscoResponse[]) => {
        this.list_data_discos = data;
      },
      error: (error) => {
        console.log(error);
      },
      complete: () => {
        console.log('listado de discos completado');
      }
    });
  }


  ObternerDatosInventario() {
    const params = this.activatedRoute.snapshot.params;

    this.inventarioService.ObtenerInventarioDetalle(params['id_inventario']).subscribe({
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

  listarExpedientesPendentesDisco(id_inventario: number) {
    this.expedienteService.ObtenerExpedientesById_inventario_sinDisco(id_inventario).subscribe({
      next: (data: ExpedienteSinDiscoResponse[]) => {
        this.porcentajeExpedientes = this.calcularPorcentajeAcumlado(data);

      },
      error: (error) => {
        console.log(error);
      },
      complete: () => {
        console.log('listado de expedientes pendientes disco completado');
      }
    })
  }

  // rutas para disco detalle

  redireccionarDiscoDetalle(id_disco: number) {
    const params = this.activatedRoute.snapshot.params;
    console.log(id_disco)
    this.router.navigate([`/principal/boveda/serie-documental/disco/detalle/${params['id_inventario']}/${id_disco}`]);
  }

  private calcularPorcentajeAcumlado(expedientes: ExpedienteSinDiscoResponse[]): number {
    const pesoTotalBytes = expedientes.reduce((total, exp) => total + (exp.peso_doc || 0), 0);
    const totalPermitido = this.peso_limite;
    const porcentaje = (pesoTotalBytes / totalPermitido) * 100;
    return parseFloat(porcentaje.toFixed(2)); // redondeado a 2 decimales
  }
}
