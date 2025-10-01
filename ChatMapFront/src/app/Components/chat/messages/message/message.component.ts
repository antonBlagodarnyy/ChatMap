import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-message',
  imports: [MatCardModule],
  template: `<mat-card>
    <mat-card-title>{{ sender }}</mat-card-title>
    <mat-card-content>{{ msg }}</mat-card-content>
  </mat-card>`,
})
export class MessageComponent {
  sender?: string;
  msg?: string;
}
