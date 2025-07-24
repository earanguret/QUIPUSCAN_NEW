import { Component, Input, OnInit } from '@angular/core';
import { PreparacionService } from '../../services/remoto/preparacion/preparacion.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { PreparacionResponseDataView } from '../../../domain/dto/PreparacionResponse.dto';

@Component({
  selector: 'app-preparacion-view',
  imports: [FormsModule, CommonModule],
  templateUrl: './preparacion-view.component.html',
  styleUrl: './preparacion-view.component.css'
})
export class PreparacionViewComponent implements OnInit {
  @Input() id_expediente: any;

  ListObservaciones: string[] = [];
  constructor(private preparacionService: PreparacionService) { }

  ngOnInit(): void {
    this.ObtenerPreparacionByIdExpediente();
  }

   data_expediente_preparacion: PreparacionResponseDataView ={
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

    ObtenerPreparacionByIdExpediente( ){

      this.preparacionService.ObtenerPreparacionDataViewXidExpediente(this.id_expediente).subscribe({
        next: (data: PreparacionResponseDataView) => {
          this.data_expediente_preparacion = data;
          this.ListObservaciones = this.data_expediente_preparacion.observaciones?.split('|') ?? [];
          console.log(this.data_expediente_preparacion);
        },
        error: (error) => {
          console.log(error);
        },
        complete: () => {
          console.log('listado de preparacion detalle completado');
        }
      })    
    }


}
