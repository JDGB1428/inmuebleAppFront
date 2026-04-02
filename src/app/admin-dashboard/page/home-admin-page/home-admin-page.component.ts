import { Component, inject } from '@angular/core';
import { AuthService } from '@services/auth.service';

@Component({
  selector: 'app-home-admin-page',
  imports: [],
  templateUrl: './home-admin-page.component.html',
})
export class HomeAdminPage {
  private readonly authService = inject(AuthService);

  isAgent = this.authService.isAgent();
  isAdmin = this.authService.isAdmin();
}
