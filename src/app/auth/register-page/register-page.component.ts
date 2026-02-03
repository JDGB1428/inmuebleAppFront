import { Component, computed, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-register',
  imports: [ReactiveFormsModule],
  templateUrl: './register-page.component.html',
})
export class RegisterPageComponent {

  show_password = signal(false);
  show_confirm_password = signal(false);
  private fb = inject(FormBuilder);

  registerForm = this.fb.group({
    name: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    confirm_password: ['', [Validators.required, Validators.minLength(6)]],
  })

  conditionalSwitchPassword = computed(() => {
    if (this.show_password() === true) {
      return 'text';
    }
    return 'password';
  });

  conditionalSwitchConfirmPassword = computed(() => {
    if (this.show_confirm_password() === true) {
      return 'text';
    }
    return 'password';
  });

  onSubmit(): void {
    console.log(this.registerForm.value);
  }
}
