import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NavegatorComponent } from '../../shared/components/navegator/navegator.component';
import { SubnavegatorComponent } from '../../shared/components/subnavegator/subnavegator.component';
import { SupervisorLineaService } from '../../services/local/supervisorLinea.service';
import { UsuarioSupervisorLineaResponse } from '../../../domain/dto/UsuarioResponse.dto';

@Component({
  selector: 'app-reporte',
  imports: [NavegatorComponent, SubnavegatorComponent],
  templateUrl: './reporte.component.html',
  styleUrl: './reporte.component.css'
})
export class ReporteComponent implements OnInit {
  

    constructor(private router:Router, private supervisorLineaService:SupervisorLineaService) { }

    datosFijos = [
      { label: 'Total de series documentales', value: '—' },
      { label: 'Total de expedientes', value: '—' },
      { label: 'Total de digitalizados', value: '—' },
      { label: 'Total de fojas', value: '—' },
      { label: 'Volumen (AxH)', value: '—' },
      { label: 'Peso (KG)', value: '—' },
      { label: 'Peso (GB)', value: '—' },
      { label: 'Discos', value: '—' }
    ];
  
    reportes = [
      {
        titulo: '1) Reportes de usuarios',
        descripcion: 'Listado y métricas por usuario / perfil.',
        items: [
          'Listado de usuarios registrados por su perfil',
          'Usuarios activos / inactivos',
          'Cantidad de expedientes procesados por cada usuario',
          'Ranking de productividad por usuario — perfil',
          'Histórico de acceso por usuario',
          'Histórico de eventos por usuario'
        ]
      },
      {
        titulo: '2) Reportes por Serie Documental',
        descripcion: 'Información de series y volumen documental.',
        items: [
          'Listado general de las series documentales (por año, especialidad, sede, cantidad de documentos)'
        ]
      },
      {
        titulo: '3) Reportes de producción',
        items: [
          'Listado de expedientes (serie documental, rango de fechas, por usuario)',
          'Reporte detallado por expediente',
          'Flujograma completo de cada expediente',
          'Estado de cada expediente',
          'Ranking de producción (por usuario activo, por rango de fechas)'
        ]
      },
      {
        titulo: '4) Reportes digitalización',
        items: [
          'Listado de expedientes (serie documental, rango de fechas, por usuario)',
          'Ranking de producción (por usuario activo, por rango de fechas)'
        ]
      },
      {
        titulo: '5) Reportes indización',
        items: [
          'Listado de expedientes (serie documental, rango de fechas, por usuario)',
          'Ranking de producción (por usuario activo, por rango de fechas)'
        ]
      },
      {
        titulo: '6) Reportes control de calidad',
        items: [
          'Listado de expedientes (serie documental, rango de fechas, por usuario)',
          'Ranking de producción (por usuario activo, por rango de fechas)'
        ]
      },
      {
        titulo: '7) Reportes fedatario',
        items: [
          'Listado de expedientes (serie documental, rango de fechas, por usuario)',
          'Ranking de producción (por usuario activo, por rango de fechas)'
        ]
      },
      {
        titulo: '8) Reportes de discos',
        items: [
          'Lista de discos creados (abiertos, cerrados, responsables apertura, responsables de cierre)',
          'Expedientes almacenados en disco',
          'Actas y tarjetas de calibración'
        ]
      },
      {
        titulo: '9) Reportes de estado del expediente',
        items: [
          'Reporte detallado por expediente'
        ]
      },
      {
        titulo: '10) Reportes de auditoría',
        descripcion: 'Trazabilidad y seguridad.',
        items: [
          'Trazabilidad completa de cada expediente (qué áreas y qué responsables lo procesaron y en qué orden)',
          'Logs de accesos al sistema (IP, usuario, fecha)',
          'Eventos por módulo',
          'Historial de acciones por expediente',
          'Análisis de seguridad: intentos de login fallidos, accesos desde IPs inusuales'
        ]
      }
    ];

     supervisor:UsuarioSupervisorLineaResponse = {
        id_usuario: 0,
        username: '',
        perfil: '',
        estado: false,
        nombre: '',
        ap_paterno: '',
        ap_materno:  '' 
     } 

     



    ngOnInit(): void {
       this.supervisor= this.supervisorLineaService.supervisor   
    }


}
