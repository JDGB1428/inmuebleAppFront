
import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterLink } from "@angular/router";
import { CardDepartmentComponent } from "../../../property/component/card-department/card-department.component";
import { PropertyServices } from '../../../core/services/property.service';
import { Property } from '../../../core/interfaces/property.interfaces';
import { ApiResponse } from '../../../core/interfaces/http-reponses.interfaces';

@Component({
  selector: 'app-apartment-page',
  imports: [RouterLink, CardDepartmentComponent],
  templateUrl: './apartment-page.component.html',
})
export class ApartmentPageComponent implements OnInit {
  ngOnInit(): void {
    this.listProperties();
  }


  private propertyService = inject(PropertyServices);

  properties = signal<Property[]>([]);


  listProperties(){
    this.propertyService.getAllProperty().subscribe((properties) => {
      if(!properties) return [];
      return this.properties.set(properties.data);
    })
  }


}
