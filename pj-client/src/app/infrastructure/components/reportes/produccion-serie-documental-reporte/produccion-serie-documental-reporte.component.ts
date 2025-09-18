import { Component, OnInit, ViewChild } from '@angular/core';
import { ReporteService } from '../../../services/remoto/reporte/reporte.service';
import { CommonModule } from '@angular/common';

import {
  ChartComponent,
  NgApexchartsModule,
  ApexOptions
} from 'ng-apexcharts';
import { produccion_serie_documental_reporte } from '../../../../domain/dto/ReporteResponse.dto';

@Component({
  selector: 'app-produccion-serie-documental-reporte',
  imports: [NgApexchartsModule,CommonModule],
  templateUrl: './produccion-serie-documental-reporte.component.html',
  styleUrl: './produccion-serie-documental-reporte.component.css'
})
export class ProduccionSerieDocumentalReporteComponent implements OnInit {

  @ViewChild('chart') chart!: ChartComponent;
  public chartOptionsBar: Partial<ApexOptions> = {};

  datosSerieDocumental: produccion_serie_documental_reporte[] = [];
  datosSerieDocumentalTemp: produccion_serie_documental_reporte[] = [];

  constructor(private reporteService: ReporteService) { }

  ngOnInit(): void {

    this.obtenerSerieDocumentalReporte()
  }

  obtenerSerieDocumentalReporte() {
    this.reporteService.ObtenerProduccionSerieDocumental().subscribe({
      next: (data: produccion_serie_documental_reporte[]) => {
        console.log(data);
  
        this.datosSerieDocumental = data.map(item => {
          return {
            ...item,
            chartOptionsBar: {
              series: [
                {
                  name: "Expedientes",
                  data: [
                    item.expedientes_fedatados,
                    item.expedientes_controlados,
                    item.expedientes_indizados,
                    item.expedientes_digitalizados,
                    item.expedientes_preparados
                  ]
                }
              ],
              chart: {
                type: 'bar',
                height: 220
              },
              plotOptions: {
                bar: {
                  borderRadius: 4,
                  borderRadiusApplication: 'end' as any,
                  horizontal: true
                }
              },
              dataLabels: {
                enabled: true
              },
              xaxis: {
                categories: [
                  'Fedatario',
                  'Control',
                  'Indización',
                  'Digitalización',
                  'Preparación'
                ]
              }
            }
          }
        });
  
        this.datosSerieDocumentalTemp = this.datosSerieDocumental;
      },
      error: (error) => {
        console.error(error);
      },
      complete: () => {
        console.log('listado de reportes detalle completado');
      }
    });
  }
  
}
