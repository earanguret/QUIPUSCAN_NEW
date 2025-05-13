import { Routes } from '@angular/router';
import { LoginComponent } from './infrastructure/pages/login/login.component';
import { PrincipalComponent } from './infrastructure/pages/principal/principal.component';
import { FormUsuarioComponent } from './infrastructure/pages/usuario/form-usuario/form-usuario.component';
import { ListUsuarioComponent } from './infrastructure/pages/usuario/list-usuario/list-usuario.component';
import { ModUsuarioComponent } from './infrastructure/pages/usuario/mod-usuario/mod-usuario.component';

export const routes: Routes = [
    
    {
        path: '',
        redirectTo: 'login',
        pathMatch: 'full'
    },
    {   path: 'login', component: LoginComponent  },
    {   path: 'principal', component: PrincipalComponent  },

    {   path: 'principal/form-usuario', component: FormUsuarioComponent  },
    {   path: 'principal/list-usuario', component: ListUsuarioComponent  },
    {   path: 'principal/form-usuario/:id_usuario', component: FormUsuarioComponent  },
    {   path: 'principal/mod-usuario/:id_usuario', component: ModUsuarioComponent  },

];
