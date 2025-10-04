import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Router } from '@angular/router';
import { BehaviorSubject, tap } from 'rxjs';
import { IUserAuth } from '../Interfaces/IUserAuth';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  user = new BehaviorSubject<IUserAuth | null>(this.getAuthData());

  private tokenTimer?: ReturnType<typeof setInterval> | null;

  constructor(private http: HttpClient, private router: Router) {}

  login$(username: string, password: string) {
    const authData = { username: username, password: password };
    return this.http
      .post<{
        jwt: string;
        expires: string;
        userId: number;
        username: string;
      }>(environment.apiUrl + 'users/login', authData, {
        withCredentials: true,
      })
      .pipe(
        tap((r) => {
          const token = r.jwt;
          const expirationDate = new Date(r.expires);
          const userId = r.userId;
          const userName = r.username;

          if (token && expirationDate && userId) {
            this.setAuthTimer(expirationDate);

            this.user.next({
              token: token,
              expirationDate: expirationDate,
              userId: userId,
              username: userName,
            });

            this.saveAuthData(token, expirationDate, userId, userName);
          }
        })
      );
  }

  signin$(username: string, email: string, password: string) {
    const authData = { username: username, email: email, password: password };
    return this.http
      .post<{
        jwt: string;
        expires: string;
        userId: number;
        username: string;
      }>(environment.apiUrl + 'users/signup', authData)
      .pipe(
        tap((r) => {
          const token = r.jwt;
          const expires = r.expires;
          const userId = r.userId;
          const userName = r.username;

          if (token && expires && userId) {
            const expirationDate = new Date(expires);
            this.setAuthTimer(expirationDate);
            this.user.next({
              token: token,
              expirationDate: expirationDate,
              userId: userId,
              username: userName,
            });

            this.saveAuthData(token, expirationDate, userId, userName);

            this.router.navigate(['/location']);
          }
        })
      );
  }

  clearUser() {
    this.user.next(null);
    this.clearAuthData();
  }
  private clearAuthData() {
    localStorage.removeItem('token');
    localStorage.removeItem('expiration');
    localStorage.removeItem('userId');
  }
  private setAuthTimer(expires: Date) {
    this.tokenTimer = setTimeout(() => {
      this.clearUser();
    }, expires.getTime() - new Date().getTime());
  }
  private saveAuthData(
    token: string,
    expirationDate: Date,
    userId: number,
    username: string
  ) {
    localStorage.setItem('token', token);
    localStorage.setItem('expiration', expirationDate.toISOString());
    localStorage.setItem('userId', JSON.stringify(userId));
    localStorage.setItem('username', username);
  }

  private getAuthData(): IUserAuth | null {
    const token = localStorage.getItem('token');
    const expirationDateRaw = localStorage.getItem('expiration');
    const userIdRaw = localStorage.getItem('userId');
    const username = localStorage.getItem('username');

    if (!token || !expirationDateRaw || !userIdRaw || !username) {
      return null;
    }
    const userId = JSON.parse(userIdRaw);
    const expirationDate = new Date(expirationDateRaw);

    this.setAuthTimer(expirationDate);

    return {
      token,
      expirationDate,
      userId,
      username,
    };
  }
}
