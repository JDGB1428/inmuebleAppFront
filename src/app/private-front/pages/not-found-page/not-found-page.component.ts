import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '@services/auth.service';

@Component({
  selector: 'app-not-found-page',
  imports: [RouterLink],
  templateUrl: './not-found-page.component.html',
})
export class NotFoundPageComponent {
  private readonly authService = inject(AuthService);

  isAgent = this.authService.isAgent
  isAdmin = this.authService.isAdmin
  isClient = this.authService.isClient

}
