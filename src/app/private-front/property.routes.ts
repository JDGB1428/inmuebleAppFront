import { PrivateLayoutComponent } from "./layouts/private-layout/private-layout.component";
import { HousePageComponent } from "./pages/house-page/house-page.component";
import { DepartmentPageComponent } from "./pages/department/department-page.component";
import { LandPageComponent } from "./pages/land-page/land-page.component";
import { OfficesPageComponent } from "./pages/offices-page/offices-page.component";
import { NotFoundPageComponent } from "./pages/not-found-page/not-found-page.component";
import { Routes } from "@angular/router";

export const InmueblesRoutes:Routes = [
  {
    path: '',
    component: PrivateLayoutComponent,
    children: [
      {
        path: 'home',
        component: HousePageComponent
      },
      {
        path: 'departamentos',
        component: DepartmentPageComponent
      },
      {
        path:'terrenos',
        component: LandPageComponent
      },
      {
        path:'oficinas',
        component: OfficesPageComponent
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
    ]
  }
]

export default InmueblesRoutes;
