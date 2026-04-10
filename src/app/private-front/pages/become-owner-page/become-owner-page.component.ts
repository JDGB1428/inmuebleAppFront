import { Component, inject, OnInit, signal } from '@angular/core';
import { FormBecomeOwnerComponent } from "../../components/form-become-owner/form-become-owner.component";
import { RequestServices } from '@services/request.service';

@Component({
  selector: 'app-become-owner-page',
  imports: [FormBecomeOwnerComponent],
  templateUrl: './become-owner-page.component.html',
})
export class BecomeOwnerPageComponent implements OnInit {

  private readonly rolRequestService = inject(RequestServices);
  requestStatus = signal<string|null>(null);

  ngOnInit(): void {
    this.checkRolRequest();
  }

  checkRolRequest(){
    this.rolRequestService.getRoleRequestById().subscribe({
      next:(res) => {
        this.requestStatus.set(res.data.status);
        console.log(res.data.status);
      },
      error: () => {
        this.requestStatus.set(null);
      }
    })
  }
}
