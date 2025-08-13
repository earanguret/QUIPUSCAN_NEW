import { Routes } from '@angular/router';
import { LoginComponent } from './infrastructure/pages/login/login.component';
import { PrincipalComponent } from './infrastructure/pages/principal/principal.component';
import { FormUsuarioComponent } from './infrastructure/pages/usuario/form-usuario/form-usuario.component';
import { ListUsuarioComponent } from './infrastructure/pages/usuario/list-usuario/list-usuario.component';
import { ModUsuarioComponent } from './infrastructure/pages/usuario/mod-usuario/mod-usuario.component';
import { RecepcionListSerieDocComponent } from './infrastructure/pages/recepcion/recepcion-list-serie-doc/recepcion-list-serie-doc.component';
import { RecepcionExpedientesComponent } from './infrastructure/pages/recepcion/recepcion-expedientes/recepcion-expedientes.component';
import { PreparacionListSerieDocComponent } from './infrastructure/pages/preparacion/preparacion-list-serie-doc/preparacion-list-serie-doc.component';
import { PreparacionExpedientesComponent } from './infrastructure/pages/preparacion/preparacion-expedientes/preparacion-expedientes.component';
import { DigitalizacionListSerieDocComponent } from './infrastructure/pages/digitalizacion/digitalizacion-list-serie-doc/digitalizacion-list-serie-doc.component';
import { DigitalizacionExpedientesComponent } from './infrastructure/pages/digitalizacion/digitalizacion-expedientes/digitalizacion-expedientes.component';
import { IndizadorListSerieDocComponent } from './infrastructure/pages/indizador/indizador-list-serie-doc/indizador-list-serie-doc.component';
import { IndizadorExpedientesComponent } from './infrastructure/pages/indizador/indizador-expedientes/indizador-expedientes.component';
import { ControlListSerieDocComponent } from './infrastructure/pages/control/control-list-serie-doc/control-list-serie-doc.component';
import { ControlExpedientesComponent } from './infrastructure/pages/control/control-expedientes/control-expedientes.component';
import { FedatarioListSerieDocComponent } from './infrastructure/pages/fedatario/fedatario-list-serie-doc/fedatario-list-serie-doc.component';
import { FedatarioExpedientesComponent } from './infrastructure/pages/fedatario/fedatario-expedientes/fedatario-expedientes.component';
import { BovedaListSerieDocComponent } from './infrastructure/pages/boveda/boveda-list-serie-doc/boveda-list-serie-doc.component';
import { BovedaExpedientesComponent } from './infrastructure/pages/boveda/boveda-expedientes/boveda-expedientes.component';
import { ReporteComponent } from './infrastructure/pages/reporte/reporte.component';

import { AuthGuard } from './guard/auth.guard';

export const routes: Routes = [
    
    {
        path: '',
        redirectTo: 'login',
        pathMatch: 'full'
    },
    {   path: 'login', component: LoginComponent  },
    {   path: 'principal', component: PrincipalComponent  ,canActivate: [AuthGuard]},

    {   path: 'principal/form-usuario', component: FormUsuarioComponent  ,canActivate: [AuthGuard]},
    {   path: 'principal/list-usuario', component: ListUsuarioComponent  ,canActivate: [AuthGuard]},
    {   path: 'principal/form-usuario/:id_usuario', component: FormUsuarioComponent  ,canActivate: [AuthGuard]},
    {   path: 'principal/mod-usuario/:id_usuario', component: ModUsuarioComponent  ,canActivate: [AuthGuard]},

    {   path: 'principal/recepcion/list-serie-documental', component: RecepcionListSerieDocComponent  ,canActivate: [AuthGuard]},
    {   path: 'principal/recepcion/serie-documental/expedientes/:id', component: RecepcionExpedientesComponent  ,canActivate: [AuthGuard]},

    {   path: 'principal/preparacion/list-serie-documental', component: PreparacionListSerieDocComponent  ,canActivate: [AuthGuard]},
    {   path: 'principal/preparacion/serie-documental/expedientes/:id', component: PreparacionExpedientesComponent  ,canActivate: [AuthGuard]},

    {   path: 'principal/digitalizacion/list-serie-documental', component: DigitalizacionListSerieDocComponent  ,canActivate: [AuthGuard]},
    {   path: 'principal/digitalizacion/serie-documental/expedientes/:id', component: DigitalizacionExpedientesComponent  ,canActivate: [AuthGuard]},

    {   path: 'principal/indizador/list-serie-documental', component: IndizadorListSerieDocComponent  ,canActivate: [AuthGuard]},
    {   path: 'principal/indizador/serie-documental/expedientes/:id', component: IndizadorExpedientesComponent  ,canActivate: [AuthGuard]},

    {   path: 'principal/controlcalidad/list-serie-documental', component: ControlListSerieDocComponent  ,canActivate: [AuthGuard]},
    {   path: 'principal/controlcalidad/serie-documental/expedientes/:id', component: ControlExpedientesComponent  ,canActivate: [AuthGuard]},

    {   path: 'principal/fedatario/list-serie-documental', component: FedatarioListSerieDocComponent  ,canActivate: [AuthGuard]},
    {   path: 'principal/fedatario/serie-documental/expedientes/:id', component: FedatarioExpedientesComponent  ,canActivate: [AuthGuard]},

    {   path: 'principal/boveda/list-serie-documental', component: BovedaListSerieDocComponent  ,canActivate: [AuthGuard]},
    {   path: 'principal/boveda/serie-documental/expedientes/:id', component: BovedaExpedientesComponent  ,canActivate: [AuthGuard]},

    {   path: 'principal/reportes', component: ReporteComponent  ,canActivate: [AuthGuard]},


];
