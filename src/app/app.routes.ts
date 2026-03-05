import { Routes } from '@angular/router';
import { roleGuard } from './core/guards/role.guard';


export const routes: Routes = [
  {
    path:'public',
    loadChildren: () =>import('./public-front/public.routes')
  },
  {
    path: 'private',
    loadChildren: () => import('./private-front/property.routes'),
    canMatch: [roleGuard],
    data: {expectedRoles: ['client']}
  },
  {
    path: 'auth',
    loadChildren: () => import('./auth/auth.routes')
  },
  {
    path: 'admin',
    loadChildren: () => import('./admin-dashboard/admin.routes'),
    canMatch: [roleGuard],
    data: {expectedRoles: ['admin','agent']}
  },
  {
    path: '',
    redirectTo:'/public/home',
    pathMatch:'full'
  }
];
