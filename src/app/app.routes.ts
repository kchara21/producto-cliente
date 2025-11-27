import { Routes } from '@angular/router';
import { MsalGuard } from '@azure/msal-angular';
import { Login } from './pages/login/login';
import { Productos } from './pages/productos/productos';


export const routes: Routes = [
    {
        path: 'login',
        component: Login,
    },
    {
        path: 'productos',
        component: Productos,
        canActivate: [MsalGuard],
    },
    {
        path: '',
        pathMatch: 'full',
        redirectTo: 'productos',
    },
    {
        path: '**',
        redirectTo: 'productos',
    },
];
