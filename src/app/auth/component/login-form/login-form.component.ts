import { ChangeDetectorRef, Component, computed, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from "@angular/router";
import { AuthService } from '../../../core/services/auth.service';
import { HTTPErrorResponseCustom } from '../../../core/interfaces/auth-error.interfaces';
import { HttpErrorResponse } from '@angular/common/http';
import { ErrorFormComponent } from '../error-form/error-form.component';
import { ToastService } from '../../../core/services/toast.service';

@Component({
  selector: 'login-form',
  imports: [RouterLink,ReactiveFormsModule, ErrorFormComponent, FormsModule],
  templateUrl: './login-form.component.html',
})
export class LoginFormComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private cdr = inject(ChangeDetectorRef);
  private toastService = inject(ToastService);

  error = signal<HTTPErrorResponseCustom | null>(null);

  loginForm:FormGroup = this.fb.group({
    email: [''],
    password: [''],
    rememberMe: [false]
  })

  onSubmit(): void {
    if (this.loginForm.valid) {
      const { rememberMe } = this.loginForm.value;
      this.authService.authLogin(this.loginForm.value).subscribe({
        next: (user) => {
          const role = String(user.roles);
          this.loginForm.reset();
          this.authService.saveSession(user.token, user, rememberMe, role);
          this.authService.redirectByRole(role);
          this.toastService.show('El usuario a iniciado sesion correctamente', 'success', 3000)
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
        const control = this.loginForm.get(field);
        if (control) {
          control.setErrors({ serverError: laravelErrors[field][0] });
          this.loginForm.markAllAsTouched();
        }
      });

      this.cdr.detectChanges();
    }
  }

}
