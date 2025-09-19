import { Component, OnInit, ViewChild } from '@angular/core';
import { ReporteService } from '../../../services/remoto/reporte/reporte.service';
import { CommonModule } from '@angular/common';

import {
  ChartComponent,
  NgApexchartsModule,
  ApexAxisChartSeries ,
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

  // Skeleton inicial seguro
  public chartOptionsBarSkeleton: ApexOptions = {
    series: [{ name: 'Expedientes', data: [0, 0, 0, 0, 0] }],
    chart: { type: 'bar', height: 220 },
    plotOptions: { bar: { borderRadius: 4, borderRadiusApplication: 'end', horizontal: true } },
    dataLabels: { enabled: true },
    xaxis: { categories: ['Fedatario','Control','Indización','Digitalización','Preparación'] }
  };
  

  datosSerieDocumental: (produccion_serie_documental_reporte & { chartOptionsBar: ApexOptions })[] = [];
  datosSerieDocumentalTemp: (produccion_serie_documental_reporte & { chartOptionsBar: ApexOptions })[] = [];

  constructor(private reporteService: ReporteService) { }

  ngOnInit(): void {
    this.obtenerSerieDocumentalReporte();
  }

  obtenerSerieDocumentalReporte() {
    this.reporteService.ObtenerProduccionSerieDocumental().subscribe({
      next: (data) => {
        this.datosSerieDocumental = data.map(item => {
          const chartOptionsBar: ApexOptions = {
            ...this.chartOptionsBarSkeleton, // usamos el skeleton seguro
            series: [
              {
                name: 'Expedientes',
                data: [
                  Number(item.expedientes_fedatados),
                  Number(item.expedientes_controlados),
                  Number(item.expedientes_indizados),
                  Number(item.expedientes_digitalizados),
                  Number(item.expedientes_preparados)
                ]
              }
            ]
          };

          return { ...item, chartOptionsBar };
        });

        this.datosSerieDocumentalTemp = this.datosSerieDocumental;
      },
      error: (err) => console.error(err),
      complete: () => console.log('listado de reportes detalle completado')
    });
  }
}
