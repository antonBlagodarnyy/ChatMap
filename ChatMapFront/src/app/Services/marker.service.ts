import { Injectable } from '@angular/core';
import Feature from 'ol/Feature';
import { Point } from 'ol/geom';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import Icon from 'ol/style/Icon';
import Style from 'ol/style/Style';
import { LocationService } from './location.service';
import { IUserLocation } from '../Interfaces/IUserLocation';
import { firstValueFrom } from 'rxjs';
import { fromLonLat } from 'ol/proj';

@Injectable({
  providedIn: 'root',
})
export class MarkerService {
  constructor(private locationService: LocationService) {}

  generateMarker(userLocation: IUserLocation) {
    const markerFeature = new Feature({
      geometry: new Point(fromLonLat([userLocation.longitude,userLocation.latitude ])),
      name: 'User',
      id: userLocation.id,
    });
    const markerStyle = new Style({
      image: new Icon({
        src: 'person_pin_circle.svg',
      }),
    });
    markerFeature.setStyle(markerStyle);
    return markerFeature;
  }
  async generateVectorLayer() {
    const markers: Feature[] = [];

    const usersLocations = await firstValueFrom(
      this.locationService.getAllLocations()
    );

    for (const e of usersLocations) {
      markers.push(this.generateMarker(e));
    }

    const vectorSource = new VectorSource({
      features: markers,
    });

    return new VectorLayer({ source: vectorSource });
  }
}
