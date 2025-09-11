import { Component, OnInit, ViewChild } from '@angular/core';
import {
  ChartComponent,
  NgApexchartsModule,
  ApexOptions
} from 'ng-apexcharts';

@Component({
  selector: 'app-serie-documental-reporte',
  imports: [NgApexchartsModule],
  templateUrl: './serie-documental-reporte.component.html',
  styleUrl: './serie-documental-reporte.component.css'
})
export class SerieDocumentalReporteComponent implements OnInit {
  @ViewChild('chart') chart!: ChartComponent;
  public chartOptionsPie: Partial<ApexOptions> = {};

  ngOnInit(): void {
    this.grafico_pie();
  }

  grafico_pie() {
    this.chartOptionsPie = {
      series: [25, 15],
      chart: {
        type: 'pie',
        width: '100%',
        height: '100%'
      },
      labels: [
        'Activos',
        'Inactivos',
      ],
     
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
      dataLabels: {
        formatter: (val: number, opts?: any) => {
          const name = opts.w.globals.labels[opts.seriesIndex];
          return [name, val.toFixed(1) + '%'];
        }
      },
      legend: {
        show: true
      }
    };
  }
}
