import { Routes } from '@angular/router';


export const routes: Routes = [
  {
    path:'public',
    loadChildren: () =>import('./public-front/public.routes')
  },
  {
    path: 'private',
    loadChildren: () => import('./private-front/property.routes')
  },
  {
    path: 'auth',
    loadChildren: () => import('./auth/auth.routes')
  },
  {
    path: 'admin',
    loadChildren: () => import('./admin-dashboard/admin.routes')
  },
  {
    path: '',
    redirectTo:'/public/home',
    pathMatch:'full'
  }
];
