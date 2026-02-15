import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { UserLoginService } from '../services/user-login.service';
import { Router } from '@angular/router';
import { UserSessionService } from '../services/user-session.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {

  constructor(
    private router: Router,
    private userLoginService: UserLoginService,
    private userSessionService: UserSessionService
  ) {}

  hidePassword = signal(true);

  loginForm = new FormGroup({
    username: new FormControl('', [
      Validators.required
    ]),
    password: new FormControl('', Validators.required)
  });

  togglePassword(event: MouseEvent) {
    this.hidePassword.set(!this.hidePassword());
    event.stopPropagation();
  }

  onSubmit() {
    console.log("on login button click function called")
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    const formData = this.loginForm.getRawValue();
    console.log("Login data:", formData);

    // 🔥 Later call login API here
    const newFormData = {
        "Username": formData.username,
        "Password": formData.password
    }

    this.userLoginService.register(newFormData).subscribe({
      next: (response:any) => {
        console.log('Success:', response);
        const user = response;
        console.log("user on login page: ", user)
        this.userSessionService.setUser(user);

        this.router.navigate(['/dashboard']);
      },
      error: (error:any) => {
        console.error('Error:', error);
      }
    });

    // Example navigation after success
    // this.router.navigate(['/dashboard']);
  }

  goToRegister() {
    this.router.navigate(['/register']);
  }
}