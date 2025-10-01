import { Component, OnInit } from '@angular/core';
import { HeaderComponent } from '../../Components/map/header/header.component';
import Map from 'ol/Map.js';
import View from 'ol/View.js';
import OSM from 'ol/source/OSM.js';
import TileLayer from 'ol/layer/Tile.js';
import { MatIconModule } from '@angular/material/icon';
import { MarkerService } from '../../Services/marker.service';
import { MatDialog } from '@angular/material/dialog';
import { UserInfoComponent } from '../../Components/map/user-info/user-info.component';

@Component({
  selector: 'app-map',
  imports: [HeaderComponent, MatIconModule],
  templateUrl: './map.component.html',
})
export class MapComponent implements OnInit {
  map?: Map;

  constructor(
    private markerService: MarkerService,
    private dialog: MatDialog
  ) {}

  async ngOnInit() {
    const vectorLayer = await this.markerService.generateVectorLayer();

    if (vectorLayer)
      this.map = new Map({
        layers: [new TileLayer({ source: new OSM({}) }), vectorLayer],
        view: new View({
          center: [0, 0],
          zoom: 2,
        }),
        target: 'map',
      });

    // change mouse cursor when over marker
    if (this.map)
      this.map.on('pointermove', (e) => {
        if (this.map) {
          const hit = this.map.hasFeatureAtPixel(e.pixel);
          this.map.getTargetElement().style.cursor = hit ? 'pointer' : '';
        }
      });

    // display popup on click
    if (this.map)
      this.map.on('click', (evt) => {
        if (this.map)
          var feature = this.map.forEachFeatureAtPixel(
            evt.pixel,
            function (feature) {
              return feature;
            }
          );

        if (!feature) {
          return;
        }

        this.dialog.open(UserInfoComponent, {
          data: { featureData: feature.getProperties() },
        });
      });
  }
}
