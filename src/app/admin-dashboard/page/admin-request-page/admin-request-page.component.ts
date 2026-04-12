import { DatePipe, Location } from '@angular/common';
import { Component, computed, inject, signal, ViewChild } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { RoleRequest } from '@interfaces/response_api.interfaces';
import { RequestServices } from '@services/request.service';
import { ToastService } from '@services/toast.service';
import { DataTableComponent } from "@shared/component/data-table/data-table.component";
import { ConfirmModalComponent } from "@shared/component/confirm-modal/confirm-modal.component";

@Component({
  selector: 'app-admin-request-page',
  imports: [DataTableComponent, DatePipe, ConfirmModalComponent],
  templateUrl: './admin-request-page.component.html',
})
export class AdminRequestPageComponent {
  private readonly requestService = inject(RequestServices);
  private readonly toastService = inject(ToastService);
  private readonly location = inject(Location);

  requestDeleteId = signal<RoleRequest['id']>(0);

  @ViewChild('rejectRequestModal') rejectRequestModal!: ConfirmModalComponent

  request_resource = rxResource({
    stream: () => {
      return this.requestService.getAllRequest();
    },
    defaultValue:{
      message: '',
      data: [] as RoleRequest[],
    }
  });

  readonly rol_request = computed(() => this.request_resource.value().data);

  openDeleteConfirmation(id: number) {
    this.requestDeleteId.set(id);
    this.rejectRequestModal.open();
  }


  roleApprove(id:number){
    this.requestService.roleAproveRequest(id).subscribe((approve) => {
      this.toastService.show(`${approve.message}`,'success', 500);
    })
  }

  destroyRequest() {
    if (!this.requestDeleteId()) return;

    this.requestService.roleRejectRequest(this.requestDeleteId()).subscribe({
      next: () => {
        this.toastService.show('solicitud rechazada exitosamente', 'success', 3000);
        this.requestDeleteId.set(0);
        this.rejectRequestModal.close();
        this.location.back();
      },
      error: (err) => {
        this.toastService.show('Error al eliminar', 'error', 3000);
        this.requestDeleteId.set(0);
      }
    });
  }



}
