import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';

@Component({
  standalone: true,
  template: `
    <h1 mat-dialog-title>An error occurred</h1>
    <mat-dialog-content>
      <p class="mat-body-1">{{ data.message }}</p>
    </mat-dialog-content>
    <mat-dialog-actions>
      <button mat-button mat-dialog-close>Okay</button>
    </mat-dialog-actions>
  `,

  imports: [MatDialogModule, MatButtonModule, CommonModule],
})
export class ErrorComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public data: { message: string }) {}
}
