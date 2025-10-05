import { Injectable } from '@angular/core';
import { MarkerService } from './marker.service';
import TileLayer from 'ol/layer/Tile';
import { combineLatest, map } from 'rxjs';
import OSM from 'ol/source/OSM';
import View from 'ol/View';
import Map from 'ol/Map';
import { MatDialog } from '@angular/material/dialog';
import { UserInfoComponent } from '../Components/map/user-info/user-info.component';
import { LocationService } from './location.service';
import { fromLonLat } from 'ol/proj';
import Layer from 'ol/layer/Layer';
import XYZ from 'ol/source/XYZ';

@Injectable({
  providedIn: 'root',
})
export class MapService {
  constructor(
    private markerService: MarkerService,
    private locationService: LocationService,
    private dialogRef: MatDialog
  ) {}

  map$() {
    return combineLatest([
      this.markerService.usersLayer$(),
      this.markerService.authUserLayer$(),
      this.locationService.authUserLocation$(),
    ]).pipe(
      map(([ul, al, aLocation]) => {
        const map = new Map({
          layers: [
            new TileLayer({
              source: new XYZ({
                url: 'https://cartodb-basemaps-{a-d}.global.ssl.fastly.net/rastertiles/voyager/{z}/{x}/{y}.png',
    attributions: '© OpenStreetMap contributors © CARTO',
              }),
            }),
            ul,
            al,
          ],
          view: new View({
            center: fromLonLat([aLocation.longitude, aLocation.latitude]),
            zoom: 15,
          }),
          target: 'map',
        });

        // change mouse cursor when over marker
        map.on('pointermove', (e) => {
          const hit = map.hasFeatureAtPixel(e.pixel, {
            layerFilter: this.layerFilter,
          });
          map.getTargetElement().style.cursor = hit ? 'pointer' : '';
        });

        // display popup on click
        map.on('click', (evt) => {
          var feature = map.forEachFeatureAtPixel(
            evt.pixel,
            function (feature) {
              return feature;
            },
            {
              layerFilter: this.layerFilter,
            }
          );

          if (!feature) {
            return;
          }

          this.dialogRef.open(UserInfoComponent, {
            data: { featureData: feature.getProperties() },
          });
        });

        return map;
      })
    );
  }
  private layerFilter = (l: Layer) => {
    return l.get('name') != 'authUserLayer';
  };
}
