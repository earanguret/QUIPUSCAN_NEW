import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NavegatorComponent } from '../../../shared/components/navegator/navegator.component';
import { SubnavegatorComponent } from '../../../shared/components/subnavegator/subnavegator.component';
import { CommonModule } from '@angular/common';
import { NgxPaginationModule } from 'ngx-pagination';
import { InventarioService } from '../../../services/remoto/inventario/inventario.service';
import { InventarioResponse } from '../../../../domain/dto/InventarioResponse.dto';
import { ExpedienteService } from '../../../services/remoto/expediente/expediente.service';
import { EliminarExpedienteResponse, ExpedienteResponse, ModificarExpedienteResponse } from '../../../../domain/dto/ExpedienteResponse.dto';
import { ExpedienteModel } from '../../../../domain/models/expediente.model';
import { form_inventario_creacion_vf } from '../../../validator/fromValidator/expediente.validator';
import { CredencialesService } from '../../../services/local/credenciales.service';
import { ExpedienteRequest } from '../../../../domain/dto/ExpedienteRequest.dto';
import { FormsModule } from '@angular/forms';
import { AlertaComponent } from '../../../shared/components/alerta/alerta.component';
declare var bootstrap: any;

@Component({
  selector: 'app-recepcion-expedientes',
  imports: [NavegatorComponent, SubnavegatorComponent, CommonModule, NgxPaginationModule, FormsModule, AlertaComponent],
  templateUrl: './recepcion-expedientes.component.html',
  styleUrl: './recepcion-expedientes.component.css'
})
export class RecepcionExpedientesComponent implements OnInit {

  isLoading: boolean = false;
  private myModal: any;
  mensajeError: string = '';
  showCreateAlert = false;
  modificarExpediente = false;

  data_inventario: InventarioResponse = {
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

  data_expediente: ExpedienteModel = {
    id_expediente: 0,
    nro_expediente: '',
    id_inventario: 0,
    id_responsable: 0,
  }

  ListExpedientes: any[] = [];
  p: number = 1;

  constructor(
    private router: Router,
    private inventarioService: InventarioService,
    private activatedRoute: ActivatedRoute,
    private expedienteService: ExpedienteService,
    private credencialesService: CredencialesService
  ) { }

  ngOnInit(): void {
    this.DatosInventario()
    this.ListarExpedientes()
  }

  closeModal() {
    this.myModal.hide();
  }
  openModalCreate() {
    this.limpiarDatosInventario();
    this.modificarExpediente = false;
    this.myModal = new bootstrap.Modal(document.getElementById('exampleModalCenter'));
    this.myModal.show(); 
  }

  openModalEdit(data_expediente:ExpedienteModel) {

    this.data_expediente = data_expediente;
    this.modificarExpediente = true;
    this.myModal = new bootstrap.Modal(document.getElementById('exampleModalCenter'));
    this.myModal.show();
  }

  limpiarDatosInventario() {
    this.mensajeError = '';
    this.modificarExpediente = false;
    this.data_expediente = {
      id_expediente: 0,
      nro_expediente: '',
      id_inventario: 0,
      id_responsable: 0,
    }

  }
  RegistrarExpediente() {
    const params = this.activatedRoute.snapshot.params;
    let erroresValidacion = form_inventario_creacion_vf(this.data_expediente);
    if (erroresValidacion.length > 0) {
      let errorMensaje = '';
      
      erroresValidacion.forEach((error: any) => {
        errorMensaje = error.mensaje;
      });
       console.log(errorMensaje);
       this.mensajeError = errorMensaje;  
       return ;
    }
    this.data_expediente.id_responsable = this.credencialesService.credenciales.id_usuario;
    this.data_expediente.id_inventario = params['id'];
    let data_expediente_temp: ExpedienteRequest = { ...this.data_expediente, app_user: this.credencialesService.credenciales.username };

    console.log(data_expediente_temp);

    this.expedienteService.CrearExpediente(data_expediente_temp).subscribe({
      next: (data: ExpedienteResponse) => {
        console.log(data);
      },
      error: (error) => {

        if (error.status === 409) {
          this.mensajeError = 'Ya existe un expediente con ese número';
        } else {
          this.mensajeError = 'Error al registrar expediente. Intente más tarde.';
          console.error('Error al crear expediente:', error);
        }
        setTimeout(() => {
          this.mensajeError = '';
        }, 2000);
      },
        complete: () => {
          console.log('creacion de expediente completado');
          this.ListarExpedientes();
          this.limpiarDatosInventario();
          this.closeModal()
          this.showCreateAlert = true;
        }
      })
  
  }

  EliminarExpediente(id:number) {
    this.expedienteService.EliminarExpediente(id).subscribe({
      next: (data:EliminarExpedienteResponse) => {
        console.log(data);
      },
      error: (error) => {
        console.log(error);
      },
      complete: () => {
        console.log('eliminacion de expediente completado');
        this.ListarExpedientes();
      }
    })
  }

  ModificarExpediente() {
    let data_expediente_temp: ExpedienteRequest = { ...this.data_expediente, app_user: this.credencialesService.credenciales.username };
    this.expedienteService.ModificarExpediente(data_expediente_temp.id_expediente!,data_expediente_temp).subscribe({
      next: (data:ModificarExpedienteResponse) => {
        console.log(data);
      },
      error: (error) => {
        console.log(error);
      },
      complete: () => {
        console.log('modificacion de expediente completado');
        this.ListarExpedientes();
        this.closeModal();
      }
    })
  }

  EventAction(){
    if(this.modificarExpediente){
      this.ModificarExpediente();
    } else {
      this.RegistrarExpediente();
    }
  }

  ListarExpedientes() {
    const params = this.activatedRoute.snapshot.params;
    this.expedienteService.ListarExpedientesXidInventario(params['id']).subscribe({
      next: (data: ExpedienteResponse[]) => {
        this.ListExpedientes = data;
        console.log(this.ListExpedientes);
      },
      error: (error) => {
        console.log(error);
      },
      complete: () => {
        console.log('listado de expedientes completado');
      }
    })
  }

  DatosInventario() {
    const params = this.activatedRoute.snapshot.params;
    this.inventarioService.ObtenerInventarioDetalle(params['id']).subscribe({
      next: (data: InventarioResponse) => {

        this.data_inventario = data;
        console.log(this.data_inventario);
      },
      error: (error) => {
        console.log(error);
      },
      complete: () => {
        console.log('listado de inventarios completado');
      }
    })
  }
}
