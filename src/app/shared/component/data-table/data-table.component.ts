import { NgTemplateOutlet } from '@angular/common';
import { Component, computed, contentChild, effect, input, signal, TemplateRef } from '@angular/core';

@Component({
  selector: 'app-data-table',
  imports: [NgTemplateOutlet],
  templateUrl: './data-table.component.html',
})
export class DataTableComponent {
  data = input.required<any[]>();
  emptyTitle = input<string>('No hay registros');
  emptyMessage = input<string>('La lista está vacía actualmente.');
  showSearch = input<boolean>(true);
  searchKeys = input<string[]>([]);
  debounceDelay = input<number>(300);

  headerTemplate = contentChild<TemplateRef<any>>('header');
  bodyTemplate = contentChild<TemplateRef<any>>('body');
  rawSearchTerm = signal<string>('');
  activeSearchTerm = signal<string>('');


  constructor() {
    effect((onCleanup) => {
      const currentTerm = this.rawSearchTerm();
      const timer = setTimeout(() => {
        this.activeSearchTerm.set(currentTerm);
      }, this.debounceDelay());
      onCleanup(() => clearTimeout(timer));
    });
  }



  filteredData = computed(() => {
    const term = this.activeSearchTerm().toLowerCase();
    const sourceData = this.data();
    const keys = this.searchKeys();

    if (!term || keys.length === 0) return sourceData;

    const getNestedValue = (obj: any, path: string) => {
      return path.split('.').reduce((acc, part) => acc && acc[part], obj);
    };


    return sourceData.filter((item: any) => {
      return keys.some(key => {
        const val = getNestedValue(item, key);
        return val ? String(val).toLowerCase().includes(term) : false;
      });
    });
  });


  clearSearch() {
    this.rawSearchTerm.set('');
  }
}
