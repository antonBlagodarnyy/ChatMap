import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpEvent,
  HttpHandler,
  HttpRequest,
} from '@angular/common/http';
import { Observable, switchMap, take } from 'rxjs';
import { AuthService } from '../Services/auth.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private authService: AuthService) {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    return this.authService.user$.pipe(
      take(1), // Toma el último valor del observable y completa
      switchMap((user) => {
        const authToken = user?.token;

        if (authToken) {
          const authRequest = req.clone({
            setHeaders: {
              Authorization: `Bearer ${authToken}`,
            },
          });
          return next.handle(authRequest);
        } else {
          return next.handle(req);
        }
      })
    );
  }
}
