import { Component, OnInit, ViewChild } from '@angular/core';
import {
  ChartComponent,
  NgApexchartsModule,
  ApexOptions
} from 'ng-apexcharts';




@Component({
  selector: 'app-dashboard',
  standalone: true,               // 👈 si estás usando Angular 15+ con standalone components
  imports: [NgApexchartsModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit {
  @ViewChild('chart') chart!: ChartComponent;
  public chartOptions: Partial<ApexOptions> = {};
  public chartOptionsRadial: Partial<ApexOptions>= {};
  
  constructor() { 
  }

  ngOnInit(): void {
    this.grafico_barras();
    this.grafico_radial();
  }

  ngAfterViewInit(): void {
    // 🔁 Fuerza aplicar colores por si el render inicial no los toma
    // (a veces necesario en ng-apexcharts 1.x)
    if (this.chart) {
      this.chart.updateOptions(
        { colors: this.chartOptions.colors },
        true,  // redraw
        true   // animate
      );
    }
  }

  grafico_barras() {
    this.chartOptions = {
      // colors: [ '#008FFB','#00E396', '#FEB019', '#775DD0'],
      chart: { type: 'bar', height: 350 },
      series: [
        {
          name: 'Preparación',
          data: [44, 55, 57, 56, 61, 58, 63, 60, 66],
          color: '#775DD0'
        },
        {
          name: 'Digitalización',
          data: [76, 85, 101, 98, 87, 105, 91, 114, 94],
          color: '#008FFB'
        },
        {
          name: 'Indización',
          data: [35, 41, 36, 26, 45, 48, 52, 53, 41],
          color: '#00E396'
        },
        {  
          name: 'Control',
          data: [12, 30, 23, 20, 38, 40, 45, 50, 35],
          color: '#FEB019'
        }
      ],

      plotOptions: {
        bar: {
          horizontal: false,
          columnWidth: '55%',
          borderRadius: 5,
          borderRadiusApplication: 'end' as any,
        }
      },

      dataLabels: { enabled: false },
      stroke: { show: true, width: 2, colors: ['transparent'] },

      // Asegúrate de no tener theme.monochrome habilitado si quieres respetar colors[]
      theme: {
        monochrome: { enabled: false }
      },

      xaxis: {
        categories: ['Ene','Feb','Mar','Abr','May','Jun','Jul','Ago','Sep']
      },
      yaxis: { title: { text: 'N° de expedientes' } },
      fill: { opacity: 0.9 },
      tooltip: {
        y: { formatter: (val: number) => `${val} expedientes` }
      }
    };
  }


  grafico_radial(total_expedientes: number = 3256) {
    this.chartOptionsRadial = {
      series: [26, 30.86, 44.31, 52.82, 57.52],
      chart: { type: 'radialBar', height: 350 },
      plotOptions: {
        radialBar: {
          dataLabels: {
            name: { fontSize: '22px' },
            value: { fontSize: '16px' },
            total: {
              show: true,
              label: 'Total Expedientes',
              formatter: () =>
                `${total_expedientes}`
            }
          }
        }
      },
      labels: ['edatario', 'Control', 'Indización', ' Digitalización', 'Preparacion'],
    };
  }
  
 
}

