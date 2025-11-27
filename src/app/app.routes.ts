import { Routes } from '@angular/router';
import { MsalGuard } from '@azure/msal-angular';
import { Login } from './pages/login/login';
import { Productos } from './pages/productos/productos';
import { authGuard } from './guards/auth.guard';


export const routes: Routes = [
    {
        path: 'login',
        component: Login,
    },
    {
        path: 'productos',
        component: Productos,
        canActivate: [authGuard, MsalGuard],
    },
    {
        path: '',
        pathMatch: 'full',
        redirectTo: 'login',
    },
    {
        path: '**',
        redirectTo: 'login',
    },
];
