import { Component, OnInit } from '@angular/core';
import { HeaderComponent } from '../../Components/map/header/header.component';
import Map from 'ol/Map.js';
import View from 'ol/View.js';
import OSM from 'ol/source/OSM.js';
import TileLayer from 'ol/layer/Tile.js';

@Component({
  selector: 'app-map',
  imports: [HeaderComponent],
  templateUrl: './map.component.html'
})
export class MapComponent implements OnInit {
  map?: Map;

  constructor() {}

  ngOnInit(): void {
    this.map = new Map({
    
      layers: [new TileLayer({ source: new OSM({}) })],
      view: new View({
        center: [0, 0],
        zoom: 2,
      }),
      target: 'map',
    });
    console.log(this.map.getControls())
  }
}
