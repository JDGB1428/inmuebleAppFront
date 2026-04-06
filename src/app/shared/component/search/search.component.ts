import { Component, input, output} from '@angular/core';

@Component({
  selector: 'shared-search',
  imports: [],
  templateUrl: './search.component.html',
})
export class SearchComponent {
  searchChange = output<string>();

  onSearchInput(term: string) {
    this.searchChange.emit(term);
  }


}
