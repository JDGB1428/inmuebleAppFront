import { Component } from '@angular/core';
import { RouterLink } from "@angular/router";
import { CardDepartmentComponent } from "../../../property/component/card-department/card-department.component";

@Component({
  selector: 'app-apartment-page',
  imports: [RouterLink, CardDepartmentComponent],
  templateUrl: './apartment-page.component.html',
})
export class ApartmentPageComponent {

}
