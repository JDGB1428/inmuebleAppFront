import { Component, inject, signal, } from '@angular/core';
import { FormPropertyComponent } from "@property/component/form-property/form-property.component";
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-apartment-create-page',
  imports: [FormPropertyComponent],
  templateUrl: './apartment-create-page.component.html',
})
export class ApartmentCreatePageComponent {
  private readonly activatedRoute = inject(ActivatedRoute);
  propertyId = signal<number|null>(null);

  constructor(){
    this.getPropertyById();
  }

  getPropertyById() {
      this.activatedRoute.params.subscribe((params) => {
        this.propertyId.set(params['id']);
      })

    }
}
