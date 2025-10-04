import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../Services/auth.service';
import { LocationService } from '../../Services/location.service';
import { MatCard, MatCardModule } from '@angular/material/card';
import { MatButton } from '@angular/material/button';
import { Router } from '@angular/router';
import { from, switchMap } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { DialogSuccessComponent } from './dialog-success/dialog-success.component';
import { ErrorComponent } from '../../Components/error/error.component';

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
        ><button mat-button (click)="uploadLocation()">Upload location</button>
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
export class LocationComponent {
  constructor(
    private authService: AuthService,
    private locationService: LocationService,
    private dialogRef: MatDialog,
    private router: Router
  ) {}

  uploadLocation() {
    const userId = this.authService.user.getValue()?.userId;
    if (userId) {
      const askUserForLocation$ = from(
        this.locationService.askUserForLocation()
      );

      askUserForLocation$
        .pipe(
          switchMap((position) =>
            this.locationService.postUsersLocation$(
              userId,
              position.coords.latitude,
              position.coords.longitude
            )
          )
        )
        .subscribe({
          next: () => {
            this.dialogRef.open(DialogSuccessComponent, { disableClose: true });
          },
          error: () => {
            this.dialogRef.open(ErrorComponent, {
              data: { message: 'Something went wrong! Please try again.' },
            });
          },
        });
    }
  }

  signout() {
    this.authService.clearUser();
    this.router.navigate(['/']);
  }
}
