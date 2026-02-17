import { Injectable } from '@angular/core';
import { jwtDecode } from 'jwt-decode';

@Injectable({ providedIn: 'root' })
export class AuthService {

  getRole(): string | null {
    const token = sessionStorage.getItem('token');
    if (!token) return null;

    const decoded: any = jwtDecode(token);
    // console.log(`decoded.role?.toLowerCase()`, decoded.role?.toLowerCase())
    return decoded.role?.toLowerCase();
  }

  getRoleFromToken(token: string): string | null {
    const decoded: any = jwtDecode(token);
    return decoded.role?.toLowerCase();
  }

  isAdmin(): boolean {
    return this.getRole() === 'admin';
  }

  isUser(): boolean {
    return this.getRole() === 'user';
  }

  get user() {
    const token = sessionStorage.getItem('token');
    if (!token) return null;

    const decoded: any = jwtDecode(token);
    return {
      id: decoded.id?.toLowerCase(),
      username: decoded?.username?.toLowerCase(),
      role: decoded?.role.toLowerCase()
    };
  }

  get userName() {
    const token = sessionStorage.getItem('token');
    if (!token) return null;

    const decoded: any = jwtDecode(token);
    return decoded.username?.toLowerCase();
  }
}