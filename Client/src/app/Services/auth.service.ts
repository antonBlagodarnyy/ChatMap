import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Router } from '@angular/router';
import { BehaviorSubject, tap } from 'rxjs';
import { UserAuth } from '../Interfaces/UserAuth';
import { jwtDecode } from 'jwt-decode';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private userSub$ = new BehaviorSubject<UserAuth | null>(this.getAuthData());
  user$ = this.userSub$.asObservable();
  private tokenTimer?: ReturnType<typeof setInterval> | null;

  constructor(private http: HttpClient, private router: Router) {}

  setUser(user: UserAuth) {
    this.userSub$.next(user);
  }
  getUser$() {
    return this.user$;
  }
  login$(email: string, password: string) {
    const authData = { email: email, password: password };
    return this.http
      .post<{
        jwt: string ,
       username: string ;
      }>(environment.apiUrl + 'auth/login', authData, )
      .pipe(
        tap((r) => {
          this.processUserData(r.jwt, r.username);
          this.router.navigate(['/map']);
        })
      );
  }

  signin$(username: string, email: string, password: string) {
    const authData = { username: username, email: email, password: password };
    console.log(authData);
    return this.http
      .post<{
        jwt: string;
        username: string;
      }>(environment.apiUrl + 'auth/signup', authData)
      .pipe(
        tap((r) => {
          this.processUserData(r.jwt, r.username);
          this.router.navigate(['/location']);
        })
      );
  }

  clearUser() {
    this.userSub$.next(null);
    this.clearAuthData();
  }

  private processUserData(token: string, username: string) {
    const authData = jwtDecode(token);

    if (authData.exp && authData.sub) {
      const expires = authData.exp * 1000;
      const userName = username;

      const expirationDate = new Date(expires);
      this.setAuthTimer(expirationDate);
      this.userSub$.next({
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
    localStorage.removeItem('username');
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

  private getAuthData(): UserAuth | null {
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
