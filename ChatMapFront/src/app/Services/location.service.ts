import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { IUserLocation } from '../Interfaces/IUserLocation';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LocationService {
  constructor(private http: HttpClient) {}

  getUsersLocation(userId: number, mode: 'login' | 'signup') {
    if (userId)
      navigator.geolocation.getCurrentPosition((position) => {
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;
        if (mode == 'signup')
          this.postUsersLocation(userId, latitude, longitude);
        else if (mode == 'login')
          this.putUsersLocation(userId, latitude, longitude);
      });
  }

  postUsersLocation(userId: number, lat: number, lon: number) {
    this.http
      .post<IUserLocation>(environment.apiUrl + 'userslocations/post', {
        id: userId,
        latitude: lat,
        longitude: lon,
      })
      .subscribe();
  }

  putUsersLocation(userId: number, lat: number, lon: number) {
    this.http.put<IUserLocation>(environment.apiUrl + 'userslocations/put', {
      id: userId,
      latitude: lat,
      longitude: lon,
    }).subscribe();
  }

  getAllLocations() {
    return this.http.get<IUserLocation[]>(
      environment.apiUrl + 'userslocations/getAll'
    );
  }
}
