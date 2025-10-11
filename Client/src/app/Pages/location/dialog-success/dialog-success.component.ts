import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dialog-success',
  imports: [MatDialogModule, MatButtonModule],
  template: `<h1 mat-dialog-title>Location received!</h1>

    <mat-dialog-actions>
      <button mat-button (click)="continue()">
        Continue to map
      </button></mat-dialog-actions
    >`,
})
export class DialogSuccessComponent {
  constructor(
    private router: Router,
    private dialogRef: MatDialogRef<DialogSuccessComponent>
  ) {}
  continue() {
    this.dialogRef.close();
    this.router.navigate(['/map']);
  }
}
