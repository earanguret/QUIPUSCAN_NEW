import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { InventarioModel } from '../../../domain/models/Inventario.model';
import { InventarioService } from '../../../infrastructure/services/remoto/inventario/inventario.service';
import { InventarioRequest } from '../../../domain/dto/InventarioRequest.dto';
import { CredencialesService } from '../../services/local/credenciales.service';
import { InventarioCrearResponse, InventarioDetalleResponse, InventarioModificarResponse } from '../../../domain/dto/InventarioResponse.dto';
import { form_inventario_vf } from '../../validator/fromValidator/inventario.validator';

declare var bootstrap: any;

@Component({
  selector: 'app-inventario',
  imports: [CommonModule, FormsModule],
  templateUrl: './inventario.component.html',
  styleUrl: './inventario.component.css'
})
export class InventarioComponent implements OnInit {
  @Input() ruta!: string;

  dataExpediente: any[] = [];
  modificarInventario = false;
  isSupervisorLinea = false;

  private myModal: any;

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

  ListInventarioDetalle: InventarioDetalleResponse[] = [];
  ListInventarioDetalleTemp: InventarioDetalleResponse[] = [];

  constructor(private router:Router, private inventarioService:InventarioService, private credencialesService:CredencialesService) { }

  

  ngOnInit(): void {
    if (!this.ruta) {
      this.ruta = '/principal';
    }
    this.ListarInventarios()
    this.isSupervisorLinea = this.credencialesService.credenciales.perfil=='SUPERVISORL'||this.credencialesService.credenciales.perfil=='ADMINISTRADOR'?true:false
  }

  closeModal() {
    this.myModal.hide();
  }
  openModalCreate() {
    this.limpiarDatosInventario();
    this.modificarInventario = false;
    this.myModal = new bootstrap.Modal(document.getElementById('exampleModalCenter'));
    this.myModal.show();
  }

  openModalEdit(data_inventario:InventarioModel) {
      this.data_inventario = {
        id_inventario: data_inventario.id_inventario,
        id_responsable: data_inventario.id_responsable,
        especialidad: data_inventario.especialidad,
        anio: data_inventario.anio,
        cantidad: data_inventario.cantidad,
        tipo_doc: data_inventario.tipo_doc,
        serie_doc: data_inventario.serie_doc,
        sede: data_inventario.sede,
        codigo: data_inventario.codigo
      }
      console.log(this.data_inventario);
  
      this.modificarInventario = true;
      this.myModal = new bootstrap.Modal(document.getElementById('exampleModalCenter'));
      this.myModal.show();
    }


  ListarInventarios(){
    this.inventarioService.ListarInventarios().subscribe({
      next: (data:InventarioDetalleResponse[]) => {
        this.ListInventarioDetalle = data;
        this.ListInventarioDetalleTemp = data;
        console.log(this.ListInventarioDetalle);
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
    if(this.modificarInventario){
       this.ModificarInventario();
    } else {
       this.GuardarInventario();
    }
  }
  
  GuardarInventario(){
    let erroresValidacion = form_inventario_vf(this.data_inventario);
    if (erroresValidacion.length > 0) {
      let errorMensaje = '';
      erroresValidacion.forEach((error:any) => {
        errorMensaje += `Error en el campo :"${error.campo}": ${error.mensaje} \n`;
      });
      return alert(errorMensaje);
    }
    this.data_inventario.id_responsable = this.credencialesService.credenciales.id_usuario;
    let data_inventario_temp:InventarioRequest = {...this.data_inventario, app_user: this.credencialesService.credenciales.username};
    let id_inventario = 0;

    this.inventarioService.CrearInventario(data_inventario_temp).subscribe({
      next: (data:InventarioCrearResponse) => {
        console.log(data);
        id_inventario = data.id_inventario;
      },
      error: (error) => {
        console.log(error);
      },
      complete: () => {
        console.log('creacion de inventario completado');
        this.ExpedientesSerieDocumental(id_inventario);
        this.closeModal();
      }
    })
  }

  ModificarInventario(){
    let erroresValidacion = form_inventario_vf(this.data_inventario);
    if (erroresValidacion.length > 0) {
      let errorMensaje = '';
      erroresValidacion.forEach((error:any) => {
        errorMensaje += `Error en el campo :"${error.campo}": ${error.mensaje} \n`;
      });
      return alert(errorMensaje);
    }
    this.data_inventario.id_responsable = this.credencialesService.credenciales.id_usuario;
    let data_inventario_temp:InventarioRequest = {...this.data_inventario, app_user: this.credencialesService.credenciales.username};
    
    this.inventarioService.ModificarInventario(data_inventario_temp.id_inventario,data_inventario_temp).subscribe({
      next: (data:InventarioModificarResponse) => {
        console.log(data);
      },
      error: (error) => {
        console.log(error);
      },
      complete: () => {
        console.log('modificacion de inventario completado');
        this.ListarInventarios();
        this.closeModal();
      }
    })
  }


  limpiarDatosInventario(){
    this.data_inventario = {
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
  }

  buscarEnObjeto(event: any) {
    let objetosFiltrados = []
    const textoBusqueda = event.target.value.toLowerCase();
    objetosFiltrados = this.ListInventarioDetalleTemp.filter((objeto:
      {
        serie_doc: string;
      }) => {
      const serie_doc = objeto.serie_doc.toLowerCase();
      return serie_doc.includes(textoBusqueda);
    });
    this.ListInventarioDetalle = objetosFiltrados
  }

  ExpedientesSerieDocumental(id_inventario:number){
    this.router.navigate([this.ruta , id_inventario]);
  }



}
