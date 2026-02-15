import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FormGroup, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import {MatSelectModule} from '@angular/material/select';
import { UserRegisterService } from '../services/user-register.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  imports: [
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule, MatButtonModule, MatIconModule, MatSelectModule
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RegisterComponent {
  protected readonly title = signal('chat-dashboard');

  constructor(
    private userRegisterService: UserRegisterService,
    private router: Router
  ) {}

  hidePassword = signal(true);
  hideConfirmPassword = signal(true);

  clickEvent(event: MouseEvent) {
    this.hidePassword.set(!this.hidePassword());
    event.stopPropagation();

    this.hideConfirmPassword.set(!this.hideConfirmPassword());
    event.stopPropagation();
  }

  registerForm = new FormGroup({
    firstName: new FormControl('', [
      Validators.required,
      Validators.minLength(2)
    ]),
    lastName: new FormControl('', [
      Validators.required,
      Validators.minLength(2)
    ]),
    email: new FormControl('', [
      Validators.required,
      Validators.email
    ]),
    password: new FormControl('', Validators.required),
    confirmPassword: new FormControl('', Validators.required),
    role: new FormControl('', Validators.required)
  });

  
  onSubmit() {
    console.log("on submit function is called")
    Object.keys(this.registerForm.controls).forEach(key => {
      const control = this.registerForm.get(key);
      console.log(key, control?.valid, control?.errors);
    });
    if (this.registerForm.invalid) {
      console.log("true")
      return;
    }

    const formData = this.registerForm.value;
    console.log("formData: ", formData);

    const newFormData = {
      "Type": "user",
      "FirstName": formData.firstName,
      "LastName": formData.lastName,
      "Email": formData.email,
      "Password": formData.password,
      "Role": "user"
    }

    this.userRegisterService.register(newFormData).subscribe({
      next: (response:any) => {
        console.log('Success:', response);
        this.router.navigate(['/login']);
      },
      error: (error:any) => {
        console.error('Error:', error);
      }
    });
  }

  goToLogin() {
    this.router.navigate(['/login']);
  }
}
