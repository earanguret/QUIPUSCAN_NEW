import { Component, OnInit, ViewChild } from '@angular/core';
import { ReporteService } from '../../../services/remoto/reporte/reporte.service';
import { NgxPaginationModule } from 'ngx-pagination';
import { CommonModule } from '@angular/common';
import {
  ChartComponent,
  NgApexchartsModule,
  ApexOptions
} from 'ng-apexcharts';
import { serie_documental_reporte } from '../../../../domain/dto/ReporteResponse.dto';

@Component({
  selector: 'app-serie-documental-reporte',
  imports: [NgApexchartsModule,NgxPaginationModule, CommonModule],
  templateUrl: './serie-documental-reporte.component.html',
  styleUrl: './serie-documental-reporte.component.css'
})
export class SerieDocumentalReporteComponent implements OnInit {
  @ViewChild('chart') chart!: ChartComponent;
  public chartOptionsPie: Partial<ApexOptions> = {};

  datosSerieDocumental: serie_documental_reporte[] = [];
  datosSerieDocumentalTemp: serie_documental_reporte[] = [];
  p: number = 1;

  constructor(private reporteService: ReporteService) { }

  ngOnInit(): void {

    this.obtenerSerieDocumentalReporte();
  }

  grafico_pie(series: number[], labels: string[]) {
    this.chartOptionsPie = {
      series: series,
      chart: {
        type: 'pie',
        width: '100%',
        height: '100%'
      },
      labels: labels,
     
      plotOptions: {
        pie: {
          dataLabels: {
            offset: -5
          }
        }
      },
      grid: {
        padding: {
          top: 0,
          bottom: 0,
          left: 0,
          right: 0
        }
      },
      // dataLabels: {
      //   formatter: (val: number, opts?: any) => {
      //     const name = opts.w.globals.labels[opts.seriesIndex];
      //     return [name, val.toFixed(1) + '%'];
      //   }
      // },
      legend: {
        show: true,
        position: 'bottom'
      }
    };
  }


  obtenerSerieDocumentalReporte() {
    this.reporteService.ObtenerSerieDocumentalReporte().subscribe({
      next: (data: serie_documental_reporte[]) => {
        console.log(data);
        this.datosSerieDocumental = data;
        this.datosSerieDocumentalTemp = data;

        const series = data.map(item => item.cantidad);
        const labels = data.map(item => item.codigo);

        this.grafico_pie(series, labels);
      },
      error: (error) => {
        console.error(error);
      },
      complete: () => {
        console.log('listado de reportes detalle completado');
      }
    })
  }
}
