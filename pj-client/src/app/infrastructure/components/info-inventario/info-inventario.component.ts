import { Component , Input, OnInit } from '@angular/core';
import { InventarioService } from '../../services/remoto/inventario/inventario.service';
import { InventarioResponse } from '../../../domain/dto/InventarioResponse.dto';

@Component({
  selector: 'app-info-inventario',
  imports: [],
  templateUrl: './info-inventario.component.html',
  styleUrl: './info-inventario.component.css'
})
export class InfoInventarioComponent implements OnInit {
  @Input() id_inventario: any;

  data_inventario: InventarioResponse={
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


  constructor(private inventarioService: InventarioService) { }

  ngOnInit(): void {
    this.ObtenerDatosInventario();
  }

  ObtenerDatosInventario() {

    this.inventarioService.ObtenerInventarioDetalle(this.id_inventario).subscribe({
      next: (data: any) => {
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
