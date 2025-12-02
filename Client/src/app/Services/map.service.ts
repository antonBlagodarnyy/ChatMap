import { Injectable } from '@angular/core';
import { MarkerService } from './marker.service';
import TileLayer from 'ol/layer/Tile';
import { combineLatest, fromEventPattern, map, switchMap } from 'rxjs';
import View from 'ol/View';
import Map from 'ol/Map';
import { MatDialog } from '@angular/material/dialog';
import { UserInfoComponent } from '../Components/user-info/user-info.component';
import { LocationService } from './location.service';
import { fromLonLat, toLonLat } from 'ol/proj';
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
    //Combines the values from the current user layer and location 
    return combineLatest([
      this.markerService.authUserLayer$(),
      this.locationService.currentUserLocation$(),
    ]).pipe(
      map(([al, aLocation]) => {
        //Creates the map
        const map = new Map({
          layers: [
            new TileLayer({
              source: new XYZ({
                url: 'https://cartodb-basemaps-{a-d}.global.ssl.fastly.net/rastertiles/voyager/{z}/{x}/{y}.png',
                attributions: '© OpenStreetMap contributors © CARTO',
              }),
            }),
            al,
          ],
          view: new View({
            center: fromLonLat([
              aLocation.location.longitude,
              aLocation.location.latitude,
            ]),
            zoom: 15,
          }),
          target: 'map',
        });

        //Adds an event to change mouse cursor when over marker
        map.on('pointermove', (e) => {
          const hit = map.hasFeatureAtPixel(e.pixel, {
            layerFilter: this.layerFilter,
          });
          map.getTargetElement().style.cursor = hit ? 'pointer' : '';
        });

        //Adds an event to open the users dialog
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

        //Creates an observable from an event that emits everytime the emit is triggered
        fromEventPattern(
          (handler) => map.on('moveend', handler),
          (handler) => map.un('moveend', handler)
        )
          .pipe(
            switchMap(() => {
              const radius = this.getRadius(map);
              const [lon, lat] = toLonLat(map.getView().getCenter()!);
              return this.markerService.usersLayer$(lat, lon, radius);
            })
          )
          .subscribe((ul) => {
            
            // Remove old user layers, then add new one
            map.getLayers().forEach((l) => {
              if (l.get('name') === 'usersLayer') map.removeLayer(l);
            });
            map.addLayer(ul);
          });

        return map;
      })
    );
  }
  private layerFilter = (l: Layer) => {
    return l.get('name') != 'authUserLayer';
  };
  private getRadius(map: Map): number {
    const view = map.getView();
    const extent = view.calculateExtent(map.getSize());
    const bottomLeft = toLonLat([extent[0], extent[1]]);
    const topRight = toLonLat([extent[2], extent[3]]);
    const R = 6371000; // Earth's radius in meters

    const toRad = (deg: number) => (deg * Math.PI) / 180;

    const dLat = toRad(topRight[1] - bottomLeft[1]);
    const dLon = toRad(topRight[0] - bottomLeft[0]);
    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos(toRad(bottomLeft[1])) *
        Math.cos(toRad(topRight[1])) *
        Math.sin(dLon / 2) ** 2;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;

    // Return half the diagonal of the visible area as radius
    return distance / 2;
  }
}
