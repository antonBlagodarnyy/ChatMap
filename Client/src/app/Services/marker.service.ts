import { Injectable } from '@angular/core';
import Feature from 'ol/Feature';
import { Point } from 'ol/geom';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import Icon from 'ol/style/Icon';
import Style from 'ol/style/Style';
import { LocationService } from './location.service';
import { IUserLocation } from '../Interfaces/IUserLocation';
import { combineLatest, map, } from 'rxjs';
import { fromLonLat } from 'ol/proj';

@Injectable({
  providedIn: 'root',
})
export class MarkerService {
  constructor(private locationService: LocationService) {}

  userFeature(userLocation: IUserLocation, authLocation: boolean) {
    const userFeature = new Feature({
      geometry: new Point(
        fromLonLat([userLocation.longitude, userLocation.latitude])
      ),
      name: 'User',
      id: userLocation.id,
    });
    const userStyle = new Style({
      image: new Icon({
        src: authLocation ? 'location_on.svg' : 'person_pin_circle.svg',
      }),
    });
    userFeature.setStyle(userStyle);
    return userFeature;
  }

  usersMarkers$() {
    return combineLatest([
      this.locationService.getAllLocations$(),
      this.locationService.authUserLocation$(),
    ]).pipe(
      map(([allLocations, authLocation]) => {
        return allLocations
          .filter(
            (l) =>
              l.latitude != authLocation.latitude &&
              l.longitude != authLocation.longitude
          )
          .map((l) => this.userFeature(l, false));
      })
    );
  }
  authUserMarker$() {
    return this.locationService.authUserLocation$().pipe(
      map((l) => {
        return this.userFeature(l, true);
      })
    );
  }

  usersLayer$() {
    return this.usersMarkers$().pipe(
      map((markers) => {
        const vectorSource = new VectorSource({
          features: markers,
        });
        return new VectorLayer({ source: vectorSource });
      })
    );
  }
  authUserLayer$() {
    return this.authUserMarker$().pipe(
      map((marker) => {
        const vectorSource = new VectorSource({
          features: [marker],
        });
        return new VectorLayer({
          source: vectorSource,
          properties: { name: 'authUserLayer' },
        });
      })
    );
  }
}
