import {
  AfterViewChecked,
  Component,
  ElementRef,
  input,
  ViewChild,
} from '@angular/core';
import { MessageComponent } from './message/message.component';
import { NgFor } from '@angular/common';
import { IMessage } from '../../../Interfaces/IMessage';

@Component({
  selector: 'app-messages',
  imports: [NgFor, MessageComponent],
  template: ` <div class="container-messages" #containerMessages>
<h2>{{ recipientName() ? recipientName() : 'User unknown' }}</h2>

    <div *ngFor="let msg of messages()">
      <app-message [message]="msg"></app-message>
    </div>
  </div>`,
  styles: `.container-messages{
    border: 1px solid black;
    border-radius:5vh;
    padding:2vh;
    height: 60vh;
    overflow: auto;
  }
  /* Hide scrollbar for Chrome, Safari and Opera */
.container-messages::-webkit-scrollbar {
  display: none;
}

/* Hide scrollbar for IE, Edge and Firefox */
.container-messages {
  -ms-overflow-style: none;  /* IE and Edge */
  scrollbar-width: none;  /* Firefox */
}`,
})
export class MessagesComponent implements AfterViewChecked {
  @ViewChild('containerMessages')
  chatContainer!: ElementRef;

  messages = input<IMessage[] | undefined>();
  recipientName= input<string>();

  ngAfterViewChecked(): void {
    this.chatContainer.nativeElement.scrollTop =
      this.chatContainer.nativeElement.scrollHeight;
  }
}
