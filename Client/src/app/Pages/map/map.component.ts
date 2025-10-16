import { Component, OnInit } from '@angular/core';
import { HeaderComponent } from '../../Components/map/header/header.component';
import Map from 'ol/Map.js';
import { MatIconModule } from '@angular/material/icon';
import { MapService } from '../../Services/map.service';

@Component({
  selector: 'app-map',
  imports: [HeaderComponent, MatIconModule],
  templateUrl: './map.component.html',
})
export class MapComponent implements OnInit {
  map?: Map;

  constructor(private mapService: MapService) {}

  ngOnInit() {
    this.mapService.map$().subscribe((m) => {
      this.map = m;
    });
  }
}
