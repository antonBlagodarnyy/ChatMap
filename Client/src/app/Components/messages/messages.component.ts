import {
  AfterViewChecked,
  Component,
  ElementRef,
  input,
  ViewChild,
} from '@angular/core';
import { SavedMessage } from '../../Interfaces/SavedMessage';
import { MatChipsModule } from '@angular/material/chips';
import { DatePipe, NgClass } from '@angular/common';
import { Signal } from '@angular/core';

@Component({
  selector: 'app-messages',
  imports: [MatChipsModule, NgClass, DatePipe],
  template: `<!--Header for the chat-->
    <h2>Chat opened with: {{ recipient()()?.username ?? 'User unknown' }}</h2>
    <div class="container-messages" #containerMessages>
      @for (msg of messages()(); track $index) {

      <!--Message-->
      <div
        class="container-messages-message"
        [ngClass]="
          !msg.message.isSentByCurrentUser
            ? 'container-messages-message-received'
            : 'container-messages-message-sent'
        "
      >
        <div class="container-messages-message-content">
          <span class="text">{{ msg.message.text }}</span>
          <span class="date">{{ msg.message.ts | date : 'medium' }}</span>
        </div>
      </div>

      }
    </div>`,
  styleUrl: './messages.styles.css',
})
export class MessagesComponent implements AfterViewChecked {
  
  @ViewChild('containerMessages')
  chatContainer!: ElementRef;

  messages = input.required<Signal<SavedMessage[]>>();
  recipient = input.required<Signal<{ id: number; username: string } | null>>();

   
  ngAfterViewChecked(): void {
    this.chatContainer.nativeElement.scrollTop =
      this.chatContainer.nativeElement.scrollHeight;
  }
}
