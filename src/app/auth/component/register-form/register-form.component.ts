import { ChangeDetectorRef, Component, computed, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../service/auth.service';
import { ErrorFormComponent } from "../error-form/error-form.component";
import { HttpErrorResponse } from '@angular/common/http';
import { HTTPErrorResponseCustom } from '../../interfaces/auth-error.interfaces';

@Component({
  selector: 'register-form',
  imports: [ReactiveFormsModule, ErrorFormComponent],
  templateUrl: './register-form.component.html',
})
export class RegisterFormComponent {


  show_password = signal(false);
  show_confirm_password = signal(false);
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private cdr = inject(ChangeDetectorRef);

  error = signal<HTTPErrorResponseCustom | null>(null);

  registerForm: FormGroup = this.fb.group({
    name: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    password_confirmation: ['', [Validators.required, Validators.minLength(6)]],
    phone: [0, Validators.required]
  })

  conditionalSwitchPassword = computed(() => this.show_password() ? 'text' : 'password');
  conditionalSwitchConfirmPassword = computed(() => this.show_confirm_password() ? 'text' : 'password');

  onSubmit(): void {

    this.authService.authRegister(this.registerForm.value).subscribe({
      next: (user) => {
        console.log('Usuario creado:', user);
      },
      error: (err) => {
        this.handlerError(err);
      }
    });

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
        }
      });

      this.cdr.detectChanges();
    }
  }

}
