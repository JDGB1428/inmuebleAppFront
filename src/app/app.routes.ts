import { AdminLayoutComponent } from './layouts/admin-layout/admin-layout.component';
import { Routes } from '@angular/router';
import { PrivateLayoutComponent } from './layouts/private-layout/private-layout.component';
import { AuthLayoutComponent } from './layouts/auth-layout/auth-layout.component';
import { NotFoundPageComponent } from './pages/not-found-page/not-found-page.component';

export const routes: Routes = [
  {
    path:'',
    component:PrivateLayoutComponent,
    children:[
      {
        path:'department',
        loadComponent: () => import('./pages/department/department-page.component').then(m => m.DepartmentPageComponent)
      },
      {
        path:'house',
        loadComponent: () => import('./pages/house-page/house-page.component').then(m => m.HousePageComponent)
      },
      {
        path:'land',
        loadComponent: () => import('./pages/land-page/land-page.component').then(m => m.LandPageComponent)
      }
    ]
  },
  {
    path:'admin',
    component:AdminLayoutComponent
  },
  {
    path:'auth',
    component:AuthLayoutComponent,
    children:[
      {
        path:'auth/login',
        loadComponent: () => import('./pages/department/department-page.component').then(m => m.DepartmentPageComponent)
      },
      {
        path:'auth/register',
        loadComponent: () => import('./pages/house-page/house-page.component').then(m => m.HousePageComponent)
      },
    ]
  },
  {
    path:'**',
    component:NotFoundPageComponent
  }
];
