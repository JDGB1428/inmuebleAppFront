import { Component, inject } from '@angular/core';
import { ToastMessage, ToastService } from '../../../core/services/toast.service';
import { Observable } from 'rxjs';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'toast-container',
  imports: [CommonModule],
  templateUrl: './toast-container.component.html',
})
export class ToastContainer {

  protected toastService = inject(ToastService);

}
