import { Component, input } from '@angular/core';
import { HTTPErrorResponseCustom } from '../../interfaces/auht-error.interfaces';

@Component({
  selector: 'error-form',
  imports: [],
  templateUrl: './error-form.component.html',
})
export class ErrorFormComponent {

  control = input<any>();

}
