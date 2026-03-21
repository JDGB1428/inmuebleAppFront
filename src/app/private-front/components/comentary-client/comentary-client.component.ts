import { Component, inject } from '@angular/core';
import { AuthService } from '../../../core/services/auth.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'comentary-client',
  imports: [DatePipe],
  templateUrl: './comentary-client.component.html',
})
export class ComentaryClient {
  private readonly authService = inject(AuthService);

  isClient = this.authService.isClient();
}
