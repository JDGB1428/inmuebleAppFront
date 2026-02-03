import { Routes } from "@angular/router";
import { AuthLayoutComponent } from "./layout/auth-layout/auth-layout.component";
import { LoginPageComponent } from "./login-page/login-page.component";
import { RegisterPageComponent } from "./register-page/register-page.component";
import { NotFoundPageComponent } from "../private-front/pages/not-found-page/not-found-page.component";

export const authRoutes:Routes = [
  {
    path:'',
    component:AuthLayoutComponent,
    children:[
      {
        path:'login',
        component: LoginPageComponent
      },
      {
        path:'register',
        component: RegisterPageComponent
      },
      {
        path: '**',
        component:NotFoundPageComponent
      },
      {
        path: '',
        redirectTo: 'private/auth/login',
        pathMatch: 'full'
      }
    ]
  }
];

export default authRoutes;
