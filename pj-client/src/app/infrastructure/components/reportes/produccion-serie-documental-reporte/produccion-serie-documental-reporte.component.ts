import { Component, OnInit, ViewChild } from '@angular/core';
import {
  ChartComponent,
  NgApexchartsModule,
  ApexOptions
} from 'ng-apexcharts';

@Component({
  selector: 'app-produccion-serie-documental-reporte',
  imports: [NgApexchartsModule],
  templateUrl: './produccion-serie-documental-reporte.component.html',
  styleUrl: './produccion-serie-documental-reporte.component.css'
})
export class ProduccionSerieDocumentalReporteComponent implements OnInit {

  @ViewChild('chart') chart!: ChartComponent;
  public chartOptionsBar: Partial<ApexOptions> = {};

  ngOnInit(): void {
    this.grafico_barras()
  }

  grafico_barras() {
    this.chartOptionsBar = {
      series: [
        {
          name: "Expedientes",   // 👈 dale un nombre a la serie
          data: [400, 430, 448, 470, 540]
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
          'Preparación', 
          'Digitalización', 
          'Indización', 
          'Control', 
          'Fedatario'
        ]
      }
    };
  }
  
  
  
  
}
