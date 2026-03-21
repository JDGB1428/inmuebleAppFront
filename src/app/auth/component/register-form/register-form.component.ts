import { Router, RouterLink, Routes } from '@angular/router';
import { ChangeDetectorRef, Component, computed, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../../core/services/auth.service';
import { ErrorFormComponent } from "../error-form/error-form.component";
import { HttpErrorResponse } from '@angular/common/http';
import { HTTPErrorResponseCustom } from '../../../core/interfaces/auth-error.interfaces';
import { ToastService } from '../../../core/services/toast.service';
import { UserAdapater } from '../../../core/interfaces/user.interfaces';

@Component({
  selector: 'register-form',
  imports: [RouterLink, ReactiveFormsModule, ErrorFormComponent],
  templateUrl: './register-form.component.html',
})
export class RegisterFormComponent {

  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private cdr = inject(ChangeDetectorRef);
  private toastService = inject(ToastService)

  error = signal<HTTPErrorResponseCustom | null>(null);

  registerForm: FormGroup = this.fb.group({
    name: [''],
    email: [''],
    password: [''],
    password_confirmation: [''],
  })


  onSubmit(): void {

    if (this.registerForm.valid) {
      const saveUser: UserAdapater = this.registerForm.value;
      this.authService.authRegister(saveUser).subscribe({
        next: (user) => {
          const role = String(user.roles);
          this.registerForm.reset();
          this.authService.saveSession(user.token, user, false, role);
          this.authService.redirectByRole(role);
          this.toastService.show('El usuario ha sido creado correctamente','success', 3000)
        },
        error: (err) => {
          this.handlerError(err);
        }
      });
    }
  }

  private handlerError(err: HttpErrorResponse): void {
    if (err.status === 422) {
      const validationError = err.error as HTTPErrorResponseCustom;
      this.error.set(validationError);
      const laravelErrors = validationError.errors;
      Object.keys(laravelErrors).forEach((field) => {
        const control = this.registerForm.get(field);
        if (control) {
          control.setErrors({ serverError: laravelErrors[field][0] });
          this.registerForm.markAllAsTouched();
        }
      });

      this.cdr.detectChanges();
    }
  }

}
