import { Component, input } from '@angular/core';

@Component({
  selector: 'error-form',
  imports: [],
  templateUrl: './error-form.component.html',
})
export class ErrorFormComponent {

  control = input<any>();

}
