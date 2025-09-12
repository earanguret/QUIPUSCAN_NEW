import { Component, OnInit, ViewChild } from '@angular/core';
import {
  ChartComponent,
  NgApexchartsModule,
  ApexOptions
} from 'ng-apexcharts';
import { datos_estaticos, estado_produccion_total } from '../../../../domain/dto/ReporteResponse.dto';
import { ReporteService } from '../../../services/remoto/reporte/reporte.service';




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

  data_estaticos: datos_estaticos = {
    total_inventarios: 0,
    total_expedientes: 0,
    total_digitalizados: 0,
    total_fojas: 0,
    altura_m : 0,
    volumen_m3 : 0,
    peso_kg : 0,
    peso_gb : 0,
    total_discos : 0,
    usuarios_activos : 0
  }

  estado_produccion_total: estado_produccion_total = {
    total_expedientes: 0,
    pct_preparados: 0,
    pct_digitalizados: 0,
    pct_indizados: 0,
    pct_controlados: 0, 
    pct_fedatados: 0
  }

  altura: number = 0;
  volumen: number = 0;
  peso_kg: number = 0;
  peso_gb: number = 0;
  discos: number = 0;

  
  constructor(private reporteService: ReporteService) {
  }

  ngOnInit(): void {
    this.ObtenerDatosEstaticos()
    this.ObtenerEstadoProductionTotal()
   
    this.grafico_barras();
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


  grafico_radial(estado_expedientes: estado_produccion_total) {
    this.chartOptionsRadial = {
      series: [Number(estado_expedientes.pct_fedatados), Number(estado_expedientes.pct_controlados), Number(estado_expedientes.pct_indizados), Number(estado_expedientes.pct_digitalizados), Number(estado_expedientes.pct_preparados)],
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
                `${estado_expedientes.total_expedientes}`
            }
          }
        }
      },
      labels: ['Fedatario', 'Control', 'Indización', ' Digitalización', 'Preparacion'],
    };
  }
  
 
  ObtenerDatosEstaticos(){
    this.reporteService.ObtenerDatosEstaticos().subscribe({
      next: (data: datos_estaticos) => {
        this.data_estaticos = data;
        console.log(this.data_estaticos);

      },
      error: (error) => {
        console.log(error);
      },
      complete: () => {
        console.log('listado de reportes detalle completado');
      }
    })
  }

  ObtenerEstadoProductionTotal(){
    this.reporteService.ObtenerEstadoProductionTotal().subscribe({
      next: (data: estado_produccion_total) => {
        this.grafico_radial(data);
        console.log(data);
      },
      error: (error) => {
        console.log(error);
      },
      complete: () => {
        console.log('listado de reportes detalle completado');
        

      }
    })
  }
}

