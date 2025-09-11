import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import {
  ChartComponent,
  NgApexchartsModule,
  ApexOptions
} from 'ng-apexcharts';

@Component({
  selector: 'app-usuarios-reporte',
  imports: [NgApexchartsModule],
  templateUrl: './usuarios-reporte.component.html',
  styleUrl: './usuarios-reporte.component.css'
})
export class UsuariosReporteComponent implements OnInit, AfterViewInit  {
  @ViewChild('chart') chart!: ChartComponent;
  public chartOptionsPie: Partial<ApexOptions> = {};

  ngOnInit(): void {
    this.grafico_pie();
  }

  ngAfterViewInit(): void {
    if (this.chart) {
      this.chart.updateOptions(
        { colors: ['#2ecc71', '#e74c3c'] }, // verde, rojo
        true,  // redraw
        true   // animate
      );
    }
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