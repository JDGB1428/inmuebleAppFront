import { Component, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators, } from '@angular/forms';
import { CreateRoleRequestDTO, RoleRequestDTO } from '@interfaces/response-dto.interfaces';
import { RequestServices } from '@services/request.service';
import { ToastService } from '@services/toast.service';



@Component({
  selector: 'form-become-owner',
  imports: [ReactiveFormsModule],
  templateUrl: './form-become-owner.component.html',
})
export class FormBecomeOwnerComponent {
  private readonly fb = inject(FormBuilder);
  private readonly requestService = inject(RequestServices);
  private readonly toastService = inject(ToastService);

  FormBecome: FormGroup = this.fb.group({
    'description': ['', Validators.required]
  })

  onSubmit() {
    if (this.FormBecome.valid) {
      const payload:CreateRoleRequestDTO = {
        description: this.FormBecome.value.description
      }

      this.requestService.createRequest(payload).subscribe(() =>{
        this.FormBecome.reset();
        this.toastService.show('La solicitud fue enviada correctamente','success', 500);
      })
    }
  }



}
