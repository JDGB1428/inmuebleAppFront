import { Component, inject, signal } from '@angular/core';
import { CardPropertyComponent } from "../../../property/component/card-property/card-property.component";
import { LoadingCardComponent } from "../../../shared/component/loading-card/loading-card.component";
import { Property } from '../../../core/interfaces/property.interfaces';
import { PropertyServices } from '../../../core/services/property.service';


@Component({
  selector: 'app-department-page',
  imports: [CardPropertyComponent, LoadingCardComponent],
  templateUrl: './property-page.component.html',
})
export class PropertyPageComponent {

  properties = signal<Property[]>([]);
  loading = signal<boolean>(true);
  loadingCards = Array(8);

  private propertyService = inject(PropertyServices);

   ngOnInit(): void {
    setTimeout(() => {
      this.listProperties();
      this.loading.set(false);
    }, 2000);
  }

  listProperties(){
    this.propertyService.getAllProperty().subscribe((properties) => {
      if(!properties) return [];
      return this.properties.set(properties.data);
    })
  }
}
