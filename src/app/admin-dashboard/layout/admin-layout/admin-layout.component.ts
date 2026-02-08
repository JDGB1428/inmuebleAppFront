import { Component } from '@angular/core';
import { RouterOutlet, RouterLinkWithHref, RouterLink } from '@angular/router';
import { NavbarDrawerComponent } from '../../component/navbar-drawer/navbar-drawer.component';
import { SiderDrawerComponent } from '../../component/sider-drawer/sider-drawer.component';

@Component({
  selector: 'app-admin-layout',
  imports: [RouterOutlet, RouterLink, NavbarDrawerComponent, SiderDrawerComponent,],
  templateUrl: './admin-layout.component.html',
})
export class AdminLayoutComponent {

}
