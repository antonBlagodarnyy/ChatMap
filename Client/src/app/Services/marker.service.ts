import { Injectable } from '@angular/core';
import Feature from 'ol/Feature';
import { Point } from 'ol/geom';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import Icon from 'ol/style/Icon';
import Style from 'ol/style/Style';
import { LocationService } from './location.service';
import { UserLocation } from '../Interfaces/UserLocation';
import { filter, map } from 'rxjs';
import { fromLonLat } from 'ol/proj';

@Injectable({
  providedIn: 'root',
})
export class MarkerService {
  constructor(private locationService: LocationService) {}

  //Casts a IUserLocation into a feature object
  userFeature(userLocation: UserLocation, authLocation: boolean) {
    const userFeature = new Feature({
      geometry: new Point(
        fromLonLat([userLocation.longitude, userLocation.latitude])
      ),
      name: 'User',
      id: userLocation.id,
      username: userLocation.username,
    });
    const userStyle = new Style({
      image: new Icon({
        src: authLocation ? 'location_on.svg' : 'person_pin_circle.svg',
      }),
    });
    userFeature.setStyle(userStyle);
    return userFeature;
  }

  //Converts the nearby locations in to features and  in to a vector layer
  usersLayer$(lat: number, lon: number, radius: number) {
    return this.locationService
      .getNearbyLocationsNotCurrent$(lat, lon, radius)
      .pipe(
        map((getNearbyLocationsRes) => {
          const features = getNearbyLocationsRes.locations.map((l) =>
            this.userFeature(l, false)
          );
          const vectorSource = new VectorSource({
            features: features,
          });
          return new VectorLayer({
            source: vectorSource,
            properties: { name: 'usersLayer' },
          });
        })
      );
  }

  //First map converts the authenticated location in to a feature and the second in to a vector layer
  authUserLayer$() {
    return this.locationService.currentUserLocation$().pipe(
      filter((res) => res !== null),
      map((res) => this.userFeature(res.location!, true)),
      map((feature) => {
        const vectorSource = new VectorSource({
          features: [feature],
        });
        return new VectorLayer({
          source: vectorSource,
          properties: { name: 'authUserLayer' },
        });
      })
    );
  }
}
