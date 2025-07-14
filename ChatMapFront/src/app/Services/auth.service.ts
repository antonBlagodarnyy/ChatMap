import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = environment.apiUrl;
  constructor(private http: HttpClient) {}
  login(username: String, password: String) {
    this.http
      .post<{ jwt: string; expires: string; userId: number }>(
        this.apiUrl + 'users/login',
        {
          username: username,
          password: password,
        }
      )
      .subscribe((res) => {
        this.setToken(res.jwt, res.expires, res.userId)
        console.log(res)
      });
  }
  signup(userName: string, email: string, password: string) {
    this.http
      .post(this.apiUrl + 'users/signup', {
        username: userName,
        email: email,
        password: password,
      })
      .subscribe();
  }

  private setToken(jwt: string, expiresAtRaw: string, userId: number) {
    localStorage.setItem('token', jwt);
    localStorage.setItem('tokenExpiration', expiresAtRaw);
    localStorage.setItem('userId', '' + userId);
  }
}
