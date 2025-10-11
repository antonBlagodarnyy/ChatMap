import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { IUser } from '../Interfaces/IUser';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(private http: HttpClient) {}

  getUserById$(id: number) {
    return this.http.get<IUser>(environment.apiUrl+'users/' + id);
  }
}
