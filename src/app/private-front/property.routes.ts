import { PrivateLayoutComponent } from "./layouts/private-layout/private-layout.component";

import { DepartmentPageComponent } from "./pages/department/department-page.component";

import { NotFoundPageComponent } from "./pages/not-found-page/not-found-page.component";
import { Routes } from "@angular/router";

export const InmueblesRoutes:Routes = [
  {
    path: '',
    component: PrivateLayoutComponent,
    children: [
      {
        path: 'propiedades',
        component: DepartmentPageComponent
      },
      {
        path: '**',
        component: NotFoundPageComponent,
      },
      {
        path: '',
        redirectTo: 'private/home',
        pathMatch: 'full'
      }
    ],

  }
]

export default InmueblesRoutes;
