import { HttpClient } from '@angular/common/http';
import { afterNextRender, Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Router } from '@angular/router';
import { BehaviorSubject, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  user = new BehaviorSubject<{
    token: string;
    expirationDate: Date;
    userId: number;
  } | null>(null);

  private tokenTimer?: ReturnType<typeof setInterval> | null;

  constructor(private http: HttpClient, private router: Router) {}

  register(username: string, email: string, password: string) {
    const authData = { username: username, email: email, password: password };
    this.http
      .post<{ token: string; expiresIn: string; userId: number }>(
        environment.apiUrl + 'users/signup',
        authData
      )
      .subscribe({
        next: (response) => {
          const token = response.token;
          const expires = response.expiresIn;
          const userId = response.userId;

          if (token && expires && userId) {
           
            const expirationDate = new Date(expires);
             this.setAuthTimer(expirationDate);
            this.user.next({
              token: token,
              expirationDate: expirationDate,
              userId: userId,
            });

            this.saveAuthData(token, expirationDate, userId);

            this.router.navigate(['/dashboard']);
          }
        },
        error: (err) => {
          console.log(err);
        },
      });
  }
  login(username: string, password: string) {
    const authData = { username: username, password: password };
    this.http
      .post<{ jwt: string; expires: string; userId: number }>(
        environment.apiUrl + 'users/login',
        authData,
        { withCredentials: true }
      )
      .subscribe({
        next: (response) => {
          console.log(response);
          const token = response.jwt;
          const expirationDate = new Date(response.expires);

          const userId = response.userId;

          if (token && expirationDate && userId) {
            this.setAuthTimer(expirationDate);

            this.user.next({
              token: token,
              expirationDate: expirationDate,
              userId: userId,
            });
            
            this.saveAuthData(token, expirationDate, userId);
            this.router.navigate(['dashboard']);
          }
        },
        error: (err) => {
          return err;
        },
      });
  }
  autoAuthUser() {
    const authInformation = this.getAuthData();
    if (!authInformation) {
      this.user.next(null);
      return;
    }
    const expirationDate = authInformation.expirationDate;
    if (expirationDate > new Date()) {
      this.user.next(authInformation);
      this.setAuthTimer(expirationDate);
    }
  }
  logout() {
    this.user.next(null);
    this.clearAuthData();
    this.router.navigate(['/']);
    console.log("Logging out")
  }
  private setAuthTimer(expires: Date) {

    this.tokenTimer = setTimeout(() => {
      this.logout();
    }, expires.getTime() - new Date().getTime());
  }
  private saveAuthData(token: string, expirationDate: Date, userId: number) {
    localStorage.setItem('token', token);
    localStorage.setItem('expiration', expirationDate.toISOString());
    localStorage.setItem('userId', JSON.stringify(userId));
  }
  private clearAuthData() {
    localStorage.removeItem('token');
    localStorage.removeItem('expiration');
    localStorage.removeItem('userId');
  }
  private getAuthData(): {
    token: string;
    expirationDate: Date;
    userId: number;
  } | null {
    const token = localStorage.getItem('token');
    const expirationDateRaw = localStorage.getItem('expiration');
    const userIdRaw = localStorage.getItem('userId');

    if (!token || !expirationDateRaw || !userIdRaw) {
      return null;
    }
    const userId = JSON.parse(userIdRaw);
    const expirationDate = new Date(expirationDateRaw);

    return {
      token,
      expirationDate,
      userId,
    };
  }
}
