import { Routes } from '@angular/router';
import { IsAdminAuthenticatedGuard } from '@auth/guards/is-admin.guard';
import { NotAuthenticatedGuard } from '@auth/guards/not-authenticated.guard';

export const routes: Routes = [

    {
        path: 'auth',
        loadChildren: () => import('./auth/auth.routes'),
        canMatch: [
            NotAuthenticatedGuard
        ]

    },

    {
        path: 'admin',
        loadChildren: () => import('./admin-dashboard/admin-dashboards.routes'),
        canMatch: [
            IsAdminAuthenticatedGuard
        ]
    },

    {
        path: '',
        loadChildren: () => import('./store-front/store-front.routes')
    },

    


];
