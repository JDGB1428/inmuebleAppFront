import { Routes } from "@angular/router";
import { NotFoundPageComponent } from "../private-front/pages/not-found-page/not-found-page.component";
import { AdminLayoutComponent } from "./layout/admin-layout/admin-layout.component";
import { HousePageComponent } from "./page/house-admin-page/house-page.component";
import { OfficesPageComponent } from "../private-front/pages/offices-page/offices-page.component";
import { ApartmentPageComponent } from "./page/apartment-admin-page/apartment-page.component";
import { HomeAdminPage } from "./page/home-admin-page/home-admin-page.component";
import { LandAdminPageComponent } from "./page/land-admin-page/land-admin-page.component";
import { UserAdminPageComponent } from "./page/user-admin-page/user-admin-page.component";
import { ApartmentCreatePageComponent } from "./page/apartment-create-page/apartment-create-page.component";

export const adminRoutes:Routes = [
  {
    path:'dashboard',
    component: AdminLayoutComponent,
    children:[
      { path:'home',
        component: HomeAdminPage,
      },
      { path:'houses',
        component: HousePageComponent,
      },
      { path:'offices',
        component: OfficesPageComponent,
      },
      { path:'apartments',
        component: ApartmentPageComponent,
      },
      {
        path:'apartments/create',
        component:ApartmentCreatePageComponent
      },
      { path:'lands',
        component: LandAdminPageComponent,
      },
      { path:'users',
        component: UserAdminPageComponent,
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
