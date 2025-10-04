import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { IUserLocation } from '../Interfaces/IUserLocation';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class LocationService {
  constructor(private http: HttpClient, private authService: AuthService) {}

  async checkPermission() {
    const permissonStatus = await navigator.permissions.query({
      name: 'geolocation',
    });
    return permissonStatus.state == 'granted';
  }

  askUserForLocation() {
    return new Promise<GeolocationPosition>((res, rej) => {
      navigator.geolocation.getCurrentPosition(res, rej);
    });
  }

  postUsersLocation$(userId: number, lat: number, lon: number) {
    return this.http.post<IUserLocation>(
      environment.apiUrl + 'userslocations/post',
      {
        id: userId,
        latitude: lat,
        longitude: lon,
      }
    );
  }

  putUsersLocation$(userId: number, lat: number, lon: number) {
    return this.http.put<IUserLocation>(
      environment.apiUrl + 'userslocations/put',
      {
        id: userId,
        latitude: lat,
        longitude: lon,
      }
    );
  }

  getAllLocations$() {
    return this.http.get<IUserLocation[]>(
      environment.apiUrl + 'userslocations/getAll'
    );
  }
  getLocationById$(id: number) {
    return this.http.get<IUserLocation>(
      environment.apiUrl + 'userslocations/byUser/' + id
    );
  }
}
