import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { IUserAuth } from '../Interfaces/IUserAuth';
import { LocationService } from './location.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  user = new BehaviorSubject<IUserAuth | null>(null);

  private tokenTimer?: ReturnType<typeof setInterval> | null;

  constructor(
    private http: HttpClient,
    private router: Router,
    private locationService: LocationService
  ) {}

  register(username: string, email: string, password: string) {
    const authData = { username: username, email: email, password: password };
    this.http
      .post<{
        jwt: string;
        expires: string;
        user: { id: number; email: string; password: string; username: string };
      }>(environment.apiUrl + 'users/signup', authData)
      .subscribe({
        next: (response) => {
          console.log(response);
          const token = response.jwt;
          const expires = response.expires;
          const userId = response.user.id;
          const userName = response.user.username;

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
            //TODO maybe take the method to the dashboard, so it retrieves the userLocation on refreshes
            this.locationService.getUsersLocation(userId, 'signup');
            this.router.navigate(['/map']);
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
      //TODO change userId and username to a user obj
      .post<{ jwt: string; expires: string; userId: number; username: string }>(
        environment.apiUrl + 'users/login',
        authData,
        { withCredentials: true }
      )
      .subscribe({
        next: (response) => {
          const token = response.jwt;
          const expirationDate = new Date(response.expires);
          const userId = response.userId;
          const userName = response.username;

          if (token && expirationDate && userId) {
            this.setAuthTimer(expirationDate);

            this.user.next({
              token: token,
              expirationDate: expirationDate,
              userId: userId,
              username: userName,
            });

            this.saveAuthData(token, expirationDate, userId, userName);
            this.locationService.getUsersLocation(userId, 'login');
            this.router.navigate(['/map']);
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
  }
  private setAuthTimer(expires: Date) {
    this.tokenTimer = setTimeout(() => {
      this.logout();
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
  private clearAuthData() {
    localStorage.removeItem('token');
    localStorage.removeItem('expiration');
    localStorage.removeItem('userId');
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

    return {
      token,
      expirationDate,
      userId,
      username,
    };
  }
}
