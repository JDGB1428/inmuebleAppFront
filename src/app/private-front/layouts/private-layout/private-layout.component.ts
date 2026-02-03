import { Component } from '@angular/core';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-private-layout',
  imports: [RouterOutlet, NavbarComponent],
  templateUrl: './private-layout.component.html',
})
export class PrivateLayoutComponent {

}
