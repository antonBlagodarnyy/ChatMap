import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { ChatService } from '../../../Services/chat.service';
import { MessageComponent } from './message/message.component';
import { UserService } from '../../../Services/user.service';

@Component({
  selector: 'app-messages',
  imports: [],
  template: `<p>Messages work</p>`,
})
export class MessagesComponent implements OnInit {
  constructor(
    private chatService: ChatService,
    private viewContainerRef: ViewContainerRef,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.chatService.connect()?.subscribe({
      next: (value) => {
        console.log('message received: ' + value);
        const message = this.viewContainerRef.createComponent(MessageComponent);
        this.userService
          .getUserById(value.from)
          .subscribe((u) => (message.instance.sender = u.username));
        message.instance.msg = value.text;
      }, // Called whenever there is a message from the server.
      error: (err) => console.log(err), // Called if at any point WebSocket API signals some kind of error.
      complete: () => console.log('complete'), // Called when connection is closed (for whatever reason).
    });
  }
  //TODO fetch messages from db and show already stored messages

  //TODO connect to the websocket and on next render a new message
}
