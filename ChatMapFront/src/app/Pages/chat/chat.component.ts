import { Component} from '@angular/core';
import { HeaderComponent } from '../../Components/map/header/header.component';

import { MessageInputComponent } from '../../Components/chat/message-input/message-input.component';

import { MessagesComponent } from '../../Components/chat/messages/messages.component';
import { MessagesHeaderComponent } from "../../Components/chat/messages-header/messages-header.component";

@Component({
  selector: 'app-chat',
  imports: [HeaderComponent, MessageInputComponent, MessagesComponent, MessagesHeaderComponent],
  template: `<app-header></app-header>
    <div class="container-chat">
      <app-messages-header></app-messages-header>
      <app-messages></app-messages>
      <app-message-input></app-message-input>
    </div> `,
  styleUrl: './chat.component.css',
})
export class ChatComponent {
  constructor() {}

}
