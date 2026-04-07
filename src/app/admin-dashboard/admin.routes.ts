import { Routes } from "@angular/router";
import { NotFoundPageComponent } from "../private-front/pages/not-found-page/not-found-page.component";
import { AdminLayoutComponent } from "./layout/admin-layout/admin-layout.component";
import { ApartmentPageComponent } from "./page/property-admin-page/property-page.component";
import { HomeAdminPage } from "./page/home-admin-page/home-admin-page.component";
import { UserAdminPageComponent } from "./page/user-admin-page/user-admin-page.component";
import { ApartmentCreatePageComponent } from "./page/apartment-create-page/apartment-create-page.component";
import { PropertyShowPageComponent } from "./page/property-show-page/property-show-page.component";
import { TrashPropertyPageComponent } from "./page/trash-property-page/trash-property-page.component";
import { ProfileAdminPageComponent } from "./page/profile-admin-page/profile-admin-page.component";
import { ShowProfileComponent } from "@profile/component/show-profile/show-profile.component";

export const adminRoutes:Routes = [
  {
    path:'dashboard',
    component: AdminLayoutComponent,
    children:[
      { path:'home',
        component: HomeAdminPage,
      },
      { path:'property',
        component: ApartmentPageComponent,
      },
      {
        path:'property/create',
        component:ApartmentCreatePageComponent
      },
      {
        path:'property/trashed',
        component:TrashPropertyPageComponent
      },
      { path:'users',
        component: UserAdminPageComponent,
      },
      { path:'users/show/:id',
        component: ShowProfileComponent,
      },
      {
        path:'property/show/:id',
        component:PropertyShowPageComponent
      },
      {
        path:'property/edit/:id',
        component:ApartmentCreatePageComponent
      },
      {
        path:'profile',
        component:ProfileAdminPageComponent
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
