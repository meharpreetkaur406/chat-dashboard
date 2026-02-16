// src/app/services/auth.interceptor.ts
//An HTTP interceptor is a special Angular service that can intercept every HTTP request or response your app makes using HttpClient.
import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler } from '@angular/common/http';
import { UserLoginService } from './user-login.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private userLoginService: UserLoginService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler) {
    const token = this.userLoginService.getToken();
    if (token) {
      const cloned = req.clone({
        headers: req.headers.set('Authorization', 'Bearer ' + token)
      });
      return next.handle(cloned);
    }
    return next.handle(req);
  }
}
