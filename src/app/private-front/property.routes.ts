import { PrivateLayoutComponent } from "./layouts/private-layout/private-layout.component";
import { PropertyPageComponent } from "./pages/property-page/property-page.component";
import { NotFoundPageComponent } from "./pages/not-found-page/not-found-page.component";
import { Routes } from "@angular/router";
import { ProfileClientPageComponent } from "./pages/profile-client-page/profile-client-page.component";
import { PropertyShowPageComponent } from "../admin-dashboard/page/property-show-page/property-show-page.component";
import { FavoritePagesComponent } from "./pages/favorite-pages/favorite-pages.component";

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
        path:'favoritos',
        component:FavoritePagesComponent
      },
      {
        path:'home/show/:id',
        component:PropertyShowPageComponent
      },
      {
        path:'favoritos/show/:id',
        component:PropertyShowPageComponent
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
