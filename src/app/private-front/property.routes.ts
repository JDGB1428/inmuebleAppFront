import { PrivateLayoutComponent } from "./layouts/private-layout/private-layout.component";
import { PropertyPageComponent } from "./pages/property-page/property-page.component";
import { NotFoundPageComponent } from "./pages/not-found-page/not-found-page.component";
import { Routes } from "@angular/router";
import { ProfileClientPageComponent } from "./pages/profile-client-page/profile-client-page.component";

export const InmueblesRoutes:Routes = [
  {
    path: '',
    component: PrivateLayoutComponent,
    children: [
      {
        path: 'home',
        component: PropertyPageComponent
      },
      {
        path:'profile',
        component:ProfileClientPageComponent
      },
      {
        path: '**',
        component: NotFoundPageComponent,
      },
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'private/home',
      }
    ],

  }
]

export default InmueblesRoutes;
