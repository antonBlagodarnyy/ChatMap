import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { UserLocation } from '../Interfaces/UserLocation';

import { from } from 'rxjs';

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
    return this.http.post<UserLocation>(
      environment.apiUrl + 'location/update',
      {
        latitude: lat,
        longitude: lon,
      }
    );
  }

  getNearbyLocationsNotCurrent$(lat: number, lon: number, radius: number) {
    const params = new HttpParams()
      .set('lat', lat.toString())
      .set('lon', lon.toString())
      .set('radius', radius.toString());

    return this.http.get<{ locations: UserLocation[] }>(
      `${environment.apiUrl}location/nearbyNotCurrent`,
      { params }
    );
  }
  getLocationById$(id: number) {
    return this.http.get<UserLocation>(
      environment.apiUrl + 'userslocations/byUser/' + id
    );
  }
  currentUserLocation$() {
    return this.http.get<{ location: UserLocation | null }>(
      environment.apiUrl + 'location/current'
    );
  }
}
