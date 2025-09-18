import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { ReporteService } from '../../../services/remoto/reporte/reporte.service';
import {
  ChartComponent,
  NgApexchartsModule,
  ApexOptions
} from 'ng-apexcharts';
import { produccion_usuario, produccion_usuario_dias } from '../../../../domain/dto/ReporteResponse.dto';

@Component({
  selector: 'app-produccion-usuario-reporte',
  imports: [NgApexchartsModule],
  templateUrl: './produccion-usuario-reporte.component.html',
  styleUrl: './produccion-usuario-reporte.component.css'
})
export class ProduccionUsuarioReporteComponent implements OnInit {


  public chartOptions: Partial<ApexOptions> = {};
  public chartAreaOptions: Partial<ApexOptions> = {
    series: [{ name: "Expedientes", data: [] }],
    chart: { type: "area", height: 220 },
    title: { text: "Production por usuario" },
    subtitle  : { text: "En los últimos 10 días" },
    xaxis: { categories: [] },
    yaxis: { title: { text: "Expedientes" } }
  };

  datosProduccionUsuarios: produccion_usuario[] = [];
  datasPoduccionUsuariosDias: produccion_usuario_dias[] = [];

  constructor(private reporteService: ReporteService,  private cd: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.obtenerDatosProduccionUsuarios()

  }

  grafico_produccion_usuarios(data_produccion: number[], usuarios: string[], nombres: string[], perfil: string) {
    this.chartOptions = {
      series: [{
        name: 'Expedientes',
        data: data_produccion
      }],
      chart: {
        height: 350,
        type: 'bar',
        events: {
          dataPointSelection: (event: any, chartContext: any, config: any) => {
            const index = config.dataPointIndex; // índice de la barra clickeada
            const usuario = usuarios[index];
            const nombre = nombres[index];
            // alert(`Usuario: ${usuario}\nNombre: ${nombre} \nPerfil: ${perfil}`);
            this.produccionUsuarioDias(perfil, usuario, nombre);
          }

        }
      },
      plotOptions: {
        bar: {
          borderRadius: 10,
          columnWidth: '20%'
        }
      },
      dataLabels: { enabled: false },
      stroke: { width: 0 },
      grid: {
        row: {
          colors: ['#fff', '#f2f2f2']
        }
      },
      xaxis: {
        labels: { rotate: -45 },
        categories: usuarios,
        tickPlacement: 'on'
      },
      yaxis: {
        title: { text: 'Expedientes' }
      },
      fill: {
        type: 'gradient',
        gradient: {
          shade: 'light',
          type: "horizontal",
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
            return `${val} (${nombres[index]})`;
          }
        }
      }
    };
  }




  grafico_produccion_usuarios_dias(data_produccion: number[], fechas: string[], usuario: string, nombre: string, perfil: string): void {
    this.chartAreaOptions = {
      series: [
        {
          name: "Expedientes",
          data: data_produccion
        }
      ],
      chart: {
        type: "area",
        height: 200,
        zoom: { enabled: false }
      },
      dataLabels: { enabled: false },
      stroke: { curve: "straight" },
      title: {
        text: `Production por usuario: ${usuario} / ${nombre} / ${perfil}`,
        align: "left"
      },
      subtitle: {
        text: "En los últimos 10 días",
        align: "left"
      },
      xaxis: {
        categories: fechas,
        type: "category"
      },
      yaxis: {
        title: { text: "Expedientes" },
        opposite: true
      },
      grid: {
        row: { colors: ["#fff", "#f2f2f2"] }
      },
      legend: {
        horizontalAlign: "left"
      }
    };
    this.cd.detectChanges();
  }
  



  obtenerDatosProduccionUsuarios() {
    this.reporteService.ObtenerProduccionUsuario().subscribe({
      next: (data: produccion_usuario[]) => {
        console.log(data);
        this.datosProduccionUsuarios = data;
      },
      error: (error) => {
        console.error(error);
      },
      complete: () => {
        console.log('listado de reportes detalle completado');
        this.produccionPreparacion();
      }
    })
  }

  filtrarProduccionPorPerfil(perfil: string): { id_usuario: number; nombre_usuario: string; perfil: string; total_expedientes: number, username: string }[] {
    return this.datosProduccionUsuarios
      .filter(u => u.perfil === perfil)
      .map(u => {
        let total = 0;

        switch (perfil) {
          case 'PREPARADOR':
            total = u.expedientes_preparados;
            break;
          case 'DIGITALIZADOR':
            total = u.expedientes_digitalizados;
            break;
          case 'INDIZADOR':
            total = u.expedientes_indizados;
            break;
          case 'CONTROLADOR':
            total = u.expedientes_controlados;
            break;
          case 'FEDATARIO':
            total = u.expedientes_fedatados;
            break;
        }

        return {
          id_usuario: u.id_usuario,
          nombre_usuario: u.nombre_usuario,
          perfil: u.perfil,
          total_expedientes: total,
          username: u.username
        };
      });
  }

  generarGraficoPorPerfil(perfil: string) {
    // Obtienes los datos filtrados
    const datosFiltrados = this.filtrarProduccionPorPerfil(perfil);

    // Extraes los arrays para el gráfico
    const data_produccion = datosFiltrados.map(d => d.total_expedientes);
    const usuarios = datosFiltrados.map(d => d.username); // o d.nombre_usuario
    const nombres = datosFiltrados.map(d => d.nombre_usuario);

    // Llamas al gráfico con los valores
    this.grafico_produccion_usuarios(data_produccion, usuarios, nombres, perfil);
  }


  // PRODUCION DE USUARIOS POR MODULO
  produccionPreparacion() {
    this.generarGraficoPorPerfil('PREPARADOR');
  }

  produccionDigitalizacion() {
    this.generarGraficoPorPerfil('DIGITALIZADOR');
  }

  produccionIndizacion() {
    this.generarGraficoPorPerfil('INDIZADOR');
  }

  produccionControl() {
    this.generarGraficoPorPerfil('CONTROLADOR');
  }

  produccionFedatario() {
    this.generarGraficoPorPerfil('FEDATARIO');
  }

  // PRODUCCIÓN USUARIO DIAS
  produccionUsuarioDias(perfil: string, usuario: string, nombre: string) {

    console.log(perfil, usuario);
    this.reporteService.ObtenerProduccionUsuarioDias(perfil, usuario).subscribe({
      next: (data: produccion_usuario_dias[]) => {

        console.log(data);
    
          const total_expedientes = data.map(d => Number(d.total_expedientes));
          const fecha = data.map(d => {
            const f = new Date(d.fecha);
            return f.toLocaleDateString('es-ES'); // devuelve dd/MM/yyyy
          });

          console.log('total_expedientes',total_expedientes);
          console.log('fecha',fecha);

          this.grafico_produccion_usuarios_dias(total_expedientes,fecha,usuario,nombre,perfil);

      },
      error: (error) => {
        console.error(error);
      },
      complete: () => {
        console.log('producion usuario dias completado');
      }
    });

  }

}
