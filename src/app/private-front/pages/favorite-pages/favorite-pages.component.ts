import { Component, inject, signal } from '@angular/core';
import { LoadingCardComponent } from "../../../shared/component/loading-card/loading-card.component";
import { Property } from '../../../core/interfaces/property.interfaces';
import { PropertyServices } from '../../../core/services/property.service';
import { CardPropertyComponent } from "../../../property/component/card-property/card-property.component";

@Component({
  selector: 'app-favorite-pages',
  imports: [LoadingCardComponent, CardPropertyComponent],
  templateUrl: './favorite-pages.component.html',
})
export class FavoritePagesComponent {
  loading = signal<boolean>(true);

  properties = signal<Property[]>([]);
  loadingCards = Array(8);

  private propertyService = inject(PropertyServices);

   ngOnInit(): void {
    setTimeout(() => {
      this.listProperties();
      this.loading.set(false);
    }, 2000);
  }

  listProperties(){
    this.propertyService.loadUserLikes().subscribe((properties) => {
      if(!properties) return [];
      return this.properties.set(properties.data);
    })
  }
}
