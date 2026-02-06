import { Component, computed, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from "@angular/router";

@Component({
  selector: 'login-form',
  imports: [RouterLink,ReactiveFormsModule],
  templateUrl: './login-form.component.html',
})
export class LoginFormComponent {
  show_password = signal(false);
  private fb = inject(FormBuilder);

  loginForm: FormGroup = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(8)]],
  })

  conditionalSwitchPassword = computed(() => this.show_password() ? 'text' : 'password');

  onSubmit(): void {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched(); // Para que el componente de error que creamos brille
      return;
    }
    console.log(this.loginForm.value);
  }

}
