import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Component, inject, signal } from '@angular/core';
import { Router, RouterLink } from "@angular/router";
import { AuthService } from '@auth/services/auth.service';
import { rxResource } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-login-page',
  imports: [RouterLink, ReactiveFormsModule],
  templateUrl: './loginPage.html',
})
export class LoginPage {

  fb = inject(FormBuilder);
  hasError = signal(false);
  isPosting = signal(false);
  router = inject(Router);

  authService = inject(AuthService);

  checkStatusResource = rxResource({
    stream: () => this.authService.checkStatus()
  })

  loginForm: FormGroup = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]]
  });

  onSubmit() {
    if (this.loginForm.invalid) {
      this.hasError.set(true);
      setTimeout(() => {
        this.hasError.set(false);
      }, 2000);
      return
    }
    const { email = '', password = '' } = this.loginForm.value;
    this.authService.login(email, password).subscribe(isAtuhenticated => {
      if (isAtuhenticated) {
        this.router.navigateByUrl('/');
        return;
      } else {
        this.hasError.set(true);
        setTimeout(() => {
          this.hasError.set(false);
        }, 2000);
      }
    });

  }



}
