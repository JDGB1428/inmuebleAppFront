import { Component, inject, signal, ViewChild } from '@angular/core';
import { ToastService } from '../../../core/services/toast.service';
import { PropertyServices } from '../../../core/services/property.service';
import { Property } from '../../../core/interfaces/property.interfaces';
import { ConfirmModalComponent } from '../../../shared/component/confirm-modal/confirm-modal.component';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { DataTableComponent } from "../../../shared/component/data-table/data-table.component";

@Component({
  selector: 'app-trash-property-page',
  imports: [ConfirmModalComponent, DatePipe, CurrencyPipe, ConfirmModalComponent, DataTableComponent],
  templateUrl: './trash-property-page.component.html',
})
export class TrashPropertyPageComponent {
  private propertyService = inject(PropertyServices);
  private toastService = inject(ToastService);

  trashedProperties = signal<Property[]>([]);
  propertyIdToRestore = signal<number>(0);

  @ViewChild('restoreModal') restoreModal!: ConfirmModalComponent;

  ngOnInit() {
    this.loadTrashedProperties();
  }


  loadTrashedProperties() {
    this.propertyService.getTrashedProperties().subscribe({
      next: (res) => {
        this.trashedProperties.set(res.data);
      }
    });
  }


  openRestoreConfirmation(id: number) {
    this.propertyIdToRestore.set(id);
    this.restoreModal.open();
  }


  executeRestore() {
    const idToRestore = this.propertyIdToRestore();

    if (!idToRestore || idToRestore === 0) return;

    this.propertyService.restoreProperty(idToRestore).subscribe({
      next: (res) => {
        this.toastService.show('Inmueble restaurado con éxito', 'success', 3000);


        const currentList = this.trashedProperties();
        const updatedList = currentList.filter(p => p.id !== idToRestore);
        this.trashedProperties.set(updatedList);

        this.propertyIdToRestore.set(0);
        this.restoreModal.close();
      },
      error: (err) => {
        this.toastService.show('Error al restaurar', 'error', 3000);
        this.propertyIdToRestore.set(0);
        this.restoreModal.close();
      }
    });
  }
}
