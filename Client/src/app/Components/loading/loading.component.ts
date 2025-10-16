import { Component } from '@angular/core';
import { MatDialogContent, MatDialogTitle } from '@angular/material/dialog';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-loading',
  imports: [MatProgressSpinnerModule, MatDialogTitle, MatDialogContent],
  template: `<div class="container">
    <h1 mat-dialog-title>Connecting to server</h1>
    <h1 matDialogTitle>Please stand by</h1>
    <mat-dialog-content>
      <mat-spinner />
    </mat-dialog-content>
  </div>`,
  styles:`.container{
    display:flex;
    flex-direction:column;
    align-items:center;
  }`
})
export class LoadingComponent {}