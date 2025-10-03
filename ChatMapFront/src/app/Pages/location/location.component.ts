import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../Services/auth.service';
import { LocationService } from '../../Services/location.service';
import { MatCard, MatCardModule } from '@angular/material/card';
import { MatButton } from '@angular/material/button';
import { Router } from '@angular/router';


@Component({
  selector: 'app-location',
  imports: [MatCard, MatCardModule, MatButton],
  template: `<div class="container">
    <mat-card
      ><mat-card-header>
        <mat-card-title>Hello there!</mat-card-title> </mat-card-header
      ><mat-card-content
        ><p>We need to access your location in order to continue to the map.</p>
        <p>
          Please accept the tracking in the top left corner of the screen and
          click continue.
        </p>
        <p>
          If you already blocked it you can reestablish it on the left side of
          the adress bar.
        </p></mat-card-content
      ><mat-card-actions
        ><button mat-button (click)="continue()">Continue</button>
        <button mat-button (click)="signout()">
          Signout
        </button></mat-card-actions
      ></mat-card
    >
  </div>`,
  styles: `.container{
    display:flex;
    justify-content:center;
  }
  mat-card{
    margin:5vh;
  }`,
})
export class LocationComponent implements OnInit {
  constructor(
    private authService: AuthService,
    private locationService: LocationService,
    private router: Router
  ) {}
  ngOnInit(): void {
    this.authService.autoAuthUser();
    const userId = this.authService.user.getValue()?.userId;
    if (userId) this.locationService.getUsersLocation(userId, 'signup');
  }
  continue() {
    this.router.navigate(['/map']);
  }
  signout() {
    this.authService.logout();
  }
}
