import { Component, input, output } from '@angular/core';

@Component({
  selector: 'shared-filter',
  imports: [],
  templateUrl: './filter.component.html',

})
export class FilterComponent {
  activeCategoryId = input.required<number>();
  categoryChange = output<number>();

  applyFilter(categoryId: number) {
    this.categoryChange.emit(categoryId);
  }
}
