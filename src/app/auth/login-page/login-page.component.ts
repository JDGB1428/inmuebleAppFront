import { Component, computed, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { LoginFormComponent } from "../component/login-form/login-form.component";

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, LoginFormComponent],
  templateUrl: './login-page.component.html',
})
export class LoginPageComponent {

}
