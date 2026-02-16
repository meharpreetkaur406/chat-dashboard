import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { UserLoginService } from '../../services/user-login.service';
import { Router } from '@angular/router';
import { RouterOutlet } from '@angular/router';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatSidenavModule} from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { UserSessionService } from '../../services/user-session.service';



@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule, RouterOutlet, MatToolbarModule, MatSidenavModule, MatListModule
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {
    username = localStorage.getItem('username');

    constructor(
      private router: Router,
      private userSessionService: UserSessionService
    ) {}

    user: any;

    ngOnInit() {
      this.user = this.userSessionService.getUser();
      console.log("Logged in user on dashboard:", this.user);
    }

    logout() {
        sessionStorage.clear();
        this.router.navigate(['/login']);
    }
}