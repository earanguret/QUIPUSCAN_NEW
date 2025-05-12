import { Routes } from '@angular/router';
import { LoginComponent } from './infrastructure/pages/login/login.component';
import { PrincipalComponent } from './infrastructure/pages/principal/principal.component';

export const routes: Routes = [
    
    {
        path: '',
        redirectTo: 'login',
        pathMatch: 'full'
    },
    {
        path: 'login',
        component: LoginComponent
    },
    {
        path: 'principal',
        component: PrincipalComponent
    }
];
