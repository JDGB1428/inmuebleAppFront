import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ToastContainer } from "@shared/component/toast-container/toast-container.component";

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, ToastContainer],
  templateUrl: './app.component.html',
})
export class AppComponent {
  protected readonly title = signal('inmueble-app-frontend');
}
