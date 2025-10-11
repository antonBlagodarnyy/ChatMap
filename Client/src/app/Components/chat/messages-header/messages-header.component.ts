import { Component, OnInit } from '@angular/core';
import { ChatService } from '../../../Services/chat.service';

@Component({
  selector: 'app-messages-header',
  imports: [],
  template: `<h2>{{ recipientName ? recipientName : 'User unknown' }}</h2>`,
  styles: ``,
})
export class MessagesHeaderComponent implements OnInit {
  constructor(private chatService: ChatService) {}
  recipientName: String | undefined;
  ngOnInit(): void {
    this.chatService.retrieveRecipient();
    this.recipientName = this.chatService.recipient?.username;
  }
}
