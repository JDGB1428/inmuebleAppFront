import { Component, inject } from '@angular/core';
import { AuthService } from '../../../core/services/auth.service';
import { Location } from '@angular/common';

@Component({
  selector: 'navbar-drawer',
  imports: [],
  templateUrl: './navbar-drawer.component.html',
})
export class NavbarDrawerComponent {
  private authService = inject(AuthService);
  private location = inject(Location);



  logout():void {
    this.authService.authLogout().subscribe(() => {
      this.location.back();
    });
  }
}
