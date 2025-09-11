import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { NavegatorComponent } from '../../shared/components/navegator/navegator.component';
import { SubnavegatorComponent } from '../../shared/components/subnavegator/subnavegator.component';
import { DashboardComponent } from '../../components/reportes/dashboard/dashboard.component';
import { UsuariosReporteComponent } from '../../components/reportes/usuarios-reporte/usuarios-reporte.component';
import { SerieDocumentalReporteComponent } from '../../components/reportes/serie-documental-reporte/serie-documental-reporte.component';
import { ProduccionSerieDocumentalReporteComponent } from '../../components/reportes/produccion-serie-documental-reporte/produccion-serie-documental-reporte.component';
import { ProduccionUsuarioReporteComponent } from '../../components/reportes/produccion-usuario-reporte/produccion-usuario-reporte.component';
import { ProduccionExpedientesComponent } from '../../components/reportes/produccion-expedientes/produccion-expedientes.component';
import { AuditoriaAccesosComponent } from '../../components/reportes/auditoria-accesos/auditoria-accesos.component';
import { AuditoriaHistoricoEventosComponent } from '../../components/reportes/auditoria-historico-eventos/auditoria-historico-eventos.component';

@Component({
  selector: 'app-reportes-demo',
  imports: [NavegatorComponent,
    SubnavegatorComponent, CommonModule,RouterLink, DashboardComponent, 
    UsuariosReporteComponent, SerieDocumentalReporteComponent, 
    ProduccionSerieDocumentalReporteComponent, ProduccionUsuarioReporteComponent, 
    ProduccionExpedientesComponent,AuditoriaAccesosComponent,AuditoriaHistoricoEventosComponent],
  templateUrl: './reportes-demo.component.html',
  styleUrl: './reportes-demo.component.css'
})
export class ReportesDemoComponent {
  isCollapsed = false;
  menu: string = 'dashboard';

  // Diccionario de submenús
  submenuOpen: { [key: string]: boolean } = {
    config: false,
    reportes: false
  };

  toggleSidebar() {
    this.isCollapsed = !this.isCollapsed;
  }

  toggleSubmenu(name: string) {
    this.submenuOpen[name] = !this.submenuOpen[name];
  }

  cambiarmenu(menu: string) {
    this.menu = menu;
  }


}
