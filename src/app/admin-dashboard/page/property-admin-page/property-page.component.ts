
import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterLink } from "@angular/router";
import { CardPropertyComponent } from "../../../property/component/card-property/card-property.component";
import { PropertyServices } from '@services/property.service';
import { Property } from '@interfaces/property.interfaces';
import { LoadingCardComponent } from "../../../shared/component/loading-card/loading-card.component";
import { AuthService } from '@services/auth.service';

@Component({
  selector: 'app-apartment-page',
  imports: [RouterLink, CardPropertyComponent, LoadingCardComponent],
  templateUrl: './property-page.component.html',
})
export class ApartmentPageComponent implements OnInit {

  properties = signal<Property[]>([]);
  loading = signal<boolean>(true);
  loadingCards = Array(8);


  private propertyService = inject(PropertyServices);
  private authService = inject(AuthService);

  isAgent = this.authService.isAgent();
  isAdmin = this.authService.isAdmin();

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
