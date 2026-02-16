import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({ providedIn: 'root' })
export class RoleGuard implements CanActivate {

  constructor(private auth: AuthService, private router: Router) {}

  canActivate(route: any): boolean {

    const expectedRole = route.paramMap.get('role');
    const actualRole = this.auth.getRole();

    if (!actualRole) {
      this.router.navigate(['/login']);
      return false;
    }

    if (expectedRole !== actualRole) {
      this.router.navigate(['/dashboard', actualRole]);
      return false;
    }

    return true;
  }
}