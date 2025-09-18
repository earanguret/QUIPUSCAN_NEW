import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { ReporteService } from '../../../services/remoto/reporte/reporte.service';
import {
  ChartComponent,
  NgApexchartsModule,
  ApexOptions
} from 'ng-apexcharts';
import { datos_usuarios } from '../../../../domain/dto/ReporteResponse.dto';
import { CommonModule } from '@angular/common';
import { NgxPaginationModule } from 'ngx-pagination';


@Component({
  selector: 'app-usuarios-reporte',
  imports: [NgApexchartsModule, CommonModule, NgxPaginationModule],
  templateUrl: './usuarios-reporte.component.html',
  styleUrl: './usuarios-reporte.component.css'
})
export class UsuariosReporteComponent implements OnInit, AfterViewInit {
  @ViewChild('chart') chart!: ChartComponent;

  datosUsuarios: datos_usuarios[] = [];
  datosUsuariosTemp: datos_usuarios[] = [];
  p: number = 1;

  constructor(private reporteService: ReporteService) { }

  public chartOptionsPie: Partial<ApexOptions> = {};

  ngOnInit(): void {
    this.obtenerDatosUsuarios();
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

  grafico_pie(activos: number, inactivos: number) {
    this.chartOptionsPie = {
      series: [activos, inactivos],
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


  obtenerDatosUsuarios() {
    this.reporteService.ObtenerUsuariosReporte().subscribe({
      next: (data: datos_usuarios[]) => {
        console.log(data);
        this.datosUsuarios = data;
        this.datosUsuariosTemp = data;

        const activos = data.filter(u => u.estado === true).length;
        const inactivos = data.filter(u => u.estado === false).length;

        this.grafico_pie(activos, inactivos);
      },
      error: (error) => {
        console.error(error);
      },
      complete: () => {
        console.log('listado de usuarios completado');
    
      }
    })
  }
}