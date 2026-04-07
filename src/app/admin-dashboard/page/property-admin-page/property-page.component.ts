
import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { RouterLink } from "@angular/router";
import { CardPropertyComponent } from "../../../property/component/card-property/card-property.component";
import { PropertyServices } from '@services/property.service';
import { Property } from '@interfaces/property.interfaces';
import { LoadingCardComponent } from "../../../shared/component/loading-card/loading-card.component";
import { AuthService } from '@services/auth.service';
import { SearchComponent } from "@shared/component/search/search.component";
import { FilterComponent } from "@shared/component/filter/filter.component";
import { rxResource } from '@angular/core/rxjs-interop';
import { debounceSignal } from '../../../core/utils/debounce-signal.util';

@Component({
  selector: 'app-apartment-page',
  imports: [RouterLink, CardPropertyComponent, LoadingCardComponent, SearchComponent, FilterComponent],
  templateUrl: './property-page.component.html',
})
export class ApartmentPageComponent{

  private readonly propertyService = inject(PropertyServices);
  private readonly authService = inject(AuthService);

  readonly search = signal('');
  readonly activeCategoryId = signal(0);
  readonly loadingCards = Array.from({ length: 8 });
  readonly isAgent = this.authService.isAgent();
  readonly isAdmin = this.authService.isAdmin();

  private readonly debouncedSearch = debounceSignal(this.search, 400);

  private readonly criteria = computed(() => ({
    search: this.debouncedSearch().trim(),
    categoryId: this.activeCategoryId(),
  }));

  readonly propertiesResource = rxResource({
    params: () => this.criteria(),
    stream: ({ params }) => {
      const { search, categoryId } = params;

      if (search) {
        return this.propertyService.searchProperty(search);
      }

      if (categoryId > 0) {
        return this.propertyService.filterProperty(categoryId);
      }

      return this.propertyService.getAllProperty();
    },
    defaultValue: {
      message: '',
      data: [] as Property[],
    },
  });

  readonly properties = computed(() => this.propertiesResource.value().data);

  readonly loading = computed(() => {
    const status = this.propertiesResource.status();
    return status === 'loading' || status === 'reloading';
  });

  onSearchInput(value: string): void {
    this.search.set(value);
  }

  applyFilter(categoryId: number): void {
    this.activeCategoryId.set(categoryId);
  }


}
