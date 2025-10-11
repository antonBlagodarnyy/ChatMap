import { Component, input, OnInit } from '@angular/core';
import { MatChipsModule } from '@angular/material/chips';
import { IMessage } from '../../../../Interfaces/IMessage';

@Component({
  selector: 'app-message',
  imports: [MatChipsModule],
  template: `<div class="container-messages-message">
    <mat-chip>{{ message().sender }}</mat-chip>
    <span class="text">{{ message().text }}</span>
  </div>`,
  styles: `
  .container-messages-message{
    margin:2vh;
    border-radius:1vh;
    display: flex;
    align-items: center;
      background-color:#EBEBEB;
  }
  .text{
    margin-left:2vh;
  }`,
})
export class MessageComponent implements OnInit{
 
  message = input.required<IMessage>();
   ngOnInit(): void {
  }
}
