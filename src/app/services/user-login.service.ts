import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class UserLoginService {

  private apiUrl = 'http://localhost:5144/api/auth';

  constructor(private http: HttpClient, private router: Router) {}

  login(data: any) {
    return this.http.post<{ token: string }>(`${this.apiUrl}/login`, data);
  }

  logout() {
    sessionStorage.removeItem('token'); // remove JWT
    this.router.navigate(['/login']);
  }

  getToken(): string | null {
    return sessionStorage.getItem('token');
  }
}