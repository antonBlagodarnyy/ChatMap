import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { User } from '../Interfaces/User';
import { BehaviorSubject, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private users = new BehaviorSubject<User[]>([]);
  usersSubject$ = this.users.asObservable();

  constructor(private http: HttpClient) {}

  getUsers$() {
    return this.http
      .get<{ thumbnails: User[] }>(
        environment.apiUrl + 'user/getUsersThumbnails'
      )
      .pipe(tap((u) => this.users.next(u.thumbnails)));
  }
}
