import { Routes } from "@angular/router";
import { NotFoundPageComponent } from "../private-front/pages/not-found-page/not-found-page.component";
import { AdminLayoutComponent } from "./layout/admin-layout/admin-layout.component";
import { AdminPageComponent } from "./page/admin-page/admin-page.component";

export const adminRoutes:Routes = [
  {
    path:'dashboard',
    component: AdminLayoutComponent,
    children:[
      { path:'home',
        component: AdminPageComponent,
      },
      {
        path: '**',
        component:NotFoundPageComponent
      },
      {
        path:'',
        pathMatch:'full',
        redirectTo: 'admin/dashboard/home'
      }
    ]
  }
];

export default adminRoutes;
