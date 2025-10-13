import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Router } from '@angular/router';
import { BehaviorSubject, tap } from 'rxjs';
import { IUserAuth } from '../Interfaces/IUserAuth';
import { jwtDecode } from 'jwt-decode';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  user$ = new BehaviorSubject<IUserAuth | null>(this.getAuthData());

  private tokenTimer?: ReturnType<typeof setInterval> | null;

  constructor(private http: HttpClient, private router: Router) {}

  login$(email: string, password: string) {
    const authData = { email: email, password: password };
    return this.http
      .post<{
        auth: string;
        profile: { username: string };
      }>(environment.apiUrl + 'user/login', authData, {
        withCredentials: true,
      })
      .pipe(
        tap((r) => {
          console.log(r)
          const token = r.auth;

          this.processUserData(token, r.profile.username);
          this.router.navigate(['/map']);
        })
      );
  }

  signin$(username: string, email: string, password: string) {
    const authData = { username: username, email: email, password: password };
    return this.http
      .post<{
        auth: { jwt: string };
        profile: { username: string };
      }>(environment.apiUrl + 'user/create', authData)
      .pipe(
        tap((r) => {
          const token = r.auth.jwt;
          this.processUserData(token, r.profile.username);
          this.router.navigate(['/location']);
        })
      );
  }

  clearUser() {
    this.user$.next(null);
    this.clearAuthData();
  }
  private processUserData(token: string, username: string) {
    const authData = jwtDecode(token);

    if (authData.exp && authData.sub) {
      const expires = authData.exp;

      const userName = username;

      const expirationDate = new Date(expires);
      this.setAuthTimer(expirationDate);
      this.user$.next({
        token: token,
        expirationDate: expirationDate,
        username: userName,
      });

      this.saveAuthData(token, expirationDate, userName);
    }
  }

  private clearAuthData() {
    localStorage.removeItem('token');
    localStorage.removeItem('expiration');
  }
  private setAuthTimer(expires: Date) {
    this.tokenTimer = setTimeout(() => {
      this.clearUser();
    }, expires.getTime() - new Date().getTime());
  }
  private saveAuthData(token: string, expirationDate: Date, username: string) {
    localStorage.setItem('token', token);
    localStorage.setItem('expiration', expirationDate.toISOString());
    localStorage.setItem('username', username);
  }

  private getAuthData(): IUserAuth | null {
    const token = localStorage.getItem('token');
    const expirationDateRaw = localStorage.getItem('expiration');
    const username = localStorage.getItem('username');

    if (!token || !expirationDateRaw || !username) {
      return null;
    }
    const expirationDate = new Date(expirationDateRaw);

    this.setAuthTimer(expirationDate);

    return {
      token,
      expirationDate,
      username,
    };
  }
}
