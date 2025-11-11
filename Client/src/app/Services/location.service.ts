import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { IUserLocation } from '../Interfaces/IUserLocation';
import { AuthService } from './auth.service';
import { EMPTY, from } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LocationService {
  constructor(private http: HttpClient) {}

  async checkPermission() {
    const permissonStatus = await navigator.permissions.query({
      name: 'geolocation',
    });
    return permissonStatus.state == 'granted';
  }

  askUserForLocation$() {
    return from(
      new Promise<GeolocationPosition>((res, rej) => {
        navigator.geolocation.getCurrentPosition(res, rej);
      })
    );
  }

  postUsersLocation$(lat: number, lon: number) {
    return this.http.post<IUserLocation>(
      environment.apiUrl + 'location/create',
      {
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

  getNearbyLocationsNotCurrent$(lat: number, lon: number, radius: number) {
    return this.http.get<{ locations: IUserLocation[] }>(
      `${environment.apiUrl}location/nearbyNotCurrent/${lat}/${lon}/${radius}`
    );
  }
  getLocationById$(id: number) {
    return this.http.get<IUserLocation>(
      environment.apiUrl + 'userslocations/byUser/' + id
    );
  }
  currentUserLocation$() {
    return this.http.get<{ location: IUserLocation }>(
      environment.apiUrl + 'location/current'
    );
  }
}
