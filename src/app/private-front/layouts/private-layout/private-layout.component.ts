import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Navbar } from "../../../shared/component/navbar/navbar.component";

@Component({
  selector: 'app-private-layout',
  imports: [RouterOutlet, Navbar],
  templateUrl: './private-layout.component.html',
})
export class PrivateLayoutComponent {

}
