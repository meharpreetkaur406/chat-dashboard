// src/app/services/auth.interceptor.ts
//An HTTP interceptor is a special Angular service that can intercept every HTTP request or response your app makes using HttpClient.
import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpErrorResponse } from '@angular/common/http';
import { UserLoginService } from './user-login.service';
import { Router } from '@angular/router'
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private userLoginService: UserLoginService, private router: Router) {}

  intercept(req: HttpRequest<any>, next: HttpHandler) {
    const token = this.userLoginService.getToken();
    let authReq = req;
    if (token) {
      authReq = req.clone({
       setHeaders: {
          Authorization: `Bearer ${token}`
        }
      });
    }
    return next.handle(authReq).pipe(
      catchError((error: HttpErrorResponse) => {

        // TOKEN EXPIRED OR INVALID
        if (error.status === 401) {
            console.log("token got expired")
          sessionStorage.removeItem('token');
          alert('Session expired. Please login again.');
          this.router.navigate(['/login']);
        }

        return throwError(() => error);
      })
    );
  }
}
