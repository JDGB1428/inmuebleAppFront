import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarDrawerComponent } from '../../component/navbar-drawer/navbar-drawer.component';
import { SiderDrawerComponent } from '../../component/sider-drawer/sider-drawer.component';

@Component({
  selector: 'app-admin-layout',
  imports: [RouterOutlet, NavbarDrawerComponent, SiderDrawerComponent],
  templateUrl: './admin-layout.component.html',
})
export class AdminLayoutComponent {

}
