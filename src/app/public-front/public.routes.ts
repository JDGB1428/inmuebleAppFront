import { Routes } from "@angular/router";
import { PublicLayoutComponent } from "./layout/public-layout/public-layout.component";
import { HomePageComponent } from "./page/home-page/home-page.component";
import { NotFoundPageComponent } from "../private-front/pages/not-found-page/not-found-page.component";

export const publicRoutes:Routes = [
  {
    path:'',
    component: PublicLayoutComponent,
    children:[
      {
        path:'home',
        component: HomePageComponent
      },
      {
        path:'**',
        component:NotFoundPageComponent
      },
      {
        path:'',
        redirectTo:'public/home',
        pathMatch:'full'
      }
    ]
  }
];




export default publicRoutes;
