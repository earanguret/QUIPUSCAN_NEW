import { Component, OnInit, ViewChild } from '@angular/core';
import {
  ChartComponent,
  NgApexchartsModule,
  ApexOptions
} from 'ng-apexcharts';
import { datos_estaticos, estado_produccion_total, produccion_mensual } from '../../../../domain/dto/ReporteResponse.dto';
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
  public chartOptions: ApexOptions = {
    series: [0],
    chart: {
      type: 'bar',
      height: 350
    },
    title: { text: 'Cargando...' },
    subtitle: { text: 'Cargando...' },
    xaxis: { categories: ['Cargando...'] },
    yaxis: { title: { text: 'Cargando...' } },
    fill: {
      type: 'gradient',
      gradient: {
        shade: 'light',
        type: 'horizontal',
        shadeIntensity: 0.25,
        gradientToColors: undefined,
        inverseColors: true,
        opacityFrom: 0.85,
        opacityTo: 0.85,
        stops: [50, 0, 100]
      }
    },
    tooltip: {
      y: {
        formatter: (val: number, opts: any) => {
          const index = opts.dataPointIndex;
          return `${val} (${index})`;
        }
      }
    }
  };
  
  public chartOptionsRadial: ApexOptions = {
    series: [0],
    chart: {
      type: 'radialBar',
      height: 350
    },
    labels: ['Cargando...'],
    plotOptions: {
      radialBar: {
        hollow: {
          size: '50%'
        }
      }
    }
  };
  


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

  produccion_mensual: produccion_mensual[] = [];  

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
    this.ObtenerProduccionMensual()
   
    
  }

  ngAfterViewInit(): void {
    // Fuerza aplicar colores por si el render inicial no los toma
    // (a veces necesario en ng-apexcharts 1.x)
    if (this.chart) {
      this.chart.updateOptions(
        { colors: this.chartOptions.colors },
        true,  // redraw
        true   // animate
      );
    }
  }


  grafico_barras(produccion_mensual: produccion_mensual[]) {
    this.chartOptions = {
      chart: { type: 'bar', height: 350 },
      series: [
        {
          name: 'Preparación',
          data: produccion_mensual.map(m => Number(m.expedientes_preparacion)) as number[],
          color: '#775DD0'
        },
        {
          name: 'Digitalización',
          data: produccion_mensual.map(m => Number(m.expedientes_digitalizacion)) as number[],
          color: '#008FFB'
        },
        {
          name: 'Indización',
          data: produccion_mensual.map(m => Number(m.expedientes_indizacion)) as number[],
          color: '#00E396'
        },
        {  
          name: 'Control',
          data: produccion_mensual.map(m => Number(m.expedientes_control)) as number[],
          color: '#FEB019'
        },
        {  
          name: 'Fedatario',
          data: produccion_mensual.map(m => Number(m.expedientes_fedatario)) as number[],
          color: '#FF4560'
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
  
      theme: { monochrome: { enabled: false } },
  
      xaxis: {
        categories: produccion_mensual.map(m => m.mes_nombre) // 👈 nombres de meses dinámicos
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

  ObtenerProduccionMensual() {
    this.reporteService.ObtenerProduccionMensual().subscribe({
      next: (data: produccion_mensual[]) => {
        console.log("Datos recibidos:", data);
  
        // Filtrar solo meses con producción > 0
        this.produccion_mensual = data.filter(mes => {
          const total =
            mes.expedientes_preparacion +
            mes.expedientes_digitalizacion +
            mes.expedientes_indizacion +
            mes.expedientes_control +
            mes.expedientes_fedatario;
  
          return total > 0;
        });
  
        console.log("Datos filtrados:", this.produccion_mensual);
        this.grafico_barras(this.produccion_mensual);
      },
      error: (error) => {
        console.log(error);
      },
      complete: () => {
        console.log('listado de reportes detalle completado');
      }
    });
  }
  
}

