import { Component, inject } from '@angular/core';
import { RouterLink, RouterOutlet} from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { Navbar } from "../../../shared/component/navbar/navbar.component";

@Component({
  selector: 'app-admin-layout',
  imports: [RouterOutlet, RouterLink, Navbar],
  templateUrl: './admin-layout.component.html',
})
export class AdminLayoutComponent {
  private authService = inject(AuthService);

  isAgent = this.authService.isAgent();
  isAdmin = this.authService.isAdmin();

}
