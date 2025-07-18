import { Component, OnInit, ViewContainerRef } from '@angular/core';

import { MatButtonModule } from '@angular/material/button';
import { MapLoaderService } from '../../Services/map-loader.service';
import { GoogleMapsModule, MapAdvancedMarker } from '@angular/google-maps';
import { NgFor, NgIf } from '@angular/common';
import { HeaderComponent } from '../../Components/dashboard/header/header.component';
import { LocationService } from '../../Services/location.service';
import { BehaviorSubject, Subject } from 'rxjs';
import { IMarker } from '../../Interfaces/IMarker';

import { IUserLocation } from '../../Interfaces/IUserLocation';
import { MatIconModule } from '@angular/material/icon';
import { MarkerComponent } from '../../Components/dashboard/marker/marker.component';

import {  Router } from '@angular/router';

import { UserService } from '../../Services/user.service';

@Component({
  selector: 'app-dashboard',
  imports: [
    MatButtonModule,
    GoogleMapsModule,
    NgIf,
    NgFor,
    HeaderComponent,
    MapAdvancedMarker,
    MatIconModule,
  ],
  templateUrl: './dashboard.component.html',
  styles: `
  .highlighted {
    color:green;
    z-index: 1000;
    filter: drop-shadow(0 0 8px rgba(0,0,0,0.5));
  }`,
})
export class DashboardComponent implements OnInit {
  mapReady = false;

  center = { lat: 40.7128, lng: -74.006 }; // Example: New York
  zoom = 12;

  mapOptions: google.maps.MapOptions = {
    streetViewControl: false,
    fullscreenControl: false, // Optional: also hides fullscreen
    mapTypeControl: false, // Optional: hides map type selector
  };

  locations = new Subject<IUserLocation[]>();

  markers: IMarker[] = [];

  constructor(
    private vcRef: ViewContainerRef,
    private mapLoader: MapLoaderService,
    private locationService: LocationService,
    private userService: UserService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.mapLoader.load().then(() => {
      this.mapReady = true;
    });

    this.locations.subscribe((locations) => {
      const markers: IMarker[] = [];

      locations.forEach((loc) => {
        const markerLabel = this.vcRef.createComponent(MarkerComponent);

        markerLabel.instance.markerId = loc.id;

        markers.push({
          markerId: loc.id,
          position: { lat: loc.latitude, lng: loc.longitude },
          label: '' + loc.id,
          content: markerLabel.location.nativeElement,
        });
      });

      this.markers = markers;
    });

    this.locationService.getAllLocations().subscribe((res) => {
      this.locations.next(res);
    });
  }
  markerClicked(m: IMarker) {
    this.userService.getUserById(m.markerId).subscribe((user) => {
      this.router.navigate(['chat/:' + user.username]);
    });
  }
}
