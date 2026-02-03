import { Component, computed, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule],
  templateUrl: './login-page.component.html',
})
export class LoginPageComponent {
  show_password = signal(false);
  show_confirm_password = signal(false);
  private fb = inject(FormBuilder);

  loginForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
  })

  conditionalSwitchPassword = computed(() => {
    if (this.show_password() === true) {
      return 'text';
    }
    return 'password';
  });

  onSubmit():void {
    console.log(this.loginForm.value);
  }
}
