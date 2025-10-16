import { Injectable } from '@angular/core';
import Feature from 'ol/Feature';
import { Point } from 'ol/geom';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import Icon from 'ol/style/Icon';
import Style from 'ol/style/Style';
import { LocationService } from './location.service';
import { IUserLocation } from '../Interfaces/IUserLocation';
import { map } from 'rxjs';
import { fromLonLat } from 'ol/proj';

@Injectable({
  providedIn: 'root',
})
export class MarkerService {
  constructor(private locationService: LocationService) {}

  //Casts a IUserLocation into a feature object
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

//First map converts the nearby locations in to features and the second in to a vector layer
  usersLayer$() {
    return this.locationService.getNearbyLocationsNotCurrent$().pipe(
      map((getNearbyLocationsRes) => {
        return getNearbyLocationsRes.locations.map((l) => {
          return this.userFeature(l, false);
        });
      }),
      map((features) => {
        const vectorSource = new VectorSource({
          features: features,
        });
        return new VectorLayer({ source: vectorSource });
      })
    );
  }

  //First map converts the authenticated location in to a feature and the second in to a vector layer
  authUserLayer$() {
    return this.locationService.currentUserLocation$().pipe(
      map((currentUserLocationRes) => {
        return this.userFeature(currentUserLocationRes.location, true);
       
      }),
      map((features)=>{
         const vectorSource = new VectorSource({
          features: [features],
        });
        return new VectorLayer({
          source: vectorSource,
          properties: { name: 'authUserLayer' },
        });})
      
    );
  }
}
