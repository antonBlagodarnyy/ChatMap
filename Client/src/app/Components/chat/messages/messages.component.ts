import {
  AfterViewChecked,
  Component,
  ElementRef,
  input,
  ViewChild,
} from '@angular/core';
import { IMessage } from '../../../Interfaces/IMessage';
import { MatChipsModule } from '@angular/material/chips';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-messages',
  imports: [MatChipsModule, NgClass],
  template: ` <!--Header for the chat-->
    <h2>
      Chat opened with: {{ recipientName() ? recipientName() : 'User unknown' }}
    </h2>
    <div class="container-messages" #containerMessages>
      @for (msg of messages(); track $index) {

      <!--Message-->
      <div
        class="container-messages-message"
        [ngClass]="
          recipientName() == msg.sender
            ? 'container-messages-message-received'
            : 'container-messages-message-sent'
        "
      >
        <div class="container-messages-message-content">
          @if (msg.sender == recipientName()) {
          <mat-chip>{{ msg.sender }}</mat-chip>
          }
          <span class="text">{{ msg.text }}</span>
       
        </div>
        <span class="date">{{ msg.ts }}</span>
      </div>

      }
    </div>`,

  styles: `
  /* Hide scrollbar for Chrome, Safari and Opera */
  .container-messages::-webkit-scrollbar {
    display: none;
  }

  /* Hide scrollbar for IE, Edge and Firefox */
  .container-messages {
    -ms-overflow-style: none;  /* IE and Edge */
    scrollbar-width: none;  /* Firefox */
  }

  .container-messages{
    border: 1px solid black;
    border-radius:5vh;
    padding:1vh;
    height: 60vh;
    overflow: auto;
  }
  .container-messages-message{
    margin:2vh;

    display: flex;
    align-items: center;
  }
  .container-messages-message-sent{
    justify-content: flex-end;
  }
  .container-messages-message-content{
    border-radius:1vh;
  }
  .container-messages-message-received .container-messages-message-content{
    background-color: #E0E0E0;
  }
  .container-messages-message-sent .container-messages-message-content{
    padding: 1vh;
    background-color: #BBFFAD;
  }
  .text{
    margin-left:2vh;
    margin-right:2vh;
  }
  .date{
    margin: 1vh;
    color: #C4C4C4;
  }
  `,
})
export class MessagesComponent implements AfterViewChecked {
  @ViewChild('containerMessages')
  chatContainer!: ElementRef;

  messages = input<IMessage[] | undefined>();
  recipientName = input<string>();

  ngAfterViewChecked(): void {
    this.chatContainer.nativeElement.scrollTop =
      this.chatContainer.nativeElement.scrollHeight;
  }
}
