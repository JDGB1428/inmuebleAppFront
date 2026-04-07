import { Component, computed, inject, signal } from '@angular/core';
import { CardPropertyComponent } from "@property/component/card-property/card-property.component";
import { LoadingCardComponent } from "@shared/component/loading-card/loading-card.component";
import { Property } from '@interfaces/property.interfaces';
import { PropertyServices } from '@services/property.service';
import { rxResource} from '@angular/core/rxjs-interop';
import { SearchComponent } from "@shared/component/search/search.component";
import { FilterComponent } from "@shared/component/filter/filter.component";
import { debounceSignal } from '../../../core/utils/debounce-signal.util';


@Component({
  selector: 'app-department-page',
  imports: [CardPropertyComponent, LoadingCardComponent, SearchComponent, FilterComponent],
  templateUrl: './property-page.component.html',
})
export class PropertyPageComponent {

  private readonly propertyService = inject(PropertyServices);

  readonly search = signal('');
  readonly activeCategoryId = signal(0);
  readonly loadingCards = Array.from({ length: 8 });

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
