import { Component, inject, input } from '@angular/core';
import { Property } from '@interfaces/property.interfaces';
import { CurrencyPipe } from '@angular/common';
import { RouterLink } from "@angular/router";
import { AuthService } from '@services/auth.service';

@Component({
  selector: 'card-property',
  imports: [CurrencyPipe, RouterLink],
  templateUrl: './card-property.component.html',

})
export class CardPropertyComponent {
  properties = input.required<Property>();

  private authService = inject(AuthService);

  isClient = this.authService.isClient;
  isOwner = this.authService.isOwner;
  isAdmin = this.authService.isAdmin;

}
