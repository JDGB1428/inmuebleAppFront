import { Routes } from "@angular/router";
import { NotFoundPageComponent } from "../private-front/pages/not-found-page/not-found-page.component";
import { AgentLayoutComponent } from "./layout/agent-layout/agent-layout.component";
import { AgentPageComponent } from "./page/agent-page/agent-page.component";

export const agentRoutes:Routes = [
  {
      path:'dashboard',
      component: AgentLayoutComponent,
      children:[
        {
          path:'home',
          component: AgentPageComponent
        },
        {
          path:'**',
          component:NotFoundPageComponent
        },
        {
          path:'',
          redirectTo:'agent/dashboard/home',
          pathMatch:'full'
        }
      ]
    }
];

export default agentRoutes;
